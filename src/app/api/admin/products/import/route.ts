// src/app/api/admin/products/import/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { createSlug } from '@/lib/slug';

interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  details: {
    productCode: string;
    productName: string;
    action: 'created' | 'updated' | 'skipped' | 'error';
    message?: string;
  }[];
}

interface ChunkInfo {
  currentChunk: number;
  totalChunks: number;
  isLastChunk: boolean;
}

// Required fields for creating a new product
const REQUIRED_FIELDS_FOR_NEW = ['Kód', 'Název', 'Cena', 'Skladem'];

// Cache for categories to avoid repeated database queries
let categoryCache: Map<string, any> | null = null;

// Helper function to generate unique slug
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  let slug = createSlug(name);
  let counter = 1;
  
  // Ensure unique slug
  while (true) {
    const existingProduct = await prisma.product.findFirst({ 
      where: { 
        slug,
        id: excludeId ? { not: excludeId } : undefined
      } 
    });
    
    if (!existingProduct) break;
    
    slug = `${createSlug(name)}-${counter}`;
    counter++;
  }
  
  return slug;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chunkInfoStr = formData.get('chunkInfo') as string;
    
    let chunkInfo: ChunkInfo | null = null;
    if (chunkInfoStr) {
      chunkInfo = JSON.parse(chunkInfoStr);
    }
    
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
      skipped: 0,
      errors: [],
      details: []
    };
    
    // Initialize or use cached categories
    if (!categoryCache || (chunkInfo && chunkInfo.currentChunk === 1)) {
      const categories = await prisma.category.findMany();
      categoryCache = new Map(categories.map(c => [c.name.toLowerCase(), c]));
    }
    
    // Process each row
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex] as any;
      
      try {
        // Check if code is present (required) - always trim to handle spaces
        const rawCode = row['Kód'] || row['Kod'] || row['Code']; // Support multiple column names
        const code = rawCode?.toString().trim();
        if (!code) {
          result.errors.push(`Řádek ${rowIndex + 2}: Chybí povinný kód produktu`);
          result.details.push({
            productCode: 'N/A',
            productName: row['Název'] || 'Neznámý',
            action: 'error',
            message: 'Chybí kód produktu'
          });
          continue;
        }
        
        // Detect if trimming was needed
        const wasTrimmed = rawCode !== code;
        
        // Check if product exists by code
        const existingProduct = await prisma.product.findFirst({
          where: { code }
        });
        
        if (existingProduct) {
          // UPDATE EXISTING PRODUCT - Only update fields that are present
          const updateData: any = {};
          let nameChanged = false;
          let slugUpdated = false;
          
          // Check if name is being updated
          if ('Název' in row && row['Název']) {
            const newName = row['Název'].toString().trim();
            if (newName !== existingProduct.name) {
              updateData.name = newName;
              nameChanged = true;
              
              // If name changed and no explicit slug provided, generate new slug
              if (!('Slug' in row && row['Slug'])) {
                updateData.slug = await generateUniqueSlug(newName, existingProduct.id);
                slugUpdated = true;
              }
            }
          }
          
          // Handle explicit slug if provided
          if ('Slug' in row && row['Slug']) {
            const providedSlug = row['Slug'].toString().trim();
            // Validate that the provided slug is unique
            const existingWithSlug = await prisma.product.findFirst({
              where: {
                slug: providedSlug,
                id: { not: existingProduct.id }
              }
            });
            
            if (existingWithSlug) {
              // If slug already exists, generate a unique one
              updateData.slug = await generateUniqueSlug(
                updateData.name || existingProduct.name, 
                existingProduct.id
              );
              slugUpdated = true;
            } else {
              updateData.slug = providedSlug;
            }
          }
          
          if ('Kategorie' in row) {
            const categoryName = row['Kategorie']?.toString().trim();
            if (categoryName) {
              const category = categoryCache!.get(categoryName.toLowerCase());
              if (category) {
                updateData.categoryId = category.id;
              } else {
                // Create new category if it doesn't exist
                const newCategory = await prisma.category.create({
                  data: {
                    name: categoryName,
                    slug: createSlug(categoryName),
                    order: await prisma.category.count()
                  }
                });
                updateData.categoryId = newCategory.id;
                categoryCache!.set(categoryName.toLowerCase(), newCategory);
              }
            } else {
              updateData.categoryId = null;
            }
          }
          
          if ('Značka' in row) {
            updateData.brand = row['Značka']?.toString().trim() || null;
          }
          
          if ('Cena' in row && row['Cena'] !== undefined && row['Cena'] !== '') {
            updateData.price = parseFloat(row['Cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.') || '0');
          }
          
          if ('Běžná cena' in row) {
            updateData.regularPrice = row['Běžná cena'] && row['Běžná cena'] !== '' ? 
              parseFloat(row['Běžná cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
              null;
          }
          
          if ('Skladem' in row && row['Skladem'] !== undefined && row['Skladem'] !== '') {
            updateData.stock = parseInt(row['Skladem'].toString().replace(/[^\d]/g, '') || '0');
          }
          
          if ('Krátký popis' in row) {
            updateData.description = row['Krátký popis']?.toString().trim() || null;
          }
          
          if ('Detailní popis' in row) {
            updateData.detailDescription = row['Detailní popis']?.toString().trim() || null;
          }
          
          if ('Záruka' in row) {
            updateData.warranty = row['Záruka']?.toString().trim() || null;
          }
          
          if ('Hlavní obrázek' in row) {
            updateData.image = row['Hlavní obrázek']?.toString().trim() || null;
          }
          
          // Only update if there are fields to update
          if (Object.keys(updateData).length > 0) {
            await prisma.product.update({
              where: { id: existingProduct.id },
              data: updateData
            });
            
            result.updated++;
            let message = `Aktualizováno ${Object.keys(updateData).length} polí`;
            if (wasTrimmed) message += ' (kód byl oříznut)';
            if (slugUpdated) message += ' (URL automaticky aktualizováno)';
            
            result.details.push({
              productCode: code,
              productName: updateData.name || existingProduct.name,
              action: 'updated',
              message
            });
          } else {
            result.skipped++;
            result.details.push({
              productCode: code,
              productName: existingProduct.name,
              action: 'skipped',
              message: 'Žádné změny'
            });
          }
        } else {
          // CREATE NEW PRODUCT - Check if all required fields are present
          const missingFields = [];
          
          for (const field of REQUIRED_FIELDS_FOR_NEW) {
            if (!(field in row) || !row[field] || row[field].toString().trim() === '') {
              missingFields.push(field);
            }
          }
          
          if (missingFields.length > 0) {
            result.errors.push(`Řádek ${rowIndex + 2}: Nelze vytvořit nový produkt - chybí povinná pole: ${missingFields.join(', ')}`);
            result.details.push({
              productCode: code,
              productName: row['Název'] || 'Neznámý',
              action: 'error',
              message: `Chybí povinná pole: ${missingFields.join(', ')}`
            });
            continue;
          }
          
          // Process new product data
          const name = row['Název'].toString().trim();
          let slug = row['Slug']?.toString().trim();
          
          if (!slug) {
            slug = await generateUniqueSlug(name);
          } else {
            // Validate provided slug is unique
            const existingWithSlug = await prisma.product.findFirst({ where: { slug } });
            if (existingWithSlug) {
              slug = await generateUniqueSlug(name);
            }
          }
          
          // Process category
          let categoryId = null;
          if ('Kategorie' in row) {
            const categoryName = row['Kategorie']?.toString().trim();
            if (categoryName) {
              const category = categoryCache!.get(categoryName.toLowerCase());
              if (category) {
                categoryId = category.id;
              } else {
                // Create new category if it doesn't exist
                const newCategory = await prisma.category.create({
                  data: {
                    name: categoryName,
                    slug: createSlug(categoryName),
                    order: await prisma.category.count()
                  }
                });
                categoryId = newCategory.id;
                categoryCache!.set(categoryName.toLowerCase(), newCategory);
              }
            }
          }
          
          // Create new product with all available data
          const newProductData = {
            code,
            name,
            slug,
            price: parseFloat(row['Cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
            stock: parseInt(row['Skladem'].toString().replace(/[^\d]/g, '') || '0'),
            description: row['Krátký popis']?.toString().trim() || null,
            detailDescription: row['Detailní popis']?.toString().trim() || null,
            regularPrice: row['Běžná cena'] && row['Běžná cena'] !== '' ? 
              parseFloat(row['Běžná cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
              null,
            brand: row['Značka']?.toString().trim() || null,
            warranty: row['Záruka']?.toString().trim() || null,
            image: row['Hlavní obrázek']?.toString().trim() || null,
            categoryId
          };
          
          await prisma.product.create({
            data: newProductData
          });
          
          result.created++;
          result.details.push({
            productCode: code,
            productName: name,
            action: 'created'
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Řádek ${rowIndex + 2}: ${errorMessage}`);
        result.details.push({
          productCode: row['Kód'] || 'N/A',
          productName: row['Název'] || 'Neznámý',
          action: 'error',
          message: errorMessage
        });
      }
    }
    
    // Process variants sheet if it exists AND this is the last chunk
    if ((!chunkInfo || chunkInfo.isLastChunk) && workbook.SheetNames.includes('Varianty')) {
      const variantsSheet = workbook.Sheets['Varianty'];
      const variantsData = XLSX.utils.sheet_to_json(variantsSheet);
      
      for (let varIndex = 0; varIndex < variantsData.length; varIndex++) {
        const variant = variantsData[varIndex] as any;
        try {
          await processVariant(variant, varIndex + 2);
        } catch (error) {
          result.errors.push(`Varianty - řádek ${varIndex + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
    
    // Clear category cache on last chunk
    if (chunkInfo && chunkInfo.isLastChunk) {
      categoryCache = null;
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

async function processVariant(variant: any, rowNumber: number) {
  // Support multiple column name variations and always trim
  const rawCode = variant['Kód produktu'] || variant['Kod produktu'] || variant['Product Code'];
  const productCode = rawCode?.toString().trim();
  if (!productCode) {
    throw new Error(`Chybí kód produktu pro variantu`);
  }
  
  const product = await prisma.product.findFirst({
    where: { code: productCode }
  });
  
  if (!product) {
    throw new Error(`Produkt s kódem ${productCode} nenalezen`);
  }
  
  // Build variant data - only include fields that are present
  const variantData: any = {
    productId: product.id,
    sizeOrder: 0,
    order: 0,
    stock: 0 // Default stock to 0
  };
  
  // Only add fields that are present in the import
  if ('Barva' in variant && variant['Barva']) {
    variantData.colorName = variant['Barva'].toString().trim();
  }
  
  if ('Kód barvy' in variant && variant['Kód barvy']) {
    variantData.colorCode = variant['Kód barvy'].toString().trim();
  }
  
  if ('Velikost' in variant && variant['Velikost']) {
    variantData.sizeName = variant['Velikost'].toString().trim();
  }
  
  if ('Skladem' in variant && variant['Skladem'] !== undefined && variant['Skladem'] !== '') {
    variantData.stock = parseInt(variant['Skladem'].toString() || '0');
  }
  
  if ('Cena varianty' in variant && variant['Cena varianty'] !== undefined && variant['Cena varianty'] !== '') {
    variantData.price = parseFloat(variant['Cena varianty'].toString().replace(/[^\d.,]/g, '').replace(',', '.'));
  }
  
  if ('Obrázek varianty' in variant && variant['Obrázek varianty']) {
    variantData.imageUrl = variant['Obrázek varianty'].toString().trim();
  }
  
  // Check if variant already exists
  const whereConditions: any = {
    productId: product.id
  };
  
  if (variantData.colorName !== undefined) {
    whereConditions.colorName = variantData.colorName;
  }
  if (variantData.sizeName !== undefined) {
    whereConditions.sizeName = variantData.sizeName;
  }
  
  const existingVariant = await prisma.productVariant.findFirst({
    where: whereConditions
  });
  
  if (existingVariant) {
    // Update only the fields that are present in the import
    const updateData: any = {};
    
    if ('colorName' in variantData) updateData.colorName = variantData.colorName;
    if ('colorCode' in variantData) updateData.colorCode = variantData.colorCode;
    if ('sizeName' in variantData) updateData.sizeName = variantData.sizeName;
    if ('stock' in variantData) updateData.stock = variantData.stock;
    if ('price' in variantData) updateData.price = variantData.price;
    if ('imageUrl' in variantData) updateData.imageUrl = variantData.imageUrl;
    
    await prisma.productVariant.update({
      where: { id: existingVariant.id },
      data: updateData
    });
  } else {
    // Create new variant only if it has at least color or size
    if (!variantData.colorName && !variantData.sizeName) {
      throw new Error('Varianta musí mít alespoň barvu nebo velikost');
    }
    
    await prisma.productVariant.create({
      data: variantData
    });
  }
}