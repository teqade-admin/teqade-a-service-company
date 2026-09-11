"use client"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

// Cover photos from Unsplash (Unsplash License): Austin Distel, Growtika, Luke Chesser.

const focusAreas = [
  {
    audience: "Startups & product teams",
    title: "Idea to Product",
    description:
      "Have an idea? We give you the engineering team to build it — architecture, MVP, launch, and scale — without hiring one first.",
    features: ["MVP Development", "Web & Mobile Apps", "APIs & Microservices"],
    cover: "/images/sections/idea.jpg",
    coverAlt: "A startup team planning around a whiteboard",
  },
  {
    audience: "Companies in AI transformation",
    title: "AI in Production",
    description:
      "Move AI out of pilots and into your workflows. Agents, copilots, and RAG systems that are grounded, observable, and safe.",
    features: ["Agentic AI", "RAG & Copilots", "Document Processing"],
    cover: "/images/sections/ai.jpg",
    coverAlt: "An abstract neural network of glowing nodes and lines",
  },
  {
    audience: "Data-driven companies",
    title: "Native Data Workflows",
    description:
      "Pipelines, orchestration, and lakehouses that make your data reliable for analytics, ML, and AI.",
    features: ["Data Pipelines", "Apache Airflow", "Lakehouse & Warehousing"],
    cover: "/images/sections/data.jpg",
    coverAlt: "An analytics dashboard with charts on a laptop screen",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 relative">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 grid gap-5 border-l-2 border-primary pl-5 md:grid-cols-[0.8fr_1.2fr] md:items-end md:pl-7">
          <span className="block text-sm font-medium text-primary uppercase tracking-widest md:col-span-2">
            What We Do
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] inline-block title-spotlight text-balance">
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
              className="card-torch group relative flex flex-col bg-card p-8 transition-all duration-300 hover:bg-secondary"
            >
              {/* Cover photo, bleeding to the card edges */}
              <div className="relative -mx-8 -mt-8 mb-6 h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}${area.cover}`}
                  alt={area.coverAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent transition-colors duration-300 group-hover:from-secondary" />
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
      </div>
    </section>
  )
}
