type BeforeAfterCompareProps = {
  beforeSrc: string
  afterSrc: string
}

export default function BeforeAfterCompare({ beforeSrc, afterSrc }: BeforeAfterCompareProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <figure className="rounded-[28px] bg-[var(--surface-low)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Original
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--muted)] shadow-sm">
            Before
          </span>
        </div>
        <div className="overflow-hidden rounded-[24px] bg-white">
          <img src={beforeSrc} alt="Original upload" className="h-full w-full object-cover" />
        </div>
      </figure>

      <figure className="rounded-[28px] bg-[linear-gradient(180deg,rgba(0,87,189,0.08)_0%,rgba(255,255,255,0.92)_100%)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            AI cutout
          </span>
          <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            After
          </span>
        </div>
        <div className="checkerboard overflow-hidden rounded-[24px]">
          <img src={afterSrc} alt="Background removed" className="h-full w-full object-cover" />
        </div>
      </figure>
    </div>
  )
}
