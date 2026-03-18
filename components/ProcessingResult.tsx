'use client'

import { useEffect, useState } from 'react'

interface ProcessingResultProps {
  image: File
  onProcess: (image: File) => void
  onReset: () => void
}

export default function ProcessingResult({ image, onProcess, onReset }: ProcessingResultProps) {
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const fileSize = (image.size / 1024 / 1024).toFixed(2)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Ready to Remove Background
        </h2>

        <div className="mb-6">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">File name:</span>
            <span className="text-gray-800 font-medium">{image.name}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">File size:</span>
            <span className="text-gray-800 font-medium">{fileSize} MB</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Type:</span>
            <span className="text-gray-800 font-medium">{image.type}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onProcess(image)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Remove Background ✨
          </button>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
