// Teqade's mark, styled like a periodic-table tile: atomic number "01" and the symbol "Tq",
// set in Figtree like the site's buttons.
export function TqLogo({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid h-9 w-9 shrink-0 place-items-center border-[1.5px] border-primary bg-card font-sans shadow-[0_0_14px_rgba(92,255,138,0.25)] ${className}`}
    >
      <span className="absolute left-[3px] top-[2px] text-[7px] font-bold leading-none text-primary">01</span>
      <span className="mt-1 text-[17px] font-extrabold leading-none tracking-[-0.03em] text-foreground">
        T<span className="text-primary">q</span>
      </span>
    </span>
  )
}
