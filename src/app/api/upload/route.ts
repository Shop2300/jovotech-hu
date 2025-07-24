// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import path from 'path';

// Add this configuration to increase body size limit
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1000);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${type}/${timestamp}-${random}.${ext}`;
    
    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check if we're using Vercel Blob or local storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Upload to Vercel Blob
        const blob = await put(filename, buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: file.type,
        });
        
        return NextResponse.json({ url: blob.url });
      } catch (blobError: any) {
        console.error('Vercel Blob upload error:', blobError);
        // Fall back to local storage
      }
    }
    
    // Fallback: Local file storage
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      
      const localFilename = `${timestamp}-${random}.${ext}`;
      const filepath = path.join(uploadDir, localFilename);
      await writeFile(filepath, buffer);
      
      const url = `/uploads/${type}/${localFilename}`;
      return NextResponse.json({ url });
    } catch (localError: any) {
      console.error('Local storage error:', localError);
      throw new Error('Failed to save file locally');
    }
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}