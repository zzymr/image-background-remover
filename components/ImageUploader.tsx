'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploaderProps {
  onImageSelect: (state: { file: File | null }) => void
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onImageSelect({ file })
      }
    },
    [onImageSelect],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div
      {...getRootProps()}
      className={`group relative overflow-hidden rounded-[32px] p-8 sm:p-10 transition-all duration-300 cursor-pointer ${
        isDragReject
          ? 'bg-[rgba(179,27,37,0.06)]'
          : isDragActive
            ? 'bg-[rgba(0,87,189,0.08)]'
            : 'bg-[var(--surface-low)] hover:bg-white'
      }`}
    >
      <input {...getInputProps()} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,159,255,0.18),transparent_38%)]" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-white shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-[var(--brand)]">
            <path
              d="M12 16V7M12 7L8.5 10.5M12 7L15.5 10.5M6 18H18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-7 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
          {isDragReject
            ? 'This file format is not supported'
            : isDragActive
              ? 'Drop the image and let the AI take it from here'
              : 'Upload a product shot, portrait, or campaign asset'}
        </p>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Drag and drop a file, or click to browse. We support PNG, JPG, and WEBP up to 10MB. One image costs one credit once you generate the final cutout.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {['PNG', 'JPG', 'WEBP', 'Transparent export'].map((pill) => (
            <span key={pill} className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] shadow-sm">
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
