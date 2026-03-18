'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ProcessingResult from '@/components/ProcessingResult'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (state: { file: File | null; preview: string | null }) => {
    setSelectedImage(state.file)
    setProcessedImage(null)
    setError(null)
  }

  const handleProcessComplete = (result: string) => {
    setProcessedImage(result)
    setIsProcessing(false)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsProcessing(false)
  }

  const handleReset = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Image Background Remover
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Remove image backgrounds instantly with AI. No complex tools needed.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!selectedImage && (
          <ImageUploader onImageSelect={handleImageSelect} />
        )}

        {selectedImage && !processedImage && !isProcessing && (
          <ProcessingResult
            image={selectedImage}
            onProcess={() => {
              setIsProcessing(true)
              setError(null)
            }}
            onReset={handleReset}
          />
        )}

        {isProcessing && selectedImage && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-700 text-lg">Processing your image...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
            </div>
          </div>
        )}

        {processedImage && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                ✨ Background Removed!
              </h2>
              <div className="mb-6">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full rounded-lg"
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
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Process Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
