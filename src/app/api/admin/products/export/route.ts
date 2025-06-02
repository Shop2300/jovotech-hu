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
        'ID': '',
        'Název': '',
        'Slug': '',
        'Kategorie': '',
        'Značka': '',
        'Cena': '',
        'Běžná cena': '',
        'Skladem': '',
        'Krátký popis': '',
        'Detailní popis': '',
        'Záruka': '',
        'Hlavní obrázek': ''
      }];
      
      const variantsTemplate = [{
        'ID produktu': '',
        'Název produktu': '',
        'Barva': '',
        'Kód barvy': '',
        'Velikost': '',
        'Skladem': '',
        'Cena varianty': '',
        'Obrázek varianty': ''
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
        { description: { contains: searchTerm } }
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
    
    // Prepare data for Excel
    const excelData = products.map(product => ({
      'ID': product.id,
      'Název': product.name,
      'Slug': product.slug || '',
      'Kategorie': product.category?.nameCs || '',
      'Značka': product.brand || '',
      'Cena': Number(product.price),
      'Běžná cena': product.regularPrice ? Number(product.regularPrice) : '',
      'Sleva (%)': product.regularPrice && Number(product.regularPrice) > Number(product.price) 
        ? Math.round(((Number(product.regularPrice) - Number(product.price)) / Number(product.regularPrice)) * 100)
        : '',
      'Skladem': product.stock,
      'Krátký popis': product.description || '',
      'Detailní popis': product.detailDescription || '',
      'Záruka': product.warranty || '',
      'Hlavní obrázek': product.image || '',
      'Počet obrázků': product.images.length,
      'Počet variant': product.variants.length,
      'Datum vytvoření': new Date(product.createdAt).toLocaleDateString('cs-CZ'),
      'Datum aktualizace': new Date(product.updatedAt).toLocaleDateString('cs-CZ')
    }));
    
    // Create variants sheet data
    const variantsData: any[] = [];
    products.forEach(product => {
      product.variants.forEach(variant => {
        variantsData.push({
          'ID produktu': product.id,
          'Název produktu': product.name,
          'Barva': variant.colorName || '',
          'Kód barvy': variant.colorCode || '',
          'Velikost': variant.sizeName || '',
          'Skladem': variant.stock,
          'Cena varianty': variant.price ? Number(variant.price) : '',
          'Obrázek varianty': variant.imageUrl || ''
        });
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