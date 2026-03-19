import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    // 验证文件是否存在
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 413 }
      );
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // 获取 API Key
    const apiKey = process.env.REMOVEBG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Remove.bg API key not configured' },
        { status: 500 }
      );
    }

    // 调用 Remove.bg API
    const formDataForApi = new FormData();
    formDataForApi.append('image_file', imageFile);
    formDataForApi.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formDataForApi,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // 检查是否是免费额度用完
      if (response.status === 402) {
        return NextResponse.json(
          { error: 'Free API quota exhausted. Please add credits to your Remove.bg account.' },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: `Remove.bg API error: ${errorText}` },
        { status: response.status }
      );
    }

    // 返回处理后的图片
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-background.png"',
      },
    });

  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
