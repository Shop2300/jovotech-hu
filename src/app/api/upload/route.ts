// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import path from 'path';

// Generate safe filename
function generateSafeFilename(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1000);
  return `${timestamp}-${random}.${ext}`;
}

// Parse multipart form data manually if needed
async function parseMultipartData(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Not multipart/form-data');
  }

  // Try the standard approach first
  try {
    return await request.formData();
  } catch (error) {
    console.error('Standard FormData parsing failed:', error);
    throw new Error('Failed to parse upload data. The file may be corrupted or in an unsupported format.');
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    let formData: FormData;
    let file: File | null = null;
    let type: string = 'products';
    
    // Try to parse the form data
    try {
      formData = await parseMultipartData(request);
      file = formData.get('file') as File;
      type = formData.get('type') as string || 'products';
    } catch (parseError: any) {
      console.error('Form data parsing error:', parseError);
      
      // If parsing fails completely, return a clear error
      return NextResponse.json(
        { 
          error: 'Unable to process the uploaded file. The file may be corrupted, too large, or in an unsupported format. Try converting it to a standard JPG or PNG format.',
          details: parseError.message 
        },
        { status: 400 }
      );
    }
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided in the upload' },
        { status: 400 }
      );
    }
    
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    
    // Validate file type (be more lenient)
    const fileType = file.type.toLowerCase();
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    // If file type is empty or not in allowed types, try to detect from filename
    let actualType = fileType;
    if (!fileType || !allowedTypes.includes(fileType)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'jpg' || ext === 'jpeg') actualType = 'image/jpeg';
      else if (ext === 'png') actualType = 'image/png';
      else if (ext === 'webp') actualType = 'image/webp';
      else if (ext === 'gif') actualType = 'image/gif';
      else {
        return NextResponse.json(
          { error: `Unsupported file type. Please use JPG, PNG, GIF, or WebP format.` },
          { status: 400 }
        );
      }
    }
    
    // Generate safe filename
    const safeFilename = generateSafeFilename(file.name);
    const uniqueFilename = `${type}/${safeFilename}`;
    
    // Convert file to buffer
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      
      // Validate that we actually got data
      if (buffer.length === 0) {
        throw new Error('File is empty');
      }
      
      console.log('Buffer size:', buffer.length);
    } catch (bufferError: any) {
      console.error('Buffer conversion error:', bufferError);
      return NextResponse.json(
        { error: 'Failed to process file data. The file may be corrupted.' },
        { status: 400 }
      );
    }
    
    // Try Vercel Blob first
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log('Attempting Vercel Blob upload...');
        
        const blob = await put(uniqueFilename, buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: actualType,
        });
        
        console.log('Vercel Blob upload successful:', blob.url);
        return NextResponse.json({ url: blob.url });
      } catch (blobError: any) {
        console.error('Vercel Blob error:', blobError);
        // Continue to local storage fallback
      }
    }
    
    // Fallback to local storage
    try {
      console.log('Using local storage fallback...');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      
      const localPath = path.join(uploadDir, safeFilename);
      await writeFile(localPath, buffer);
      
      const url = `/uploads/${type}/${safeFilename}`;
      console.log('Local storage successful:', url);
      
      return NextResponse.json({ url });
    } catch (localError: any) {
      console.error('Local storage error:', localError);
      return NextResponse.json(
        { error: 'Failed to save file. Storage system error.' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('pattern')) {
      return NextResponse.json(
        { 
          error: 'The uploaded file format is not compatible. Try converting the image to a standard JPG or PNG format using an image editor.',
          suggestion: 'You can use online tools like CloudConvert or your computer\'s built-in image editor to convert the file.'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Upload failed. Please try again with a different image file.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}