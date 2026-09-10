"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function CTASection() {
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
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] text-foreground text-balance mb-6">
          Have an Idea?{" "}
          <span className="text-gradient">{"Let's Build It."}</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty mb-10">
          {"Launching a startup, bringing AI into production, or scaling an existing platform? Bring the vision — we'll bring the engineering."}
        </p>

        {/* CTA Button */}
        <Link href="mailto:info@teqade.com">
          <Button
            size="lg"
            className="group rounded-none bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 px-8 mb-12"
          >
            Start Your Product Journey
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          <a
            href="mailto:info@teqade.com"
            className="flex items-center gap-2 hover:text-foreground transition-colors duration-200"
          >
            <Mail className="h-4 w-4 text-primary" />
            info@teqade.com
          </a>
          <span className="hidden sm:block text-border">|</span>
          <a
            href="tel:+919952234440"
            className="flex items-center gap-2 hover:text-foreground transition-colors duration-200"
          >
            <Phone className="h-4 w-4 text-primary" />
            +91 9952234440
          </a>
        </div>
      </div>
    </section>
  )
}
