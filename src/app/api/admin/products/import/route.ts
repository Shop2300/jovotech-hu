// src/app/api/admin/products/import/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createSlug } from '@/lib/slug';

interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  errors: string[];
  details: {
    productName: string;
    action: 'created' | 'updated' | 'error';
    message?: string;
  }[];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }
    
    // Read file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Initialize result tracking
    const result: ImportResult = {
      success: true,
      created: 0,
      updated: 0,
      errors: [],
      details: []
    };
    
    // Get all categories for mapping
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.nameCs.toLowerCase(), c]));
    
    // Process each row
    for (const row of data) {
      try {
        const productData = await processRow(row, categoryMap);
        
        if (!productData.name) {
          result.errors.push(`Row missing name: ${JSON.stringify(row)}`);
          result.details.push({
            productName: 'Unknown',
            action: 'error',
            message: 'Missing name'
          });
          continue;
        }
        
        // Check if product exists (by slug or name)
        let existingProduct = null;
        
        if (productData.slug) {
          existingProduct = await prisma.product.findFirst({
            where: { slug: productData.slug }
          });
        }
        
        if (!existingProduct) {
          existingProduct = await prisma.product.findFirst({
            where: { name: productData.name }
          });
        }
        
        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: productData.name,
              price: productData.price,
              regularPrice: productData.regularPrice,
              stock: productData.stock,
              description: productData.description || existingProduct.description,
              detailDescription: productData.detailDescription || existingProduct.detailDescription,
              brand: productData.brand || existingProduct.brand,
              warranty: productData.warranty || existingProduct.warranty,
              categoryId: productData.categoryId || existingProduct.categoryId,
              image: productData.image || existingProduct.image
            }
          });
          
          result.updated++;
          result.details.push({
            productName: productData.name,
            action: 'updated'
          });
        } else {
          // Create new product
          await prisma.product.create({
            data: productData
          });
          
          result.created++;
          result.details.push({
            productName: productData.name,
            action: 'created'
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Error processing row: ${errorMessage}`);
        result.details.push({
          productName: (row as any)['Název'] || 'Unknown',
          action: 'error',
          message: errorMessage
        });
      }
    }
    
    // Process variants sheet if it exists
    if (workbook.SheetNames.includes('Varianty')) {
      const variantsSheet = workbook.Sheets['Varianty'];
      const variantsData = XLSX.utils.sheet_to_json(variantsSheet);
      
      for (const variant of variantsData) {
        try {
          await processVariant(variant as any);
        } catch (error) {
          result.errors.push(`Error processing variant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function processRow(row: any, categoryMap: Map<string, any>) {
  // Map Excel columns to product fields
  const name = row['Název']?.toString().trim();
  
  // Generate or use existing slug
  let slug = row['Slug']?.toString().trim();
  if (!slug && name) {
    slug = createSlug(name);
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.product.findFirst({ where: { slug } })) {
      slug = `${createSlug(name)}-${counter}`;
      counter++;
    }
  }
  
  // Process category
  let categoryId = null;
  const categoryName = row['Kategorie']?.toString().trim();
  if (categoryName) {
    const category = categoryMap.get(categoryName.toLowerCase());
    if (category) {
      categoryId = category.id;
    } else {
      // Create new category if it doesn't exist
      const newCategory = await prisma.category.create({
        data: {
          nameCs: categoryName,
          nameEn: categoryName,
          slug: createSlug(categoryName),
          order: await prisma.category.count()
        }
      });
      categoryId = newCategory.id;
      categoryMap.set(categoryName.toLowerCase(), newCategory);
    }
  }
  
  // Parse numeric values
  const price = parseFloat(row['Cena']?.toString().replace(/[^\d.,]/g, '').replace(',', '.') || '0');
  const regularPrice = row['Běžná cena'] ? 
    parseFloat(row['Běžná cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
    null;
  const stock = parseInt(row['Skladem']?.toString().replace(/[^\d]/g, '') || '0');
  
  return {
    name,
    slug,
    description: row['Krátký popis']?.toString() || null,
    detailDescription: row['Detailní popis']?.toString() || null,
    price: price || 0,
    regularPrice,
    stock,
    brand: row['Značka']?.toString() || null,
    warranty: row['Záruka']?.toString() || null,
    image: row['Hlavní obrázek']?.toString() || null,
    categoryId
  };
}

async function processVariant(variant: any) {
  const productName = variant['Název produktu']?.toString().trim();
  if (!productName) return;
  
  const product = await prisma.product.findFirst({
    where: { name: productName }
  });
  
  if (!product) {
    throw new Error(`Product not found for variant: ${productName}`);
  }
  
  const variantData = {
    productId: product.id,
    colorName: variant['Barva']?.toString() || null,
    colorCode: variant['Kód barvy']?.toString() || null,
    sizeName: variant['Velikost']?.toString() || null,
    stock: parseInt(variant['Skladem']?.toString() || '0'),
    price: variant['Cena varianty'] ? 
      parseFloat(variant['Cena varianty'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
      null,
    imageUrl: variant['Obrázek varianty']?.toString() || null,
    sizeOrder: 0,
    order: 0
  };
  
  // Check if variant already exists
  const existingVariant = await prisma.productVariant.findFirst({
    where: {
      productId: product.id,
      colorName: variantData.colorName,
      sizeName: variantData.sizeName
    }
  });
  
  if (existingVariant) {
    await prisma.productVariant.update({
      where: { id: existingVariant.id },
      data: variantData
    });
  } else {
    await prisma.productVariant.create({
      data: variantData
    });
  }
}