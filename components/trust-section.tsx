"use client"

import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Teqade transformed our rough concept into a production-ready platform in just 12 weeks. Their technical depth and startup mindset made all the difference.",
    author: "Judith Thinaharan",
    role: "Founder & MD",
    company: "Motomate India",
  },
  {
    quote:
      "Working with Teqade felt like having a world-class engineering team in-house. They understood our vision and executed flawlessly.",
    author: "Darshan Balaji",
    role: "CEO",
    company: "Toddler Tales",
  },
  {
    quote:
      "The team at Teqade doesn't just build software — they become true partners in your product journey. Highly recommend for any startup.",
    author: "Parvathi Ganesan",
    role: "Director",
    company: "Steerlit Technologies",
  },
]

export function TrustSection() {
  return (
    <section className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Built for Founders. Trusted by Teams.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="relative p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              
              {/* Quote */}
              <p className="text-foreground/90 text-pretty mb-6 leading-relaxed">
                {`"${testimonial.quote}"`}
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
