"use client"

import dynamic from "next/dynamic"
import type { BuilderStage } from "@/components/builder-scene"

// three.js is loaded only on the client, in its own chunk.
const BuilderScene = dynamic(() => import("@/components/builder-scene").then((m) => m.BuilderScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-secondary/30" />,
})

const stages: BuilderStage[] = [
  { label: "Architect", color: "#5CFF8A" },
  { label: "Build", color: "#22D3EE" },
  { label: "Scale", color: "#A78BFA" },
  { label: "Run", color: "#FBBF24" },
]

export function BuildShowcaseSection() {
  return (
    <section aria-labelledby="build-showcase-title" className="px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto grid max-w-7xl border border-border/70 bg-card/40 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="flex flex-col justify-center border-b border-border/70 px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Four arms. One partner.
          </span>
          <h2
            id="build-showcase-title"
            className="mt-4 text-4xl sm:text-5xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance"
          >
            Your empire, chip by chip.
          </h2>
          <p className="mt-5 text-muted-foreground text-pretty">
            Architect, build, scale, and run: four disciplines working in parallel on your product.
            You bring the vision and make the calls. We bring the engineering.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-px bg-border">
            {stages.map((stage, index) => (
              <li key={stage.label} className="flex items-center gap-3 bg-card px-4 py-3">
                <span className="h-2.5 w-2.5" style={{ backgroundColor: stage.color, boxShadow: `0 0 12px ${stage.color}` }} />
                <span className="text-xs text-muted-foreground">0{index + 1}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">{stage.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[400px] overflow-hidden sm:h-[480px] lg:h-[560px]">
          <BuilderScene stages={stages} />
        </div>
      </div>
    </section>
  )
}
