// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import path from 'path';

// Note: For very large files, you may need to configure:
// 1. In next.config.ts add: 
//    experimental: { 
//      serverActions: { bodySizeLimit: '100mb' } 
//    }
// 2. Vercel deployment limits (Pro plan supports up to 4.5MB body size)
// 3. For local development, there's no practical limit

// Sanitize filename to remove problematic characters
function sanitizeFilename(filename: string): string {
  // Get file extension
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Remove everything except alphanumeric, dash, underscore
  const baseName = filename
    .split('.')[0]
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 50); // Limit length
  
  return `${baseName || 'image'}.${ext}`;
}

export async function POST(request: NextRequest) {
  let file: File | null = null;
  
  try {
    const formData = await request.formData();
    file = formData.get('file') as File;
    const type = formData.get('type') as string || 'products';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type more thoroughly
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const fileType = file.type.toLowerCase();
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: `Invalid file type: ${fileType}. Only JPEG, PNG, GIF, and WebP are allowed.` },
        { status: 400 }
      );
    }
    
    // Sanitize filename
    const sanitizedName = sanitizeFilename(file.name);
    
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = sanitizedName.split('.').pop() || 'jpg';
    const filename = `${type}/${uniqueSuffix}.${ext}`;
    
    // Check if we're using Vercel Blob or local storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Convert File to Buffer for better handling
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload to Vercel Blob with the buffer
        const blob = await put(filename, buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: file.type,
        });
        
        return NextResponse.json({ url: blob.url });
      } catch (blobError: any) {
        console.error('Vercel Blob upload error:', blobError);
        
        // If blob storage fails, fall back to local storage
        console.log('Falling back to local storage...');
      }
    }
    
    // Fallback: Local file storage
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      
      // Save file locally
      const localFilename = `${uniqueSuffix}.${ext}`;
      const filepath = path.join(uploadDir, localFilename);
      await writeFile(filepath, buffer);
      
      // Return local URL
      const url = `/uploads/${type}/${localFilename}`;
      return NextResponse.json({ url });
    } catch (localError: any) {
      console.error('Local storage error:', localError);
      throw new Error('Failed to save file locally');
    }
    
  } catch (error: any) {
    console.error('Upload error details:', {
      error: error.message,
      stack: error.stack,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });
    
    // Provide more specific error messages
    if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { error: 'Storage not configured. Using local storage fallback.' },
        { status: 500 }
      );
    }
    
    if (error.message.includes('pattern')) {
      return NextResponse.json(
        { error: 'Invalid file format or filename. Please try renaming the file and removing special characters.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}