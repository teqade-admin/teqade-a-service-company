"use client"

import { Zap, Users, Shield, TrendingUp, Cpu, Clock } from "lucide-react"

const differentiators = [
  {
    icon: Users,
    title: "Startup-First Mindset",
    description:
      "We understand the unique challenges startups face. Speed, budget constraints, and the need to pivot — we get it.",
  },
  {
    icon: Shield,
    title: "Architect-Led Development",
    description:
      "Every project is led by senior architects who ensure technical excellence and scalable foundations.",
  },
  {
    icon: Zap,
    title: "Fast Execution",
    description:
      "We ship fast without compromising quality. Weekly sprints, daily standups, and continuous delivery.",
  },
  {
    icon: TrendingUp,
    title: "Scalable From Day One",
    description:
      "We build for growth. Your MVP is designed to handle 10x traffic from the start.",
  },
  {
    icon: Cpu,
    title: "AI-Native Thinking",
    description:
      "AI is not an afterthought. We integrate intelligent capabilities into every product we build.",
  },
  {
    icon: Clock,
    title: "Transparent Communication",
    description:
      "No black boxes. You get full visibility into progress, decisions, and code from day one.",
  },
]

export function WhyTeqadeSection() {
  return (
    <section id="why-teqade" className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Why Teqade
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Built Different
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {"We're not just another dev shop. We're your technical co-founders."}
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-xl border border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                <item.icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
