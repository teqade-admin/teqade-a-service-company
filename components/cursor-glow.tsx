"use client"

import { useEffect } from "react"

// Hover lights that follow the cursor: section titles (.title-spotlight) light up with the brand
// gradient, cards (.card-torch) get a green torch glow. One page-wide listener feeds the cursor
// position, relative to the hovered element, as --cursor-x / --cursor-y; the rest is CSS (globals.css).
const TARGETS = [".title-spotlight", ".card-torch"]

export function CursorGlow() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target?.closest) return
      for (const selector of TARGETS) {
        const el = target.closest<HTMLElement>(selector)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        el.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
        el.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)
      }
    }
    document.addEventListener("pointermove", onMove, { passive: true })
    return () => document.removeEventListener("pointermove", onMove)
  }, [])
  return null
}
