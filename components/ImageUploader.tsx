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

  const { getRootProps, getInputProps, open, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    noClick: true,
  })

  return (
    <div
      {...getRootProps()}
      className={`rounded-[28px] px-5 py-8 text-center transition sm:px-8 sm:py-10 ${
        isDragReject
          ? 'bg-[rgba(179,27,37,0.06)]'
          : isDragActive
            ? 'bg-[rgba(0,87,189,0.08)]'
            : 'bg-[var(--surface-low)]'
      }`}
    >
      <input {...getInputProps()} />

      <div className="mx-auto max-w-2xl rounded-[24px] bg-white px-6 py-12 shadow-[0_16px_32px_rgba(15,23,42,0.05)] sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-low)] text-[var(--brand)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V7M12 7L8.5 10.5M12 7L15.5 10.5M6 18H18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="mt-6 font-headline text-2xl font-bold tracking-[-0.04em] text-[var(--ink)] sm:text-3xl">
          {isDragReject
            ? 'This file format is not supported'
            : isDragActive
              ? 'Drop your image here'
              : 'Drop your image here'}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Supports PNG, JPG, and WEBP up to 10MB.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={open} className="primary-button">
            Upload Image
          </button>
          <button type="button" className="secondary-button" disabled>
            Paste URL
          </button>
        </div>
      </div>
    </div>
  )
}
