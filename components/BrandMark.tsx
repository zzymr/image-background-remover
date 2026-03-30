type BrandMarkProps = {
  compact?: boolean
}

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-headline text-[1.05rem] font-extrabold tracking-[-0.04em] text-[var(--brand)]">
        EtherealAI
      </span>
      {!compact && (
        <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
          The Ethereal Canvas
        </span>
      )}
    </div>
  )
}
