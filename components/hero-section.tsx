"use client"

import Link from "next/link"
import { ArrowRight, Handshake, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroPhone } from "@/components/hero-phone"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-16">
      <div className="hero-grid absolute inset-0 opacity-60" />
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid border border-border/70 bg-card/50 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-24">
            <div className="mb-7 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"><Handshake className="h-3.5 w-3.5" /> Your engineering partner</div>
            <h1 className="max-w-4xl text-[2.6rem] font-black uppercase leading-[0.95] tracking-[-0.045em] text-foreground sm:text-7xl lg:text-[5rem] xl:text-[5.75rem]">Your vision.<br /><span className="text-gradient">Our<br />engineering.</span></h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">The engineering partner for founders and growing companies. We architect, build, scale, and run your software across product, AI, data, and cloud — and every decision stays with you.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="#contact"><Button size="lg" className="hero-button group h-13 rounded-none bg-primary px-6 font-bold text-primary-foreground"><span>Start a project</span><ArrowRight className="ml-7 h-4 w-4 transition-transform group-hover:translate-x-1" /></Button></Link><Link href="#work"><Button size="lg" variant="outline" className="h-13 rounded-none border-border bg-transparent px-6 font-bold hover:bg-secondary"><Play className="mr-3 h-4 w-4" /> See our work</Button></Link></div>
          </div>
          <div className="relative min-h-[410px] border-t border-border/70 bg-secondary/50 p-5 lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,color-mix(in_oklab,var(--primary)_12%,transparent)_45%,transparent_46%)]" />
            <div className="relative mx-auto flex h-full w-full max-w-[320px] items-center justify-center">
              <HeroPhone />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
