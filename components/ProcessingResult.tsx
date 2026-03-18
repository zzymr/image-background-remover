'use client'

import { useEffect, useState } from 'react'

interface ProcessingResultProps {
  image: File
  onProcess: () => void
  onReset: () => void
}

export default function ProcessingResult({ image, onProcess, onReset }: ProcessingResultProps) {
  const [preview, setPreview] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const handleProcess = async () => {
    setIsProcessing(true)
    setError(null)
    onProcess()

    try {
      // Prepare form data
      const formData = new FormData()
      formData.append('image', image)

      // Call API
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove background')
      }

      // Show processed image
      setProcessedImage(data.image)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Error processing image:', err)

      // Notify parent component
      setTimeout(() => {
        // Send error to parent via custom event or callback
        window.dispatchEvent(new CustomEvent('processing-error', { detail: errorMessage }))
      }, 100)
    } finally {
      setIsProcessing(false)
    }
  }

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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Remove Background ✨'}
          </button>
          <button
            onClick={onReset}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
        </div>

        {processedImage && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ✨ Background Removed!
            </h3>
            <div className="mb-6">
              <img
                src={processedImage}
                alt="Processed"
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = processedImage
                  link.download = 'background-removed.png'
                  link.click()
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Download Image
              </button>
              <button
                onClick={() => {
                  setProcessedImage(null)
                  setError(null)
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Process Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
