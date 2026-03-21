'use client'

import { useEffect, useState } from 'react'
import { Sparkles, X } from 'lucide-react'

interface ProcessingResultProps {
  image: File
  previewUrl?: string | null
  onProcess: () => void
  onReset: () => void
}

export default function ProcessingResult({
  image,
  previewUrl,
  onProcess,
  onReset,
}: ProcessingResultProps) {
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl)
    } else {
      const url = URL.createObjectURL(image)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [image, previewUrl])

  const fileSize = (image.size / 1024 / 1024).toFixed(2)

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white/90 shadow-xl shadow-stone-900/[0.04] backdrop-blur">
      <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 sm:px-8">
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-900 sm:text-xl">
            待处理
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">确认缩略图后点击下方抠图</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl p-2.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          aria-label="取消"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 pb-2 pt-4 sm:px-8 sm:pt-6">
        <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50">
          <img
            src={preview}
            alt="预览"
            className="mx-auto max-h-[min(55vh,420px)] w-full object-contain"
          />
        </div>
      </div>

      <div className="px-6 py-4 sm:px-8">
        <dl className="grid grid-cols-1 gap-3 rounded-2xl bg-stone-50/90 p-4 text-sm sm:grid-cols-3 sm:gap-4">
          <div>
            <dt className="text-stone-500">文件名</dt>
            <dd
              className="mt-1 truncate font-medium text-stone-900"
              title={image.name}
            >
              {image.name.length > 28
                ? `${image.name.slice(0, 28)}…`
                : image.name}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">大小</dt>
            <dd className="mt-1 font-medium text-stone-900">{fileSize} MB</dd>
          </div>
          <div>
            <dt className="text-stone-500">格式</dt>
            <dd className="mt-1 font-medium capitalize text-stone-900">
              {image.type.split('/')[1] || 'image'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-stone-100 p-6 sm:p-8 sm:pt-6">
        <button
          type="button"
          onClick={onProcess}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-800 py-4 text-base font-semibold text-white shadow-md transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <Sparkles className="h-5 w-5" strokeWidth={1.75} />
          移除背景
        </button>
      </div>
    </div>
  )
}
