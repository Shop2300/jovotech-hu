// src/app/api/feeds/google-shopping/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all active products with their categories
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // Filter out products without required data
    const validProducts = products.filter(product => 
      product.name && 
      product.price && 
      product.slug && 
      product.category?.slug &&
      product.images.length > 0
    );

    // Generate XML feed
    const xml = generateGoogleShoppingFeed(validProducts);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating Google Shopping feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}

function generateGoogleShoppingFeed(products: any[]) {
  const baseUrl = 'https://www.galaxysklep.pl';
  
  const items = products.map(product => {
    // Get primary image
    const primaryImage = product.images[0]?.url || '/images/placeholder.jpg';
    const imageUrl = primaryImage.startsWith('http') 
      ? primaryImage 
      : `${baseUrl}/${primaryImage}`;
    
    // Additional images
    const additionalImages = product.images.slice(1, 10).map((img: { url: string }) => 
      img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
    );
    
    // Product URL
    const productUrl = `${baseUrl}/${product.category.slug}/${product.slug}`;
    
    // Availability
    const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';
    
    // Condition
    const condition = 'new';
    
    // Price formatting (ensure it's in PLN with 2 decimal places)
    const price = `${product.price.toFixed(2)} PLN`;
    
    // Generate GTIN/MPN (use product code if available)
    const gtin = product.code || `GS${product.id.substring(0, 8).toUpperCase()}`;
    
    // Brand (you can customize this based on your products)
    const brand = product.brand || 'Galaxy Sklep';
    
    // Google product category (map your categories to Google's taxonomy)
    const googleCategory = mapToGoogleCategory(product.category.slug);
    
    // Shipping weight (in kg)
    const shippingWeight = product.weight ? `${product.weight} kg` : '1 kg';

    return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${escapeXml(product.name)}]]></g:title>
      <g:description><![CDATA[${escapeXml(product.description || product.name)}]]></g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      ${additionalImages.map((img: string) => `<g:additional_image_link>${img}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand><![CDATA[${brand}]]></g:brand>
      <g:condition>${condition}</g:condition>
      <g:gtin>${gtin}</g:gtin>
      <g:mpn>${product.code || gtin}</g:mpn>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${product.category.name}]]></g:product_type>
      <g:shipping>
        <g:country>PL</g:country>
        <g:service>Standard</g:service>
        <g:price>15.00 PLN</g:price>
      </g:shipping>
      <g:shipping_weight>${shippingWeight}</g:shipping_weight>
      <g:item_group_id>${product.categoryId}</g:item_group_id>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Galaxy Sklep - Product Feed</title>
    <link>${baseUrl}</link>
    <description>Profesjonalne urządzenia dla Twojego biznesu</description>
    ${items}
  </channel>
</rss>`;
}

function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function mapToGoogleCategory(categorySlug: string): number {
  // Map your categories to Google's product taxonomy
  // Full list: https://www.google.com/basepages/producttype/taxonomy.en-US.txt
  const categoryMap: { [key: string]: number } = {
    'elektronika': 2082, // Electronics
    'prasy-termotransferowe': 2082, // Electronics > Print, Copy, Scan & Fax
    'lasery': 2082, // Electronics
    'routery-cnc': 1305, // Business & Industrial > Manufacturing
    'ultradzwieki': 2082, // Electronics
    'maszyny-przemyslowe': 1305, // Business & Industrial
  };
  
  return categoryMap[categorySlug] || 2082; // Default to Electronics
}