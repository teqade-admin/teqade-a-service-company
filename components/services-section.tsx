"use client"

import { Code2, Brain, Layers, Rocket } from "lucide-react"

const services = [
  {
    icon: Code2,
    title: "Product Engineering",
    description:
      "End-to-end development from concept to deployment. We build robust, scalable applications using modern tech stacks and best practices.",
    features: ["Full-stack Development", "API Design", "Cloud Architecture"],
  },
  {
    icon: Brain,
    title: "AI & Intelligent Systems",
    description:
      "Integrate cutting-edge AI capabilities into your product. From LLMs to automation, we make your software smarter.",
    features: ["LLM Integration", "ML Pipelines", "Intelligent Automation"],
  },
  {
    icon: Layers,
    title: "Architecture & Scaling",
    description:
      "Enterprise-grade system design that grows with you. We architect for performance, reliability, and scale from day one.",
    features: ["System Design", "Performance Optimization", "Infrastructure"],
  },
  {
    icon: Rocket,
    title: "MVP to Scale",
    description:
      "Startup-focused execution that gets you to market fast. We help you validate, iterate, and scale your product efficiently.",
    features: ["Rapid Prototyping", "Market Validation", "Growth Engineering"],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Building the Future of Software
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            We combine deep technical expertise with startup agility to deliver 
            products that matter.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <service.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
