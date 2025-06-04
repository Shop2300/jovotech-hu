// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'products';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = file.name.split('.').pop();
    const filename = `${type}/${uniqueSuffix}.${ext}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    // Return the URL
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Check if it's a missing token error
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { error: 'Blob storage not configured. Please set up Vercel Blob Storage.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}