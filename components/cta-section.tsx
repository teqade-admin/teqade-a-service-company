"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-6">
          Have an Idea?{" "}
          <span className="text-gradient">{"Let's Build It."}</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty mb-10">
          {"Whether you're launching a startup or scaling an existing product, we're here to help you build something great."}
        </p>

        {/* CTA Button */}
        <Link href="mailto:info@teqade.com">
          <Button
            size="lg"
            className="group bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 px-8 mb-12"
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
