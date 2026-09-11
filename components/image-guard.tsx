"use client"

import { useEffect } from "react"

// Deters casual image saving: no right-click / long-press "Save image" menu and no dragging images
// out of the page (the CSS side is in globals.css). Anything a browser shows can still be captured,
// so this removes the easy paths only.
const PROTECTED = "img, canvas, video"

export function ImageGuard() {
  useEffect(() => {
    const block = (event: Event) => {
      if ((event.target as Element | null)?.closest?.(PROTECTED)) event.preventDefault()
    }
    document.addEventListener("contextmenu", block)
    document.addEventListener("dragstart", block)
    return () => {
      document.removeEventListener("contextmenu", block)
      document.removeEventListener("dragstart", block)
    }
  }, [])
  return null
}
