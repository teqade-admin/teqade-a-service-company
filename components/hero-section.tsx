"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, Handshake, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const stages = ["Architect", "Build", "Scale", "Run"]

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
            <h1 className="max-w-4xl text-[2.75rem] font-black uppercase leading-[0.9] tracking-[-0.07em] text-foreground sm:text-7xl lg:text-[5.25rem]">Your vision.<br /><span className="text-gradient">Our<br />engineering.</span></h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">The engineering partner for founders and growing companies. We architect, build, scale, and run your software across product, AI, data, and cloud — and every decision stays with you.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="#contact"><Button size="lg" className="hero-button group h-13 rounded-none bg-primary px-6 font-bold text-primary-foreground"><span>Start a project</span><ArrowRight className="ml-7 h-4 w-4 transition-transform group-hover:translate-x-1" /></Button></Link><Link href="#work"><Button size="lg" variant="outline" className="h-13 rounded-none border-border bg-transparent px-6 font-bold hover:bg-secondary"><Play className="mr-3 h-4 w-4" /> See our work</Button></Link></div>
          </div>
          <div className="relative min-h-[410px] border-t border-border/70 bg-secondary/50 p-5 lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,color-mix(in_oklab,var(--primary)_12%,transparent)_45%,transparent_46%)]" />
            <div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">01 / Product velocity</span><ArrowUpRight className="h-5 w-5 text-primary" /></div><div className="relative mx-auto grid h-48 w-48 place-items-center border border-primary/50 bg-background/50 sm:h-56 sm:w-56"><div className="absolute inset-4 border border-primary/20" /><div className="absolute inset-9 border border-accent/30" /><span className="relative text-7xl font-black tracking-[-0.1em] text-gradient">10×</span></div><div className="grid grid-cols-2 gap-px bg-border"><div className="bg-card p-4"><p className="text-2xl font-black text-foreground">10+</p><p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Products shipped</p></div><div className="bg-card p-4"><p className="text-2xl font-black text-foreground">98%</p><p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Client love</p></div></div></div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-x border-b border-border/70 bg-background/70 sm:grid-cols-4">{stages.map((item, index) => <div key={item} className="flex items-center gap-3 border-r border-border/70 px-4 py-4 last:border-r-0 sm:px-6"><span className="text-xs text-primary">0{index + 1}</span><span className="text-xs font-bold uppercase tracking-wider text-foreground">{item}</span></div>)}</div>
      </div>
    </section>
  )
}
