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
  variants?: {
    created: number;
    updated: number;
    errors: number;
    details: {
      productCode: string;
      variant: string;
      action: 'created' | 'updated' | 'error';
      message?: string;
    }[];
  };
}

interface ChunkInfo {
  currentChunk: number;
  totalChunks: number;
  isLastChunk: boolean;
}

interface VariantResult {
  productCode: string;
  variant: string;
  action: 'created' | 'updated' | 'error';
  message?: string;
}

interface VariantRow {
  'Kód produktu'?: string;
  'Název produktu'?: string;
  'Varianta'?: string;
  'Barva'?: string;
  'Kód barvy'?: string;
  'Velikost'?: string;
  'Skladem'?: string | number;
  'Cena varianty'?: string | number;
  'Běžná cena (Kč)'?: string | number;
}

// Required fields for creating a new product
const REQUIRED_FIELDS_FOR_NEW = ['Kód', 'Název', 'Cena', 'Skladem'];

// Maximum details to keep in response (to avoid huge payloads)
const MAX_DETAILS_IN_RESPONSE = 1000;
const MAX_ERRORS_IN_RESPONSE = 100;

// BATCH SIZE FOR PROCESSING - REDUCED TO 10
const PRODUCT_BATCH_SIZE = 10;
const VARIANT_BATCH_SIZE = 10;

// Cache for categories to avoid repeated database queries
let categoryCache: Map<string, any> | null = null;

// Helper function to normalize values - empty strings become null
const normalize = (value: any): string | null => {
  if (!value || value === '') return null;
  return value.toString().trim();
};

// Helper function to generate unique slug
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  let slug = createSlug(name);
  let counter = 1;
  
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

