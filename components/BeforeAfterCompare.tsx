'use client'

import { useCallback, useRef, useState } from 'react'
import { Columns2, SlidersHorizontal } from 'lucide-react'

type CompareMode = 'slider' | 'split'

interface BeforeAfterCompareProps {
  beforeUrl: string
  afterUrl: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export default function BeforeAfterCompare({
  beforeUrl,
  afterUrl,
  beforeLabel = '清除前',
  afterLabel = '清除后',
  className = '',
}: BeforeAfterCompareProps) {
  const [pos, setPos] = useState(50)
  const [mode, setMode] = useState<CompareMode>('slider')
  const dragging = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - r.left, 0), r.width)
    setPos(Math.round((x / r.width) * 100))
  }, [])

  const onHandlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragging.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setFromClientX(e.clientX)
  }

  const onHandlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    setFromClientX(e.clientX)
  }

  const onHandlePointerUp = (e: React.PointerEvent) => {
    dragging.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onTrackPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-handle]')) return
    setFromClientX(e.clientX)
  }

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500">
          左右对比查看抠图效果；透明区域以棋盘格表示
        </p>
        <div className="flex rounded-lg border border-stone-200/80 bg-white p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setMode('slider')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'slider'
                ? 'bg-teal-700 text-white shadow'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            拖动对比
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'split'
                ? 'bg-teal-700 text-white shadow'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Columns2 className="h-3.5 w-3.5" />
            并排对比
          </button>
        </div>
      </div>

      {mode === 'slider' ? (
        <>
          <div
            ref={trackRef}
            className="compare-track relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 shadow-inner"
            style={{ touchAction: 'none' }}
            onPointerDown={onTrackPointerDown}
          >
            <div className="checkerboard relative aspect-[4/3] max-h-[min(68vh,520px)] w-full min-h-[220px] sm:aspect-[16/10] sm:max-h-[min(72vh,580px)]">
              {/* 清除后（底层，完整显示） */}
              <img
                src={afterUrl}
                alt={afterLabel}
                className="absolute inset-0 z-0 h-full w-full select-none object-contain"
                draggable={false}
              />
              {/* 清除前（上层，左侧裁剪露出下层） */}
              <img
                src={beforeUrl}
                alt={beforeLabel}
                className="absolute inset-0 z-[1] h-full w-full select-none object-contain"
                draggable={false}
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              />
              {/* 分割线 + 手柄 */}
              <div
                className="pointer-events-none absolute inset-y-0 z-[2] w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
                style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
              />
              <button
                type="button"
                data-handle
                aria-label="拖动对比分界"
                className="absolute top-1/2 z-[3] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full border-2 border-white bg-teal-700 text-white shadow-lg active:cursor-grabbing"
                style={{ left: `${pos}%` }}
                onPointerDown={onHandlePointerDown}
                onPointerMove={onHandlePointerMove}
                onPointerUp={onHandlePointerUp}
                onPointerCancel={onHandlePointerUp}
              >
                <span className="flex gap-0.5 opacity-90" aria-hidden>
                  <span className="h-4 w-0.5 rounded-full bg-white/90" />
                  <span className="h-4 w-0.5 rounded-full bg-white/90" />
                </span>
              </button>
            </div>
          </div>
          <div className="mt-4 px-1">
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              aria-label="对比分界位置"
              className="compare-range h-2 w-full cursor-pointer accent-teal-700"
              onChange={(e) => setPos(Number(e.target.value))}
            />
            <div className="mt-1.5 flex justify-between text-xs font-medium text-stone-500">
              <span>{beforeLabel}</span>
              <span>{afterLabel}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 shadow-sm">
            <figcaption className="border-b border-stone-200/80 bg-white px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
              {beforeLabel}
            </figcaption>
            <div className="checkerboard relative aspect-square max-h-80 w-full sm:aspect-[4/3] sm:max-h-96">
              <img
                src={beforeUrl}
                alt={beforeLabel}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            </div>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 shadow-sm">
            <figcaption className="border-b border-stone-200/80 bg-white px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
              {afterLabel}
            </figcaption>
            <div className="checkerboard relative aspect-square max-h-80 w-full sm:aspect-[4/3] sm:max-h-96">
              <img
                src={afterUrl}
                alt={afterLabel}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            </div>
          </figure>
        </div>
      )}
    </div>
  )
}
