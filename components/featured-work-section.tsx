"use client"

import { ArrowUpRight, Globe, Car, Gauge } from "lucide-react"

const projects = [
  {
    icon: Globe,
    category: "Smartbell UK - Cattle Health Monitoring Platform",
    title: "Intelligent Cattle Monitoring",
    description:
      "Built an ML-powered platform that processes thousands of sensor data from dozens of farms and hundreds of cattle regularly, extracting insights and identifying activities, behaviours, and workflows for determining health and anomalies.",
    tags: ["AWS", "Python", "Clickhouse"],
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Car,
    category: "SaaS Application",
    title: "Garage Revenue Engine",
    description:
      "MotoMate is a smart garage management platform that digitizes vehicle servicing, customer communication, and workflow tracking in one seamless system that helps garages improve efficiency, increase revenue, and deliver a modern, transparent service experience.",
    tags: ["Flutter", "FastAPI", "WhatsappBusinessAPI", "Supabase", "Razorpay"],
    gradient: "from-accent/20 to-primary/20",
  },
  {
    icon: Gauge,
    category: "Automotive AI & Vehicle Intelligence Platform",
    title: "Steerlit — The Future of Car Intelligence",
    description:
      "Steerlit is an AI-powered smart car platform that monitors vehicle health in real time and delivers predictive insights to enhance safety, performance, and maintenance.",
    tags: ["Flutter", "Python", "AWS", "Razorpay", "OBD"],
    gradient: "from-primary/20 via-transparent to-accent/20",
  },
]

export function FeaturedWorkSection() {
  return (
    <section id="work" className="py-20 sm:py-28 relative bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Featured Work
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance">
            Built the Founder Way
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Real products we have engineered alongside founders. Their vision, our engineering,
            shipped to production.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative flex h-full flex-col overflow-hidden bg-background transition-all duration-300 hover:bg-secondary"
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                <div className="flex h-16 w-16 items-center justify-center border border-foreground/10 bg-background/10 backdrop-blur-sm">
                  <project.icon className="h-8 w-8 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground text-pretty">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center border border-border px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
