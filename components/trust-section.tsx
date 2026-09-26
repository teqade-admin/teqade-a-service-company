"use client"

import { useEffect, useRef } from "react"
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
      "The team at Teqade doesn't just build software. They become true partners in your product journey. Highly recommend for any startup.",
    author: "Parvathi Ganesan",
    role: "Director",
    company: "Steerlit Technologies",
  },
  {
    // from Umang's public post about the launch of the Umang Vaish Bespoke site
    quote:
      "The team at Teqade built it, rebuilt it, and rebuilt it again, every time we changed our minds, which was often.",
    author: "Umang Vaish",
    role: "Managing Partner",
    company: "Umang Vaish Bespoke",
  },
]

// The row drifts on its own: the list is rendered twice and the scroll position wraps by the width
// of one copy, so it never reaches an end. Each card is sharpened or blurred by how close its
// centre is to the middle of the row.
const SPEED = 34 // px per second
const MAX_BLUR = 5 // px, at the edges

export function TrustSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let held = reduced // a visitor reading, dragging or tabbing through holds the row still
    let onScreen = true
    let raf = 0
    let last = performance.now()

    const focus = () => {
      const middle = track.clientWidth / 2
      for (const card of Array.from(track.children) as HTMLElement[]) {
        const off = Math.abs(card.offsetLeft + card.offsetWidth / 2 - track.scrollLeft - middle)
        const away = Math.min(1, Math.max(0, (off - card.offsetWidth * 0.4) / middle))
        card.style.filter = `blur(${(away * MAX_BLUR).toFixed(2)}px)`
        card.style.opacity = (1 - away * 0.6).toFixed(3)
        card.style.transform = `scale(${(1 - away * 0.06).toFixed(3)})`
      }
    }

    // distance from a card to its duplicate: scrolling past it lands on an identical row
    const period = () => {
      const cards = track.children as HTMLCollectionOf<HTMLElement>
      return cards[testimonials.length].offsetLeft - cards[0].offsetLeft
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!held && onScreen) track.scrollLeft += SPEED * dt
      const loop = period()
      if (loop > 0 && track.scrollLeft >= loop) track.scrollLeft -= loop
      focus()
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const hold = () => (held = true)
    const release = () => (held = reduced)
    const watcher = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting), { threshold: 0.05 })
    watcher.observe(track)
    track.addEventListener("pointerenter", hold)
    track.addEventListener("pointerleave", release)
    track.addEventListener("pointerdown", hold)
    track.addEventListener("focusin", hold)
    track.addEventListener("focusout", release)
    window.addEventListener("pointerup", release)

    return () => {
      cancelAnimationFrame(raf)
      watcher.disconnect()
      track.removeEventListener("pointerenter", hold)
      track.removeEventListener("pointerleave", release)
      track.removeEventListener("pointerdown", hold)
      track.removeEventListener("focusin", hold)
      track.removeEventListener("focusout", release)
      window.removeEventListener("pointerup", release)
    }
  }, [])

  return (
    <section className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="block text-sm font-medium text-primary uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-[-0.06em] inline-block title-spotlight text-balance">
            Built for Founders. Trusted by Teams.
          </h2>
        </div>
      </div>

      {/* Testimonials: a looping row, sharp in the middle and blurred at the edges */}
      <div
        ref={trackRef}
        style={{ scrollBehavior: "auto" }}
        className="relative z-10 flex gap-5 overflow-x-auto px-[calc(50%-124px)] py-4 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] [scrollbar-width:none] sm:px-[calc(50%-190px)] [&::-webkit-scrollbar]:hidden"
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div
            key={`${testimonial.author}-${index}`}
            aria-hidden={index >= testimonials.length}
            className="card-torch relative w-[248px] shrink-0 border border-border bg-card p-6 will-change-[filter,transform] sm:w-[380px]"
          >
            {/* Quote Icon */}
            <Quote className="h-8 w-8 text-primary/30 mb-4" />

            {/* Quote */}
            <p className="text-foreground/90 text-pretty mb-6 leading-relaxed">
              {`"${testimonial.quote}"`}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-primary/50 to-accent/50">
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
    </section>
  )
}
