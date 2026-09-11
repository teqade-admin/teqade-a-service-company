"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ContactButtons } from "@/components/contact-buttons"
import { useProjectForm } from "@/components/project-form"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function CTASection() {
  const openProjectForm = useProjectForm()
  return (
    <section id="contact" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background photo, darkened (Vitaly Gariev, Unsplash License) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${basePath}/images/sections/celebrate.jpg`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-background/70" />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="relative z-10 mx-auto max-w-5xl border border-border/70 bg-card/40 px-6 py-14 sm:px-10 sm:py-20 text-center">
        {/* Main Content */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] inline-block title-spotlight text-balance mb-6">
          Have an Idea?{" "}
          {"Let's Build It."}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty mb-10">
          {"Launching a startup, bringing AI into production, or scaling an existing platform? Bring the vision — we'll bring the engineering."}
        </p>

        {/* CTA Buttons */}
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          <Button
            size="lg"
            onClick={openProjectForm}
            className="group h-11 w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 px-8"
          >
            Start Your Product Journey
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <ContactButtons withMail className="w-full" />
        </div>

      </div>
    </section>
  )
}