// Process variant with position-based matching
async function processVariantByPosition(
  variant: VariantRow, 
  rowNumber: number,
  productCode: string,
  product: any,
  variantPosition: number
): Promise<VariantResult> {
  try {
    // Check if this is a "random" variant (has "Varianta" column)
    const isRandomVariant = 'Varianta' in variant && variant['Varianta'];
    
    // Extract and normalize variant data
    let colorName: string | null;
    let colorCode: string | null;
    let sizeName: string | null;
    
    if (isRandomVariant) {
      colorName = normalize(variant['Varianta']);
      colorCode = null;
      sizeName = null;
    } else {
      colorName = normalize(variant['Barva']);
      colorCode = normalize(variant['Kód barvy']);
      sizeName = normalize(variant['Velikost']);
    }
    
    const stock = parseInt(variant['Skladem']?.toString() || '0') || 0;
    const price = variant['Cena varianty'] ? 
      parseFloat(variant['Cena varianty'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
      null;
    const regularPrice = variant['Běžná cena (Kč)'] ? 
      parseFloat(variant['Běžná cena (Kč)'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
      null;
    
    // Build variant identifier for logging
    const variantIdentifier = isRandomVariant 
      ? colorName || 'Základní varianta'
      : [colorName, sizeName].filter(Boolean).join(' ') || 'Základní varianta';
    
    // Must have at least some identifying information
    if (!colorName && !sizeName) {
      throw new Error('Varianta musí mít alespoň barvu, velikost nebo název varianty');
    }
    
    // Get all existing variants for this product in a consistent order
    const existingVariants = await prisma.productVariant.findMany({
      where: { productId: product.id },
      orderBy: [
        { order: 'asc' },
        { id: 'asc' }  // Consistent secondary sort by ID
      ]
    });
    
    // POSITION-BASED MATCHING
    let existingVariant = null;
    
    // Group existing variants by type for proper position matching
    const randomVariants = existingVariants.filter(v => v.colorName && !v.sizeName && !v.colorCode?.match(/^#[0-9A-Fa-f]{6}$/));
    const colorVariants = existingVariants.filter(v => v.colorName && !v.sizeName && v.colorCode?.match(/^#[0-9A-Fa-f]{6}$/));
    const sizeVariants = existingVariants.filter(v => !v.colorName && v.sizeName);
    const colorSizeVariants = existingVariants.filter(v => v.colorName && v.sizeName);
    
    if (isRandomVariant) {
      // Match random variant by position within random variants
      if (variantPosition < randomVariants.length) {
        existingVariant = randomVariants[variantPosition];
      }
    } else if (colorName && sizeName) {
      // Match color+size variant by position within color+size variants
      if (variantPosition < colorSizeVariants.length) {
        existingVariant = colorSizeVariants[variantPosition];
      }
    } else if (colorName) {
      // Match color variant by position within color variants
      if (variantPosition < colorVariants.length) {
        existingVariant = colorVariants[variantPosition];
      }
    } else if (sizeName) {
      // Match size variant by position within size variants
      if (variantPosition < sizeVariants.length) {
        existingVariant = sizeVariants[variantPosition];
      }
    }
    
    if (existingVariant) {
      // UPDATE existing variant
      const updateData: any = {};
      const updatedFields: string[] = [];
      
      // Allow name changes for all variant types when using position matching
      if (colorName !== existingVariant.colorName) {
        updateData.colorName = colorName;
        const oldName = existingVariant.colorName || '';
        const newName = colorName || '';
        updatedFields.push(`název: "${oldName}" → "${newName}"`);
      }
      
      if (sizeName !== existingVariant.sizeName) {
        updateData.sizeName = sizeName;
        const oldSize = existingVariant.sizeName || '';
        const newSize = sizeName || '';
        updatedFields.push(`velikost: "${oldSize}" → "${newSize}"`);
      }
      
      if (!isRandomVariant && colorCode !== existingVariant.colorCode) {
        updateData.colorCode = colorCode;
        updatedFields.push('kód barvy');
      }
      
      if (stock !== existingVariant.stock) {
        updateData.stock = stock;
        updatedFields.push(`skladem: ${existingVariant.stock} → ${stock}`);
      }
      
      if (price !== null) {
        const existingPrice = existingVariant.price ? Number(existingVariant.price) : null;
        if (price !== existingPrice) {
          updateData.price = price;
          updatedFields.push(`cena: ${existingPrice || 0} → ${price}`);
        }
      }
      
      if (regularPrice !== null) {
        const existingRegularPrice = existingVariant.regularPrice ? Number(existingVariant.regularPrice) : null;
        if (regularPrice !== existingRegularPrice) {
          updateData.regularPrice = regularPrice;
          updatedFields.push(`běžná cena: ${existingRegularPrice || 0} → ${regularPrice}`);
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: updateData
        });
        
        return {
          productCode,
          variant: variantIdentifier,
          action: 'updated',
          message: `Aktualizováno: ${updatedFields.join(', ')}`
        };
      } else {
        return {
          productCode,
          variant: variantIdentifier,
          action: 'updated',
          message: 'Žádné změny'
        };
      }
    } else {
      // CREATE new variant (only if beyond existing count)
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          colorName: colorName,
          colorCode: colorCode,
          sizeName: sizeName,
          stock: stock,
          price: price,
          regularPrice: regularPrice,
          order: 0,
          sizeOrder: 0
        }
      });
      
      return {
        productCode,
        variant: variantIdentifier,
        action: 'created',
        message: 'Nová varianta vytvořena'
      };
    }
  } catch (error) {
    // Ensure we always return a valid VariantResult even on error
    return {
      productCode,
      variant: 'Unknown',
      action: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Process variants in batches to avoid memory issues
async function processVariantsInBatches(
  variantsData: VariantRow[],
  batchSize: number = VARIANT_BATCH_SIZE
): Promise<{
  created: number;
  updated: number;
  errors: number;
  details: VariantResult[];
  errorMessages: string[];
}> {
  const result = {
    created: 0,
    updated: 0,
    errors: 0,
    details: [] as VariantResult[],
    errorMessages: [] as string[]
  };

  // Group variants by product code
  const variantsByProduct = new Map<string, VariantRow[]>();
  for (const variant of variantsData) {
    const productCode = normalize(variant['Kód produktu']);
    if (!productCode) continue;
    
    if (!variantsByProduct.has(productCode)) {
      variantsByProduct.set(productCode, []);
    }
    variantsByProduct.get(productCode)!.push(variant);
  }

  // Process products in batches
  const productCodes = Array.from(variantsByProduct.keys());
  for (let i = 0; i < productCodes.length; i += batchSize) {
    const batch = productCodes.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (productCode) => {
      try {
        const product = await prisma.product.findFirst({
          where: { code: productCode }
        });
        
        if (!product) {
          const productVariants = variantsByProduct.get(productCode)!;
          for (const variant of productVariants) {
            result.errors++;
            result.errorMessages.push(`Varianty: Produkt s kódem ${productCode} nenalezen`);
            result.details.push({
              productCode,
              variant: 'N/A',
              action: 'error',
              message: 'Produkt nenalezen'
            });
          }
          return;
        }

        const productVariants = variantsByProduct.get(productCode)!;
        
        // Track position by variant type
        let randomVariantPosition = 0;
        let colorVariantPosition = 0;
        let sizeVariantPosition = 0;
        let colorSizeVariantPosition = 0;
        
        for (const variant of productVariants) {
          try {
            // Determine variant type and position
            const isRandomVariant = 'Varianta' in variant && variant['Varianta'];
            const hasColor = variant['Barva'] && variant['Barva'].toString().trim();
            const hasSize = variant['Velikost'] && variant['Velikost'].toString().trim();
            
            let position = 0;
            if (isRandomVariant) {
              position = randomVariantPosition++;
            } else if (hasColor && hasSize) {
              position = colorSizeVariantPosition++;
            } else if (hasColor) {
              position = colorVariantPosition++;
            } else if (hasSize) {
              position = sizeVariantPosition++;
            }
            
            const variantResult = await processVariantByPosition(
              variant,
              0, // row number not used in batched processing
              productCode,
              product,
              position
            );
            
            if (variantResult.action === 'created') {
              result.created++;
            } else if (variantResult.action === 'updated') {
              result.updated++;
            } else if (variantResult.action === 'error') {
              result.errors++;
            }
            
            result.details.push(variantResult);
          } catch (error) {
            result.errors++;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            result.errorMessages.push(`Varianta pro produkt ${productCode}: ${errorMessage}`);
            result.details.push({
              productCode,
              variant: 'Unknown',
              action: 'error',
              message: errorMessage
            });
          }
        }
      } catch (error) {
        console.error(`Error processing product ${productCode}:`, error);
        result.errors++;
        result.errorMessages.push(`Produkt ${productCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }));
  }

  return result;
}

// NEW: Process products in batches
async function processProductsInBatches(
  data: any[],
  batchSize: number = PRODUCT_BATCH_SIZE
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    details: []
  };

  // Process products in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    // Process each product in the batch
    for (let j = 0; j < batch.length; j++) {
      const row = batch[j];
      const rowIndex = i + j;
      
      try {
        const rawCode = row['Kód'] || row['Kod'] || row['Code'];
        const code = rawCode?.toString().trim();
        if (!code) {
          result.errors.push(`Řádek ${rowIndex + 2}: Chybí povinný kód produktu`);
          if (result.details.length < MAX_DETAILS_IN_RESPONSE) {
            result.details.push({
              productCode: 'N/A',
              productName: row['Název'] || 'Neznámý',
              action: 'error',
              message: 'Chybí kód produktu'
            });
          }
          continue;
        }
        
        const existingProduct = await prisma.product.findFirst({
          where: { code }
        });
        
        if (existingProduct) {
          // UPDATE EXISTING PRODUCT
          const updateData: any = {};
          let nameChanged = false;
          let slugUpdated = false;
          
          if ('Název' in row && row['Název']) {
            const newName = row['Název'].toString().trim();
            if (newName !== existingProduct.name) {
              updateData.name = newName;
              nameChanged = true;
              
              if (!('Slug' in row && row['Slug'])) {
                updateData.slug = await generateUniqueSlug(newName, existingProduct.id);
                slugUpdated = true;
              }
            }
          }
          
          if ('Slug' in row && row['Slug']) {
            const providedSlug = row['Slug'].toString().trim();
            const existingWithSlug = await prisma.product.findFirst({
              where: {
                slug: providedSlug,
                id: { not: existingProduct.id }
              }
            });
            
            if (existingWithSlug) {
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
            updateData.brand = normalize(row['Značka']);
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
            updateData.description = normalize(row['Krátký popis']);
          }
          
          if ('Detailní popis' in row) {
            updateData.detailDescription = normalize(row['Detailní popis']);
          }
          
          if ('Záruka' in row) {
            updateData.warranty = normalize(row['Záruka']);
          }
          
          if ('Hlavní obrázek' in row) {
            updateData.image = normalize(row['Hlavní obrázek']);
          }
          
          if (Object.keys(updateData).length > 0) {
            await prisma.product.update({
              where: { id: existingProduct.id },
              data: updateData
            });
            
            result.updated++;
            let message = `Aktualizováno ${Object.keys(updateData).length} polí`;
            if (slugUpdated) message += ' (URL automaticky aktualizováno)';
            
            if (result.details.length < MAX_DETAILS_IN_RESPONSE) {
              result.details.push({
                productCode: code,
                productName: updateData.name || existingProduct.name,
                action: 'updated',
                message
              });
            }
          } else {
            result.skipped++;
            if (result.details.length < MAX_DETAILS_IN_RESPONSE) {
              result.details.push({
                productCode: code,
                productName: existingProduct.name,
                action: 'skipped',
                message: 'Žádné změny'
              });
            }
          }
        } else {
          // CREATE NEW PRODUCT
          const missingFields = [];
          
          for (const field of REQUIRED_FIELDS_FOR_NEW) {
            if (!(field in row) || !row[field] || row[field].toString().trim() === '') {
              missingFields.push(field);
            }
          }
          
          if (missingFields.length > 0) {
            if (result.errors.length < MAX_ERRORS_IN_RESPONSE) {
              result.errors.push(`Řádek ${rowIndex + 2}: Nelze vytvořit nový produkt - chybí povinná pole: ${missingFields.join(', ')}`);
            }
            if (result.details.length < MAX_DETAILS_IN_RESPONSE) {
              result.details.push({
                productCode: code,
                productName: row['Název'] || 'Neznámý',
                action: 'error',
                message: `Chybí povinná pole: ${missingFields.join(', ')}`
              });
            }
            continue;
          }
          
          const name = row['Název'].toString().trim();
          let slug = row['Slug']?.toString().trim();
          
          if (!slug) {
            slug = await generateUniqueSlug(name);
          } else {
            const existingWithSlug = await prisma.product.findFirst({ where: { slug } });
            if (existingWithSlug) {
              slug = await generateUniqueSlug(name);
            }
          }
          
          let categoryId = null;
          if ('Kategorie' in row) {
            const categoryName = row['Kategorie']?.toString().trim();
            if (categoryName) {
              const category = categoryCache!.get(categoryName.toLowerCase());
              if (category) {
                categoryId = category.id;
              } else {
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
          
          const newProductData = {
            code,
            name,
            slug,
            price: parseFloat(row['Cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.') || '0'),
            stock: parseInt(row['Skladem'].toString().replace(/[^\d]/g, '') || '0'),
            description: normalize(row['Krátký popis']),
            detailDescription: normalize(row['Detailní popis']),
            regularPrice: row['Běžná cena'] && row['Běžná cena'] !== '' ? 
              parseFloat(row['Běžná cena'].toString().replace(/[^\d.,]/g, '').replace(',', '.')) : 
              null,
            brand: normalize(row['Značka']),
            warranty: normalize(row['Záruka']),
            image: normalize(row['Hlavní obrázek']),
            categoryId
          };
          
          await prisma.product.create({
            data: newProductData
          });
          
          result.created++;
          if (result.details.length < MAX_DETAILS_IN_RESPONSE) {
            result.details.push({
              productCode: code,
              productName: name,
              action: 'created'
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (result.errors.length < MAX_ERRORS_IN_RESPONSE) {
          result.errors.push(`Řádek ${rowIndex + 2}: ${errorMessage}`);
        }
        if (result.details.length < MAX_DETAILS_IN_RESPONSE) {
          result.details.push({
            productCode: row['Kód'] || 'N/A',
            productName: row['Název'] || 'Neznámý',
            action: 'error',
            message: errorMessage
          });
        }
      }
    }
    
    // Small delay between batches to prevent overwhelming the database
    if (i + batchSize < data.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return result;
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
    
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let workbook: XLSX.WorkBook;
    let data: any[];
    
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } catch (parseError) {
      console.error('Excel parsing error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse Excel file. Please ensure the file is valid.' },
        { status: 400 }
      );
    }
    
    // Initialize or use existing category cache
    if (!categoryCache || (chunkInfo && chunkInfo.currentChunk === 1)) {
      const categories = await prisma.category.findMany();
      categoryCache = new Map(categories.map((c: any) => [c.name.toLowerCase(), c]));
    }
    
    // Process products in batches
    const result = await processProductsInBatches(data, PRODUCT_BATCH_SIZE);
    
    // Process variants with batching
    if (workbook.SheetNames.includes('Varianty')) {
      try {
        const variantsSheet = workbook.Sheets['Varianty'];
        const variantsData = XLSX.utils.sheet_to_json<VariantRow>(variantsSheet);
        
        console.log(`Processing ${variantsData.length} variants with batching...`);
        
        // Process variants in batches to avoid memory issues
        const variantResults = await processVariantsInBatches(variantsData, VARIANT_BATCH_SIZE);
        
        result.variants = {
          created: variantResults.created,
          updated: variantResults.updated,
          errors: variantResults.errors,
          details: variantResults.details.slice(0, MAX_DETAILS_IN_RESPONSE)
        };
        
        // Add variant errors to main errors array
        if (variantResults.errorMessages.length > 0) {
          result.errors.push(...variantResults.errorMessages.slice(0, MAX_ERRORS_IN_RESPONSE - result.errors.length));
        }
        
        // Add summary if details were truncated
        if (variantResults.details.length > MAX_DETAILS_IN_RESPONSE) {
          result.variants.details.push({
            productCode: '...',
            variant: '...',
            action: 'updated',
            message: `A dalších ${variantResults.details.length - MAX_DETAILS_IN_RESPONSE} variant...`
          });
        }
      } catch (variantError) {
        console.error('Error processing variants:', variantError);
        result.errors.push(`Chyba při zpracování variant: ${variantError instanceof Error ? variantError.message : 'Unknown error'}`);
      }
    }
    
    // Clear cache if this is the last chunk
    if (!chunkInfo || chunkInfo.isLastChunk) {
      categoryCache = null;
    }
    
    // Add summary messages if data was truncated
    if (result.errors.length >= MAX_ERRORS_IN_RESPONSE) {
      result.errors[MAX_ERRORS_IN_RESPONSE - 1] = `... a další chyby (celkem ${result.errors.length})`;
      result.errors = result.errors.slice(0, MAX_ERRORS_IN_RESPONSE);
    }
    
    if (result.details.length >= MAX_DETAILS_IN_RESPONSE) {
      result.details[MAX_DETAILS_IN_RESPONSE - 1] = {
        productCode: '...',
        productName: '...',
        action: 'skipped',
        message: `A dalších ${result.created + result.updated + result.skipped - MAX_DETAILS_IN_RESPONSE} produktů...`
      };
      result.details = result.details.slice(0, MAX_DETAILS_IN_RESPONSE);
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Import error:', error);
    
    // Always return a valid JSON response
    return NextResponse.json(
      { 
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: ['Import failed: ' + (error instanceof Error ? error.message : 'Unknown error')],
        details: []
      },
      { status: 500 }
    );
  }
}