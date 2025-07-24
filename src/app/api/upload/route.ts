// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let file: File | null = null;
    let buffer: Buffer;
    let filename: string;
    let mimeType: string;
    let type: string = 'products';
    
    // Handle JSON/Base64 upload
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { file: base64Data, filename: originalName, type: uploadType, mimeType: fileMimeType } = body;
      
      if (!base64Data || !originalName) {
        return NextResponse.json(
          { error: 'Missing file data or filename' },
          { status: 400 }
        );
      }
      
      // Remove data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64, 'base64');
      filename = originalName;
      mimeType = fileMimeType || 'image/jpeg';
      type = uploadType || 'products';
    } 
    // Handle FormData upload
    else {
      const formData = await request.formData();
      file = formData.get('file') as File;
      type = formData.get('type') as string || 'products';
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      filename = file.name;
      mimeType = file.type;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Generate safe filename
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1000);
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const safeFilename = `${timestamp}-${random}.${ext}`;
    const uploadPath = `${type}/${safeFilename}`;
    
    // Try Vercel Blob first
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(uploadPath, buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: mimeType,
        });
        
        return NextResponse.json({ url: blob.url });
      } catch (blobError: any) {
        console.error('Vercel Blob upload error:', blobError);
      }
    }
    
    // Fallback to local storage
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    await import('fs/promises').then(fs => fs.mkdir(uploadDir, { recursive: true }));
    
    const localPath = path.join(uploadDir, safeFilename);
    await writeFile(localPath, buffer);
    
    return NextResponse.json({ url: `/uploads/${type}/${safeFilename}` });
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}