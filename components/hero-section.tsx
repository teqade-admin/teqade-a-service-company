"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Code2, Database, Cpu, Globe, GitBranch, Terminal, Cloud, Layers, Wifi, Lock, Zap, Server, BrainCircuit, Smartphone } from "lucide-react"
import Link from "next/link"

const floatingIcons = [
  { Icon: Code2,        y: "8%",  delay: "0s",    duration: "18s", size: 22 },
  { Icon: Database,     y: "20%", delay: "3s",    duration: "22s", size: 18 },
  { Icon: Cpu,          y: "35%", delay: "1s",    duration: "20s", size: 20 },
  { Icon: Globe,        y: "50%", delay: "5s",    duration: "16s", size: 24 },
  { Icon: GitBranch,    y: "62%", delay: "2s",    duration: "24s", size: 18 },
  { Icon: Terminal,     y: "75%", delay: "7s",    duration: "19s", size: 20 },
  { Icon: Cloud,        y: "88%", delay: "0.5s",  duration: "21s", size: 22 },
  { Icon: Layers,       y: "14%", delay: "9s",    duration: "17s", size: 20 },
  { Icon: Wifi,         y: "28%", delay: "4s",    duration: "23s", size: 18 },
  { Icon: Lock,         y: "44%", delay: "11s",   duration: "20s", size: 16 },
  { Icon: Zap,          y: "57%", delay: "6s",    duration: "18s", size: 20 },
  { Icon: Server,       y: "70%", delay: "13s",   duration: "22s", size: 18 },
  { Icon: BrainCircuit, y: "82%", delay: "2.5s",  duration: "19s", size: 22 },
  { Icon: Smartphone,   y: "93%", delay: "8s",    duration: "21s", size: 18 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f1a_1px,transparent_1px),linear-gradient(to_bottom,#0f0f1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* Floating Tech Icons — drift left to right */}
      {floatingIcons.map(({ Icon, y, delay, duration, size }, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: y,
            left: 0,
            animation: `driftAcross ${duration} linear ${delay} infinite`,
          }}
        >
          <div className="p-2 rounded-lg border border-primary/10 bg-card/10 backdrop-blur-sm">
            <Icon
              style={{ width: size, height: size }}
              className="text-primary/30"
              strokeWidth={1.5}
            />
          </div>
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm text-muted-foreground">Product Engineering for Startups</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
          <span className="text-foreground">We Build Startup Dreams</span>
          <br />
          <span className="text-gradient">Into Scalable Products</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground text-pretty mb-10">
          From idea to architecture to production — we design, build, and scale
          world-class software products with AI-native thinking and startup-first execution.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#contact">
            <Button
              size="lg"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 px-8"
            >
              Build Your Product
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#work">
            <Button
              size="lg"
              variant="outline"
              className="group border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 px-8"
            >
              <Play className="mr-2 h-4 w-4" />
              View Our Work
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/30 pt-12">
          {[
            { value: "10+", label: "Products Shipped" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "10x", label: "Faster to Market" },
            { value: "24/7", label: "Support & Scaling" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
