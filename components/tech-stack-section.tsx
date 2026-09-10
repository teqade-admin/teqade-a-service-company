"use client"

import { useState } from "react"
import { stackCategories as categories } from "@/components/tech-stack-data"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

// Polygon geometry in a 1000 x 920 box: one triangular wedge per category, first vertex at the top.
const N = categories.length
const SECTOR = 360 / N
const W = 1000
const H = 920
const CX = 500
const CY = 470
const R = 380
const rad = (deg: number) => (deg * Math.PI) / 180
// Node and the browser can disagree in the last digits of Math.cos/sin; rounding keeps
// server-rendered and hydrated attributes identical.
const round = (n: number) => Math.round(n * 1000) / 1000
const vertex = (k: number, scale = 1) => {
  const a = rad(-90 + SECTOR * k)
  return [round(CX + R * scale * Math.cos(a)), round(CY + R * scale * Math.sin(a))] as const
}
const polygonPoints = (scale: number) => Array.from({ length: N }, (_, k) => vertex(k, scale).join(",")).join(" ")
const wedgePoints = (sector: number) => [[CX, CY], vertex(sector), vertex(sector + 1)].map((p) => p.join(",")).join(" ")

// Tiles sit in rows across each wedge; each row holds as many as fit inside the triangle,
// filled from the outer edge inward so the hub stays clear.
const TILE = 36
const SPACING = 44
const ROW_DEPTHS = [0.78, 0.66, 0.54, 0.42, 0.3]
const rowCapacity = ROW_DEPTHS.map((d) =>
  Math.max(1, Math.floor(((Math.tan(Math.PI / N) * d * R - TILE * 0.6) * 2) / SPACING + 1)),
)
const tilePositions = (sector: number, count: number) => {
  const theta = rad(-90 + SECTOR * (sector + 0.5))
  const [mx, my, px, py] = [Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta)]
  const positions: { x: number; y: number }[] = []
  let left = count
  ROW_DEPTHS.forEach((d, row) => {
    const n = Math.min(rowCapacity[row], left)
    left -= n
    for (let j = 0; j < n; j++) {
      const v = (j - (n - 1) / 2) * SPACING
      positions.push({ x: CX + d * R * mx + v * px, y: CY + d * R * my + v * py })
    }
  })
  return positions
}
const labelPosition = (sector: number) => {
  const theta = rad(-90 + SECTOR * (sector + 0.5))
  return { x: CX + R * 1.07 * Math.cos(theta), y: CY + R * 1.07 * Math.sin(theta) }
}
const pct = ({ x, y }: { x: number; y: number }) => ({ left: `${round((x / W) * 100)}%`, top: `${round((y / H) * 100)}%` })
const total = categories.reduce((n, category) => n + category.tech.length, 0)

function Logo({ name, file, className = "" }: { name: string; file: string; className?: string }) {
  return (
    <div className={`group relative grid place-items-center bg-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${basePath}/logos/${file}.svg`} alt={name} title={name} loading="lazy" className="h-full w-full object-contain" />
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </span>
    </div>
  )
}

export function TechStackSection() {
  const [active, setActive] = useState<number | null>(null)
  const dim = (i: number) => (active === null || active === i ? "opacity-100" : "opacity-20")

  return (
    <section id="stack" className="py-20 sm:py-28 relative">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 grid gap-5 border-l-2 border-primary pl-5 md:grid-cols-[0.8fr_1.2fr] md:items-end md:pl-7">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Our Stack · {total}+ tools</span>
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance">
            Open Tools. Proven at Scale.
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty md:pb-1">
            The open-source, cloud, and enterprise platforms we build with every day, grouped by the
            layer of your stack they power.
          </p>
        </div>

        <div className="border border-border">
          {/* Categories: a legend on desktop, logo cards on mobile */}
          <ol className="grid gap-px border-b border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, i) => (
              <li
                key={category.title}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`p-5 outline-none transition-colors duration-200 ${active === i ? "bg-secondary" : "bg-card"}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold text-primary">0{i + 1}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{category.title}</h3>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">{category.tech.length}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground text-pretty">{category.blurb}</p>
                <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 md:hidden">
                  {category.tech.map(([name, file]) => (
                    <Logo key={file} name={name} file={file} className="aspect-square p-1.5" />
                  ))}
                </div>
              </li>
            ))}
            {N % 4 !== 0 && (
              <li aria-hidden="true" className="hidden flex-col justify-center bg-card p-5 lg:flex" style={{ gridColumn: `span ${4 - (N % 4)}` }}>
                <span className="text-4xl font-black tracking-[-0.06em] text-primary">{total}+</span>
                <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Tools in production use · hover a category to light it up</span>
              </li>
            )}
          </ol>

          {/* The polygon: one wedge per category */}
          <div className="hidden bg-background p-6 md:block lg:p-10">
            <div className="relative mx-auto w-full max-w-5xl" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                {categories.map((category, i) => (
                  <polygon
                    key={category.title}
                    points={wedgePoints(i)}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    className={`stroke-border transition-colors duration-200 ${active === i ? "fill-primary/10 stroke-primary/60" : "fill-card/40"}`}
                    strokeWidth={1.5}
                  />
                ))}
                {[0.36, 0.6].map((scale) => (
                  <polygon key={scale} points={polygonPoints(scale)} className="fill-none stroke-border" strokeDasharray="6 8" strokeWidth={1} />
                ))}
                <polygon points={polygonPoints(1)} className="fill-none stroke-primary/50" strokeWidth={2} />
                {/* hub: tiles fill from the outer rings inward, so the inner two rings are free */}
                <polygon points={polygonPoints(0.26)} className="fill-background stroke-primary" strokeWidth={2} />
                <text x={CX} y={CY + 2} textAnchor="middle" className="fill-primary text-[20px] font-black uppercase tracking-[0.12em]">
                  Teqade
                </text>
                <text x={CX} y={CY + 26} textAnchor="middle" className="fill-muted-foreground text-[12px] font-semibold uppercase tracking-[0.3em]">
                  Stack
                </text>
              </svg>

              {categories.map((category, i) => {
                const positions = tilePositions(i, category.tech.length)
                return (
                  <div key={category.title} className={`transition-opacity duration-200 ${dim(i)}`}>
                    {category.tech.map(([name, file], j) => (
                      <div key={file} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ ...pct(positions[j]), width: `${round((TILE / W) * 100)}%` }}>
                        <Logo name={name} file={file} className="aspect-square p-[12%]" />
                      </div>
                    ))}
                    <div
                      className="pointer-events-none absolute w-[16%] -translate-x-1/2 -translate-y-1/2 text-center text-[11px] font-bold uppercase leading-tight tracking-wider text-foreground"
                      style={pct(labelPosition(i))}
                    >
                      <span className="block text-primary">0{i + 1}</span>
                      {category.title}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              Logos are trademarks of their respective owners.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
