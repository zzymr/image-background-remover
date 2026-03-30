import { NextRequest, NextResponse } from 'next/server'
import {
  createProcessingJob,
  markProcessingJobCompleted,
  markProcessingJobFailed,
} from '@/lib/processing-history'
import { getCurrentUser, isAuthConfigured } from '@/lib/auth'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || process.env.REMOVEBG_API_KEY
const REMOVE_BG_API_URL = process.env.REMOVE_BG_API_URL || 'https://api.remove.bg/v1.0/removebg'

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(arrayBuffer)
  const chunkSize = 0x8000

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

export async function POST(request: NextRequest) {
  let jobId: string | null = null

  try {
    if (!REMOVE_BG_API_KEY) {
      return jsonError('Remove.bg API key not configured.', 500)
    }

    const authEnabled = isAuthConfigured()
    const user = authEnabled ? await getCurrentUser(request) : null

    if (authEnabled && !user) {
      return jsonError('Please sign in with Google before removing a background.', 401)
    }

    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const sessionId =
      (formData.get('sessionId') as string | null) ||
      request.headers.get('x-client-session-id') ||
      undefined

    if (!image) {
      return jsonError('No image provided.', 400)
    }

    if (!sessionId) {
      return jsonError('Missing client session.', 400)
    }

    const maxSize = 10 * 1024 * 1024
    if (image.size > maxSize) {
      return jsonError('File size exceeds 10MB limit.', 400)
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      return jsonError(`Unsupported file type: ${image.type}`, 400)
    }

    try {
      jobId = await createProcessingJob({
        sessionId,
        userId: user?.id,
        sourceFilename: image.name,
        mimeType: image.type,
        fileSize: image.size,
      })
    } catch (historyError) {
      console.error('Failed to create processing record:', historyError)
    }

    const imageBuffer = await image.arrayBuffer()
    const blob = new Blob([imageBuffer], { type: image.type })

    const apiFormData = new FormData()
    apiFormData.append('image_file', blob, image.name)
    apiFormData.append('size', 'auto')

    const response = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: apiFormData,
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Remove.bg API error:', response.status, errorText)

      let message = `Failed to remove background: ${response.statusText}`
      if (response.status === 401) message = 'Invalid API key.'
      if (response.status === 402) message = 'API credit limit exceeded.'
      if (response.status === 429) message = 'Rate limit exceeded. Please try again later.'

      try {
        await markProcessingJobFailed(jobId, message)
      } catch (historyError) {
        console.error('Failed to mark job as failed:', historyError)
      }

      return jsonError(message, response.status)
    }

    const processedImageBlob = await response.blob()
    const arrayBuffer = await processedImageBlob.arrayBuffer()
    const base64 = arrayBufferToBase64(arrayBuffer)
    const mimeType = processedImageBlob.type || 'image/png'
    const dataUrl = `data:${mimeType};base64,${base64}`

    try {
      await markProcessingJobCompleted(jobId, processedImageBlob.size)
    } catch (historyError) {
      console.error('Failed to mark job as completed:', historyError)
    }

    return NextResponse.json({
      success: true,
      image: dataUrl,
      size: processedImageBlob.size,
      jobId,
    })
  } catch (error) {
    console.error('Error in remove-background API:', error)

    try {
      await markProcessingJobFailed(
        jobId,
        error instanceof Error ? error.message : 'Internal server error',
      )
    } catch (historyError) {
      console.error('Failed to persist failure status:', historyError)
    }

    return jsonError('Internal server error.', 500)
  }
}
