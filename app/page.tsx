'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ProcessingResult from '@/components/ProcessingResult'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setProcessedImage(null)
  }

  const handleProcessComplete = (result: string) => {
    setProcessedImage(result)
    setIsProcessing(false)
  }

  const handleReset = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
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

        {/* Main Content */}
        {!selectedImage && (
          <ImageUploader onImageSelect={handleImageSelect} />
        )}

        {selectedImage && !processedImage && !isProcessing && (
          <ProcessingResult
            image={selectedImage}
            onProcess={(image) => {
              setIsProcessing(true)
              // TODO: Implement actual background removal
              setTimeout(() => {
                // For now, just use the original image
                handleProcessComplete(URL.createObjectURL(image))
              }, 2000)
            }}
            onReset={handleReset}
          />
        )}

        {isProcessing && (
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
