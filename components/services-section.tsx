"use client"

import { Rocket, BrainCircuit, Database } from "lucide-react"

const focusAreas = [
  {
    icon: Rocket,
    audience: "Startups & product teams",
    title: "Idea to Product",
    description:
      "Have an idea? We give you the engineering team to build it — architecture, MVP, launch, and scale — without hiring one first.",
    features: ["MVP Development", "Web & Mobile Apps", "APIs & Microservices"],
  },
  {
    icon: BrainCircuit,
    audience: "Companies in AI transformation",
    title: "AI in Production",
    description:
      "Move AI out of pilots and into your workflows. Agents, copilots, and RAG systems that are grounded, observable, and safe.",
    features: ["Agentic AI", "RAG & Copilots", "Document Processing"],
  },
  {
    icon: Database,
    audience: "Data-driven companies",
    title: "Native Data Workflows",
    description:
      "Pipelines, orchestration, and lakehouses that make your data reliable for analytics, ML, and AI.",
    features: ["Data Pipelines", "Apache Airflow", "Lakehouse & Warehousing"],
  },
]

const stages = [
  {
    number: "01",
    title: "Architect",
    summary: "Get the foundations right.",
    services: [
      "Solution architecture & system design",
      "Cloud landing zones & governance",
      "Security & zero-trust design",
      "Technical assessments & roadmaps",
    ],
  },
  {
    number: "02",
    title: "Build",
    summary: "Ship production-grade software.",
    services: [
      "Web, mobile & full-stack apps",
      "APIs, microservices & integrations",
      "Agentic AI, RAG & LLM apps",
      "Data pipelines & document processing",
    ],
  },
  {
    number: "03",
    title: "Scale",
    summary: "Grow without breaking.",
    services: [
      "Cloud migration & modernization",
      "Kubernetes & container platforms",
      "DevOps, CI/CD & infrastructure as code",
      "Performance, observability & FinOps",
    ],
  },
  {
    number: "04",
    title: "Run",
    summary: "Keep it reliable, every day.",
    services: [
      "Managed services & 24×7 monitoring",
      "SRE, SLOs & incident response",
      "L1/L2/L3 support",
      "Continuous cost & performance optimization",
    ],
  },
]

const practices = ["DevSecOps", "Test Automation", "Observability", "Documentation", "Knowledge Transfer"]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 relative">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 grid gap-5 border-l-2 border-primary pl-5 md:grid-cols-[0.8fr_1.2fr] md:items-end md:pl-7">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance">
            One Partner. Every Stage.
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty md:pb-1">
            Full-lifecycle engineering across product, AI, data, cloud, and security — from the
            first architecture decision to 24×7 operations.
          </p>
        </div>

        {/* Focus Areas */}
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {focusAreas.map((area) => (
            <div
              key={area.title}
              className="group relative flex flex-col bg-card p-8 transition-all duration-300 hover:bg-secondary"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <area.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {area.audience}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-foreground mb-3">
                {area.title}
              </h3>
              <p className="flex-1 text-muted-foreground mb-6 text-pretty">
                {area.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {area.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center border border-border px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Lifecycle Stages */}
        <h3 className="mt-16 mb-6 text-2xl sm:text-3xl font-black uppercase leading-none tracking-[-0.04em] text-foreground">
          Across your software lifecycle
        </h3>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <div key={stage.title} className="bg-background p-6 transition-all duration-300 hover:bg-secondary">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-bold text-primary">{stage.number}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-wider text-foreground">
                {stage.title}
              </h4>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">{stage.summary}</p>
              <ul className="flex flex-col gap-2.5">
                {stage.services.map((service) => (
                  <li key={service} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-primary">→</span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cross-cutting Practices */}
        <div className="flex flex-wrap items-center gap-2 border-x border-b border-border bg-card/50 px-6 py-4">
          <span className="mr-2 text-xs font-bold uppercase tracking-wider text-foreground">
            Built into every stage
          </span>
          {practices.map((practice) => (
            <span
              key={practice}
              className="inline-flex items-center border border-border px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {practice}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
