const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

// The live chat animation (public/embed/teqade-messages.html) in phone-only mode: visitors
// touch the fingerprint to unlock it, it plays with sound, then fades back to the lock screen.
// The rounding matches the phone's 112px corners on its 820×1780 frame.
const phoneShape = { borderRadius: "14% / 6.45%" }

export function HeroPhone() {
  return (
    <div
      className="relative aspect-[820/1780] w-full overflow-hidden"
      style={{ ...phoneShape, boxShadow: "0 30px 80px rgba(0, 0, 0, 0.55)" }}
    >
      <iframe
        src={`${basePath}/embed/teqade-messages.html?embed=1`}
        title="Teqade chat demo: touch the fingerprint to unlock the phone and watch the conversation"
        allow="autoplay"
        className="absolute inset-0 h-full w-full border-0"
        style={{ colorScheme: "normal" }}
      />
    </div>
  )
}
