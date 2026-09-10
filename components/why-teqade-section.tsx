"use client"

import { Compass, KeyRound, Layers, LockOpen, Users, Cpu } from "lucide-react"

const differentiators = [
  {
    icon: Compass,
    title: "You Call the Shots",
    description:
      "We recommend with clear trade-offs; you decide. Key architecture decisions are documented, so nothing changes behind your back.",
  },
  {
    icon: KeyRound,
    title: "You Own Everything",
    description:
      "Code, IP, repositories, and cloud accounts are yours from day one, with full visibility into progress at all times.",
  },
  {
    icon: Layers,
    title: "Architect-Led Delivery",
    description:
      "Senior architects lead every engagement, so your foundations are scalable, secure, and built to last.",
  },
  {
    icon: LockOpen,
    title: "No Lock-In",
    description:
      "Documentation and knowledge transfer are built into every engagement. Take it in-house whenever you're ready.",
  },
  {
    icon: Users,
    title: "A Team That Flexes",
    description:
      "Scale engineers up for a launch and back down after. Your team size follows your roadmap.",
  },
  {
    icon: Cpu,
    title: "AI-Native, Secure by Default",
    description:
      "AI and DevSecOps are woven into everything we build — never bolted on later.",
  },
]

export function WhyTeqadeSection() {
  return (
    <section id="why-teqade" className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Why Teqade
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance">
            Your Vision Stays Yours
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {"We're your engineering partner, not your co-founder. You keep the equity and the final say — we bring the expertise and the hands to build it."}
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="group bg-card p-6 hover:bg-secondary transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 border border-primary/30 bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
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
