// src/app/api/admin/products/export/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const searchTerm = searchParams.get('search');
    const isTemplate = searchParams.get('template') === 'true';
    
    // If template is requested, return empty template
    if (isTemplate) {
      const templateData = [{
        'Kód': '',
        'Název': '',
        'Kategorie': '',
        'Značka': '',
        'Cena': '',
        'Běžná cena': '',
        'Skladem': '',
        'Krátký popis': '',
        'Detailní popis': '',
        'Záruka': ''
      }];
      
      const variantsTemplate = [{
        'Kód produktu': '',
        'Název produktu': '',
        'Varianta': '',  // For random variants
        'Barva': '',
        'Kód barvy': '',
        'Velikost': '',
        'Skladem': '',
        'Cena varianty': '',
        'Běžná cena (Kč)': ''  // Added regular price for variants
      }];
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Add products sheet
      const wsProducts = XLSX.utils.json_to_sheet(templateData);
      XLSX.utils.book_append_sheet(wb, wsProducts, 'Produkty');
      
      // Add variants sheet
      const wsVariants = XLSX.utils.json_to_sheet(variantsTemplate);
      XLSX.utils.book_append_sheet(wb, wsVariants, 'Varianty');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      
      // Return the Excel file
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="produkty-template.xlsx"'
        }
      });
    }
    
    // Build query conditions
    const whereConditions: any = {};
    
    if (categoryId && categoryId !== 'all') {
      whereConditions.categoryId = categoryId;
    }
    
    if (searchTerm) {
      whereConditions.OR = [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { code: { contains: searchTerm } }
      ];
    }
    
    // Fetch products with all relations
    const products = await prisma.product.findMany({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        variants: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Prepare data for Excel - only essential columns
    const excelData = products.map(product => ({
      'Kód': product.code || product.id,
      'Název': product.name,
      'Kategorie': product.category?.name || '',
      'Značka': product.brand || '',
      'Cena': Number(product.price),
      'Běžná cena': product.regularPrice ? Number(product.regularPrice) : '',
      'Skladem': product.stock,
      'Krátký popis': product.description || '',
      'Detailní popis': product.detailDescription || '',
      'Záruka': product.warranty || ''
    }));
    
    // Create variants sheet data
    const variantsData: any[] = [];
    products.forEach(product => {
      product.variants.forEach(variant => {
        // Check if this is likely a "random" variant
        // Random variants: have colorName but no sizeName and either no colorCode or not a hex color
        const isRandomVariant = variant.colorName && 
                               !variant.sizeName && 
                               (!variant.colorCode || !variant.colorCode.match(/^#[0-9A-Fa-f]{6}$/));
        
        if (isRandomVariant) {
          // Export random variants with "Varianta" column
          variantsData.push({
            'Kód produktu': product.code || product.id,
            'Název produktu': product.name,
            'Varianta': variant.colorName || '', // Random variant name goes here
            'Barva': '', // Leave color empty for random variants
            'Kód barvy': '',
            'Velikost': '',
            'Skladem': variant.stock,
            'Cena varianty': variant.price ? Number(variant.price) : '',
            'Běžná cena (Kč)': variant.regularPrice ? Number(variant.regularPrice) : ''
          });
        } else {
          // Export normal color/size variants
          variantsData.push({
            'Kód produktu': product.code || product.id,
            'Název produktu': product.name,
            'Varianta': '', // Leave empty for normal variants
            'Barva': variant.colorName || '',
            'Kód barvy': variant.colorCode || '',
            'Velikost': variant.sizeName || '',
            'Skladem': variant.stock,
            'Cena varianty': variant.price ? Number(variant.price) : '',
            'Běžná cena (Kč)': variant.regularPrice ? Number(variant.regularPrice) : ''
          });
        }
      });
    });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add products sheet
    const wsProducts = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Produkty');
    
    // Add variants sheet if there are any
    if (variantsData.length > 0) {
      const wsVariants = XLSX.utils.json_to_sheet(variantsData);
      XLSX.utils.book_append_sheet(wb, wsVariants, 'Varianty');
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `produkty-export-${timestamp}.xlsx`;
    
    // Return the Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}