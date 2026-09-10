"use client"

import { Target, Users, UserPlus, LifeBuoy, Compass, ArrowRightLeft } from "lucide-react"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const models = [
  {
    icon: Target,
    bestFor: "Defined scope",
    title: "Project-Based",
    description:
      "Fixed deliverables, milestones, and outcomes. Ideal for an MVP, a migration, or a well-scoped build.",
  },
  {
    icon: Users,
    bestFor: "Ongoing product",
    title: "Dedicated Team",
    description:
      "A full squad of architects, engineers, and QA embedded with your team, scaled up or down as you grow.",
  },
  {
    icon: UserPlus,
    bestFor: "Skill gaps",
    title: "Staff Augmentation",
    description:
      "Vetted engineers who join your existing team, follow your processes, and report to your leads.",
  },
  {
    icon: LifeBuoy,
    bestFor: "Run & operate",
    title: "Managed Services",
    description:
      "We own day-to-day operations of your platforms against agreed SLAs, with 24×7 monitoring and support.",
  },
  {
    icon: Compass,
    bestFor: "Strategy",
    title: "Consulting & Advisory",
    description:
      "Architecture reviews, assessments, and roadmaps. You get clear options and trade-offs — you make the call.",
  },
  {
    icon: ArrowRightLeft,
    bestFor: "New capability",
    title: "Build-Operate-Transfer",
    description:
      "We build it and run it, then hand it over to your in-house team, fully documented.",
  },
]

export function HowWeWorkSection() {
  return (
    <section id="how-we-work" className="py-20 sm:py-28 relative bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            How We Work
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance">
            Partner the Way That Fits
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Flexible engagement models that adapt to your scope, team, and stage. Whatever the
            model, you own the code and the decisions.
          </p>
        </div>

        {/* Banner (photo: Annie Spratt, Unsplash License) */}
        <div className="relative mb-8 h-56 overflow-hidden border border-border sm:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/images/sections/collaboration.jpg`}
            alt="A product team collaborating around laptops"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-8 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">One team</span>
            <p className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-foreground sm:text-3xl">
              We embed with your team. You keep every decision.
            </p>
          </div>
        </div>

        {/* Engagement Models */}
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.title}
              className="group bg-background p-6 transition-all duration-300 hover:bg-secondary"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 border border-primary/30 bg-secondary text-primary">
                  <model.icon className="h-5 w-5" />
                </div>
                <span className="border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                  {model.bestFor}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {model.title}
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                {model.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
