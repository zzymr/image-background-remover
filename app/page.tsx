'use client'

import { useState, useRef } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ProcessingResult from '@/components/ProcessingResult'
import BeforeAfterCompare from '@/components/BeforeAfterCompare'
import { Download, RefreshCw, AlertCircle, Sparkles } from 'lucide-react'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const processedImageRef = useRef<string | null>(null)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setProcessedImage(null)
    setError(null)
    setProgress(0)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleProcess = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setError(null)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 450)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          (errorData as { error?: string }).error || '抠图失败，请重试'
        )
      }

      setProgress(100)

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      if (processedImageRef.current) {
        URL.revokeObjectURL(processedImageRef.current)
      }

      processedImageRef.current = url
      setProcessedImage(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误')
      setProcessedImage(null)
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    if (processedImageRef.current) {
      URL.revokeObjectURL(processedImageRef.current)
    }
    setSelectedImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    setError(null)
    setProgress(0)
    setPreviewUrl(null)
    processedImageRef.current = null
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'background-removed.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-100 text-stone-900">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-15%,rgb(45_212_191/0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 text-center sm:mb-14">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-md ring-4 ring-teal-800/15">
            <Sparkles className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            背景消除
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
            上传图片，AI 移除背景。完成后可用滑块或并排模式对比清除前与清除后。
          </p>
        </header>

        {error && (
          <div
            className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/90 p-4 shadow-sm"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-red-900">出错了</p>
              <p className="mt-1 text-sm text-red-800/90">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100/80"
            >
              重试
            </button>
          </div>
        )}

        {!selectedImage && (
          <section>
            <ImageUploader onImageSelect={handleImageSelect} />
          </section>
        )}

        {selectedImage && !processedImage && !isProcessing && (
          <section>
            <ProcessingResult
              image={selectedImage}
              previewUrl={previewUrl}
              onProcess={handleProcess}
              onReset={handleReset}
            />
          </section>
        )}

        {isProcessing && (
          <section>
            <ProcessingProgress progress={progress} previewUrl={previewUrl} />
          </section>
        )}

        {processedImage && previewUrl && (
          <section>
            <div className="rounded-3xl border border-stone-200/90 bg-white/90 p-6 shadow-xl shadow-stone-900/[0.04] backdrop-blur sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-stone-900 sm:text-2xl">
                    对比预览
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    拖拽圆钮或拖动下方滑块查看分界
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <Download className="h-4 w-4" />
                    下载 PNG
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
                  >
                    <RefreshCw className="h-4 w-4" />
                    换一张
                  </button>
                </div>
              </div>

              <BeforeAfterCompare
                beforeUrl={previewUrl}
                afterUrl={processedImage}
                beforeLabel="清除前"
                afterLabel="清除后"
              />
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function ProcessingProgress({
  progress,
  previewUrl,
}: {
  progress: number
  previewUrl: string | null
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white/90 p-8 shadow-xl shadow-stone-900/[0.04] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute h-20 w-20 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
          <span className="relative text-lg font-semibold tabular-nums text-teal-900">
            {progress}%
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold text-stone-900">
          正在抠图…
        </h3>
        <p className="mt-2 text-sm text-stone-500">通常只需数秒，请稍候</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-800 transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {previewUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100">
            <p className="border-b border-stone-200/80 bg-white px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-stone-500">
              原图预览
            </p>
            <div className="checkerboard relative mx-auto max-h-48">
              <img
                src={previewUrl}
                alt="处理中预览"
                className="mx-auto max-h-48 w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
