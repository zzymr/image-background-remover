'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      onImageSelect(file)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-purple-500 bg-purple-50 scale-105'
            : 'border-gray-300 bg-white hover:border-purple-400 hover:scale-102'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="mb-6">
          {isDragActive ? (
            <svg className="w-16 h-16 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          ) : (
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">
          {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
        </p>
        <p className="text-gray-500 mb-4">
          or click to browse
        </p>
        <p className="text-sm text-gray-400">
          Supports PNG, JPG, WEBP (max 10MB)
        </p>
      </div>
    </div>
  )
}
