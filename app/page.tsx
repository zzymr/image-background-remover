'use client'

import { useState, useRef } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ProcessingResult from '@/components/ProcessingResult'
import { Upload, Download, RefreshCw, AlertCircle } from 'lucide-react'

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
    
    // 创建预览 URL
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

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      // 模拟进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/remove/remove', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove background')
      }

      setProgress(100)

      // 获取处理后的图片
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      // 清理之前的处理结果
      if (processedImageRef.current) {
        URL.revokeObjectURL(processedImageRef.current)
      }
      
      processedImageRef.current = url
      setProcessedImage(url)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProcessedImage(null)
    } finally {
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Background Remover
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Remove image backgrounds instantly with AI. Upload an image and get a transparent background in seconds.
          </p>
        </div>

        {/* Main Content */}
        {!selectedImage && (
          <div className="max-w-2xl mx-auto">
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>
        )}

        {selectedImage && !processedImage && !isProcessing && (
          <div className="max-w-2xl mx-auto">
            <ProcessingResult
              image={selectedImage}
              previewUrl={previewUrl}
              onProcess={handleProcess}
              onReset={handleReset}
            />
          </div>
        )}

        {isProcessing && (
          <div className="max-w-2xl mx-auto">
            <ProcessingProgress progress={progress} />
          </div>
        )}

        {processedImage && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  ✨ Background Removed!
                </h2>
                <p className="text-gray-500">
                  Your image has been processed successfully
                </p>
              </div>

              {/* 对比预览 */}
              <div className="mb-8">
                <ComparisonView
                  originalUrl={previewUrl!}
                  processedUrl={processedImage}
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  Process Another
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function ProcessingProgress({ progress }: { progress: number }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200"></div>
        <div className="absolute animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent"></div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Processing Image...
      </h3>
      
      <p className="text-gray-500 mb-6">
        This may take a few seconds
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500">{progress}%</p>
    </div>
  )
}

function ComparisonView({ 
  originalUrl, 
  processedUrl 
}: { 
  originalUrl: string
  processedUrl: string 
}) {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  return (
    <div className="relative">
      {/* 原图 */}
      <img
        src={originalUrl}
        alt="Original"
        className="w-full rounded-xl shadow-inner"
        style={{
          backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 50% / 20px 20px'
        }}
      />

      {/* 处理后的图（通过裁剪显示） */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <img
          src={processedUrl}
          alt="Processed"
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 50% / 20px 20px',
            transform: 'scale(1.1)',
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        />
      </div>

      {/* 滑块 */}
      <div 
        className="absolute inset-0 flex items-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="relative">
          <div className="w-0.5 h-full bg-white shadow-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 控制器 */}
      <div className="mt-4">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Original</span>
          <span>Removed</span>
        </div>
      </div>
    </div>
  )
}
