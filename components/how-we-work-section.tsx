"use client"

import { Lightbulb, GitBranch, Hammer, TrendingUp } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Idea",
    description:
      "We start by understanding your vision, goals, and constraints. Together, we define the product scope and success metrics.",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "Architecture",
    description:
      "Our architects design scalable foundations. We choose the right tech stack and create systems that grow with your business.",
  },
  {
    number: "03",
    icon: Hammer,
    title: "Build",
    description:
      "Agile development with weekly deliverables. We iterate fast, maintain quality, and keep you in the loop throughout.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Scale",
    description:
      "Launch to production with confidence. We optimize performance, handle growth, and provide ongoing support.",
  },
]

export function HowWeWorkSection() {
  return (
    <section id="how-we-work" className="py-24 sm:py-32 relative bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Our Process
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            From Concept to Launch
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            A battle-tested process that turns your ideas into production-ready products.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group"
              >
                {/* Step Card */}
                <div className="relative p-6 rounded-2xl border border-border/50 bg-background hover:border-primary/30 transition-all duration-300 h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mt-4 mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 items-center justify-center z-10">
                    <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
