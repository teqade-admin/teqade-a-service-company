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

// A circular carousel: each testimonial holds the middle for HOLD, then the row slides quickly to
// the next. The list is rendered three times so a card always sits on either side; when the middle
// copy runs out, the track steps back one copy with the transition off, which looks identical.
const HOLD = 3000
const SLIDE = 420
const COPIES = 3
const EASE = "cubic-bezier(.22,.9,.24,1)"

export function TrustSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const count = testimonials.length
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let index = count // opens on the first testimonial, so the last one sits to its left
    let held = false
    let onScreen = true
    let timer = 0
    let settle = 0

    const place = (animate: boolean) => {
      const cards = Array.from(track.children) as HTMLElement[]
      const step = cards[1].offsetLeft - cards[0].offsetLeft
      track.style.transition = animate ? `transform ${SLIDE}ms ${EASE}` : "none"
      track.style.transform = `translateX(calc(50% - ${index * step + cards[0].offsetWidth / 2}px))`
      cards.forEach((card, i) => {
        const away = Math.abs(i - index)
        card.style.transition = animate ? `transform ${SLIDE}ms ${EASE}, opacity ${SLIDE}ms ${EASE}` : "none"
        card.style.transform = `scale(${away === 0 ? 1 : 0.84})`
        card.style.opacity = away === 0 ? "1" : away === 1 ? "0.65" : "0"
      })
    }

    const advance = () => {
      if (held || !onScreen) return
      index += 1
      place(true)
      if (index >= count * 2) {
        // one copy along is the same view, so stepping back is invisible
        settle = window.setTimeout(() => {
          index -= count
          place(false)
        }, SLIDE + 60)
      }
    }

    place(false)
    if (!reduced) timer = window.setInterval(advance, HOLD + SLIDE)

    const hold = () => (held = true)
    const release = () => (held = false)
    // only react to a real width change (a breakpoint), never to the scaling during a slide
    let lastWidth = 0
    const resize = new ResizeObserver(() => {
      const width = (track.children[0] as HTMLElement).offsetWidth
      if (width !== lastWidth) {
        lastWidth = width
        place(false)
      }
    })
    resize.observe(track)
    const watcher = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting), { threshold: 0 })
    watcher.observe(track.parentElement ?? track)
    track.addEventListener("pointerenter", hold)
    track.addEventListener("pointerleave", release)
    track.addEventListener("focusin", hold)
    track.addEventListener("focusout", release)

    return () => {
      clearInterval(timer)
      clearTimeout(settle)
      resize.disconnect()
      watcher.disconnect()
      track.removeEventListener("pointerenter", hold)
      track.removeEventListener("pointerleave", release)
      track.removeEventListener("focusin", hold)
      track.removeEventListener("focusout", release)
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

      {/* One testimonial holds the middle; the neighbours sit back, smaller and dimmed */}
      <div className="relative z-10 overflow-hidden py-6">
        <div ref={trackRef} className="flex items-stretch gap-5 will-change-transform">
          {Array.from({ length: COPIES }, () => testimonials)
            .flat()
            .map((testimonial, index) => (
              <article
                key={`${testimonial.author}-${index}`}
                aria-hidden={index < testimonials.length || index >= testimonials.length * 2}
                className="card-torch flex w-[290px] shrink-0 flex-col border border-border bg-card p-6 will-change-transform sm:w-[390px]"
              >
                <Quote className="h-8 w-8 shrink-0 text-primary/30 mb-4" />

                {/* the quote takes up the slack, so every author block sits on the same line */}
                <p className="flex-1 text-foreground/90 text-pretty leading-relaxed">
                  {`"${testimonial.quote}"`}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br from-primary/50 to-accent/50">
                    <span className="text-sm font-bold text-foreground">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  )
}
