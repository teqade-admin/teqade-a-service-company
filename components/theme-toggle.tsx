"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

// Dark is the default; the switch flips to the light theme and next-themes remembers the choice.
// Until mounted the stored theme is unknown, so it renders the dark position (matching the server).
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const light = mounted && resolvedTheme === "light"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      title={light ? "Switch to the dark theme" : "Switch to the light theme"}
      onClick={() => setTheme(light ? "dark" : "light")}
      className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center border border-border bg-secondary transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Moon className="absolute left-1.5 h-3.5 w-3.5 text-muted-foreground" />
      <Sun className="absolute right-1.5 h-3.5 w-3.5 text-muted-foreground" />
      <span
        className={`absolute top-[3px] grid h-5 w-5 place-items-center bg-primary text-primary-foreground transition-[left] duration-200 ${
          light ? "left-[27px]" : "left-[3px]"
        }`}
      >
        {light ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
      </span>
    </button>
  )
}
