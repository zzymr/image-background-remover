'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlus } from 'lucide-react'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onImageSelect(file)
      }
    },
    [onImageSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div className="mx-auto max-w-xl">
      <div
        {...getRootProps()}
        className={`
          group cursor-pointer rounded-3xl border-2 border-dashed px-8 py-14 text-center transition-all
          ${
            isDragActive
              ? 'border-teal-600 bg-teal-50/90 shadow-inner'
              : 'border-stone-300 bg-white/80 hover:border-teal-500/60 hover:bg-white hover:shadow-lg hover:shadow-stone-900/[0.06]'
          }
        `}
      >
        <input {...getInputProps()} />
        <div
          className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
            isDragActive
              ? 'bg-teal-700 text-white'
              : 'bg-stone-100 text-stone-500 group-hover:bg-teal-700/10 group-hover:text-teal-800'
          }`}
        >
          <ImagePlus className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <p className="text-lg font-semibold text-stone-800">
          {isDragActive ? '松开以上传' : '拖拽图片到此处'}
        </p>
        <p className="mt-2 text-sm text-stone-500">或点击选择文件</p>
        <p className="mt-4 text-xs text-stone-400">
          PNG、JPG、WEBP · 最大 10MB
        </p>
      </div>
    </div>
  )
}
