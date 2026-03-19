'use client'

import { useEffect, useState } from 'react'
import { Sparkles, X } from 'lucide-react'

interface ProcessingResultProps {
  image: File
  previewUrl?: string | null
  onProcess: () => void
  onReset: () => void
}

export default function ProcessingResult({ image, previewUrl, onProcess, onReset }: ProcessingResultProps) {
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
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Ready to Process
        </h2>
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="mb-6">
        <img
          src={preview}
          alt="Preview"
          className="w-full rounded-xl shadow-lg"
        />
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">File name</p>
            <p className="text-gray-800 font-medium truncate" title={image.name}>
              {image.name.length > 20 ? image.name.slice(0, 20) + '...' : image.name}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Size</p>
            <p className="text-gray-800 font-medium">{fileSize} MB</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Type</p>
            <p className="text-gray-800 font-medium capitalize">
              {image.type.split('/')[1] || 'image'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onProcess}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-5 h-5" />
          Remove Background
        </button>
      </div>
    </div>
  )
}
