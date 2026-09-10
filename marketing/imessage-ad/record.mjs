// Renders the chat animation (public/embed/teqade-messages.html) into an MP4, frame by frame,
// with its sounds mixed in. No screen recording needed: the page exposes
// window.__ad.renderAt(ms), so every frame is exact and the output is identical on every run.
//
//   npm install                     (once, in this folder; uses your installed Chrome)
//   node record.mjs                 → teqade-imessage-ad.mp4 (full video with sound)
//   node record.mjs --lock-loop     → teqade-lock-loop.mp4 (locked screen, seamless loop, silent)
//   FPS=60 node record.mjs out.mp4
//
// Encodes with the ffmpeg binary bundled by ffmpeg-static (override with FFMPEG_PATH).
// Set CHROME_PATH if Chrome isn't in /Applications.
import { spawn } from "node:child_process"
import { unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ffmpegStatic from "ffmpeg-static"
import puppeteer from "puppeteer-core"

const here = path.dirname(fileURLToPath(import.meta.url))
// the animation lives in the website so the site and the videos share one source
const PAGE = path.join(here, "../../public/embed/teqade-messages.html")
const args = process.argv.slice(2)
const LOCK_LOOP = args.includes("--lock-loop")
const out = path.resolve(args.find((a) => !a.startsWith("--")) ?? path.join(here, LOCK_LOOP ? "teqade-lock-loop.mp4" : "teqade-imessage-ad.mp4"))
const FPS = Number(process.env.FPS ?? 30)
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const FFMPEG = process.env.FFMPEG_PATH ?? ffmpegStatic ?? "ffmpeg"

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })
await page.goto(`${pathToFileURL(PAGE).href}?render=1${LOCK_LOOP ? "&lockloop=1" : ""}`)
await page.waitForFunction(() => window.__ad?.ready)
const { duration, sounds, keyVolume } = await page.evaluate(() => ({
  duration: window.__ad.duration,
  sounds: window.__ad.sounds,
  keyVolume: window.__ad.keyVolume ?? 0.14,
}))

// audio track: the same sounds the page plays live, placed at the exact moments they happen
const wavPath = sounds.length ? `${out}.audio.wav` : null
if (wavPath) writeFileSync(wavPath, mixAudio(sounds, duration / 1000, keyVolume))

const frames = Math.round((duration / 1000) * FPS)
const audioIn = wavPath ? ["-i", wavPath] : []
const audioOut = wavPath ? ["-c:a", "aac", "-b:a", "192k", "-shortest"] : ["-an"]
const ffmpeg = spawn(
  FFMPEG,
  ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-", ...audioIn,
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", ...audioOut, out],
  { stdio: ["pipe", "inherit", "inherit"] },
)
const done = new Promise((resolve, reject) => ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))))

// frame i shows time i/FPS, so a loop's last frame sits one frame before its first repeats
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.__ad.renderAt(t), (i * 1000) / FPS)
  const png = await page.screenshot({ type: "png" })
  if (!ffmpeg.stdin.write(png)) await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve))
  if (i % FPS === 0) process.stdout.write(`\rrendering ${Math.round((i / frames) * 100)}%  (${i}/${frames} frames)`)
}
ffmpeg.stdin.end()
await done
await browser.close()
if (wavPath) unlinkSync(wavPath)
console.log(`\nwrote ${out}  (${(duration / 1000).toFixed(1)} s, ${frames} frames @ ${FPS} fps)`)

// Mixes the page's sounds with the same recipes it uses live (sine sweeps with fast decays).
// The video runs everything a little louder than the page: pops at 0.3 instead of 0.16.
function mixAudio(events, seconds, keyVolume) {
  const rate = 48000
  const videoGain = 0.3 / 0.16
  const length = Math.ceil((seconds + 1) * rate)
  const samples = new Float32Array(length)
  // [start Hz, end Hz, sweep s, peak, attack s, decay to silence s]
  const recipes = {
    send: [880, 440, 0.08, 0.3, 0.005, 0.12],
    receive: [660, 330, 0.08, 0.3, 0.005, 0.12],
    unlock: [1400, 1000, 0.08, 0.18, 0.005, 0.12],
    key: [950, 1450, 0.03, keyVolume * videoGain, 0.004, 0.05], // "bubble tick"
    space: [700, 1000, 0.03, keyVolume * videoGain, 0.004, 0.05],
    delete: [1100, 800, 0.03, keyVolume * videoGain, 0.004, 0.05],
  }
  for (const { t, kind } of events) {
    const [f0, f1, sweep, peak, attack, end] = recipes[kind] ?? recipes.receive
    const start = Math.round((t / 1000) * rate)
    let phase = 0
    for (let i = 0; i < end * rate && start + i < length; i++) {
      const s = i / rate
      phase += (2 * Math.PI * f0 * Math.pow(f1 / f0, Math.min(1, s / sweep))) / rate
      // exponential rise then exponential fall to -80 dB at `end`, matching the Web Audio ramps
      const envelope = s < attack ? Math.pow(s / attack, 3) : Math.exp((Math.log(1e-4) * (s - attack)) / (end - attack))
      samples[start + i] += Math.sin(phase) * envelope * peak
    }
  }
  const wav = Buffer.alloc(44 + length * 2)
  wav.write("RIFF", 0)
  wav.writeUInt32LE(36 + length * 2, 4)
  wav.write("WAVEfmt ", 8)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20) // PCM
  wav.writeUInt16LE(1, 22) // mono
  wav.writeUInt32LE(rate, 24)
  wav.writeUInt32LE(rate * 2, 28)
  wav.writeUInt16LE(2, 32)
  wav.writeUInt16LE(16, 34)
  wav.write("data", 36)
  wav.writeUInt32LE(length * 2, 40)
  samples.forEach((v, i) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2))
  return wav
}
