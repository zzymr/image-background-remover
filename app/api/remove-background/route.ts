import { NextRequest, NextResponse } from 'next/server'

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY
const REMOVE_BG_API_URL = process.env.REMOVE_BG_API_URL || 'https://api.remove.bg/v1.0/removebg'

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { error: 'Remove.bg API key not configured' },
        { status: 500 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${image.type}` },
        { status: 400 }
      )
    }

    // Convert file to blob
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const blob = new Blob([imageBuffer], { type: image.type })

    // Prepare FormData for remove.bg API
    const apiFormData = new FormData()
    apiFormData.append('image_file', blob, image.name)
    apiFormData.append('size', 'auto') // Automatically detect image size

    // Call remove.bg API
    const response = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: apiFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Remove.bg API error:', response.status, errorText)

      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      } else if (response.status === 402) {
        return NextResponse.json(
          { error: 'API credit limit exceeded' },
          { status: 402 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: `Failed to remove background: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Get processed image as blob
    const processedImageBlob = await response.blob()

    // Convert blob to base64 for JSON response
    const arrayBuffer = await processedImageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${processedImageBlob.type};base64,${base64}`

    return NextResponse.json({
      success: true,
      image: dataUrl,
      size: processedImageBlob.size,
    })

  } catch (error) {
    console.error('Error in remove-background API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
