type BrandMarkProps = {
  compact?: boolean
}

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0057bd_0%,#6e9fff_100%)] shadow-[0_20px_40px_rgba(0,87,189,0.18)]">
        <div className="absolute inset-[7px] rounded-xl border border-white/20 bg-white/18 backdrop-blur-sm" />
        <div className="relative h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.65)]" />
      </div>

      {!compact && (
        <div>
          <p className="font-headline text-sm font-semibold uppercase tracking-[0.26em] text-[var(--muted)]">
            Editorial AI
          </p>
          <p className="font-headline text-lg font-extrabold tracking-[-0.04em] text-[var(--ink)]">
            Ethereal Cutout
          </p>
        </div>
      )}
    </div>
  )
}
