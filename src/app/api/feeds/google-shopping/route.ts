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
  const baseUrl = 'https://jovotech.hu';
  
  const items = products.map(product => {
    // Get primary image - fix the path
    const primaryImage = product.images[0]?.url || '/images/placeholder.jpg';
    const imageUrl = primaryImage.startsWith('http') 
      ? primaryImage 
      : primaryImage.startsWith('/') 
        ? `${baseUrl}${primaryImage}`
        : `${baseUrl}/${primaryImage}`;
    
    // Additional images
    const additionalImages = product.images.slice(1, 10).map((img: { url: string }) => {
      if (img.url.startsWith('http')) return img.url;
      return img.url.startsWith('/') ? `${baseUrl}${img.url}` : `${baseUrl}/${img.url}`;
    });
    
    // Product URL
    const productUrl = `${baseUrl}/${product.category.slug}/${product.slug}`;
    
    // Availability
    const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';
    
    // Condition
    const condition = 'new';
    
    // Price formatting (ensure it's in HUF without decimals)
    const price = `${Math.round(product.price)} HUF`;
    
    // Determine brand
    const brand = product.brand || (product.name.toLowerCase().includes('vevor') ? 'VEVOR' : 'Jovotech');
    
    // MPN (Manufacturer Part Number) - use product code or ID
    const mpn = product.code || `SKU-${product.id.substring(0, 8).toUpperCase()}`;
    
    // Google product category (map your categories to Google's taxonomy)
    const googleCategory = mapToGoogleCategory(product.category.slug);
    
    // Shipping weight (in kg)
    const shippingWeight = product.weight ? `${product.weight} kg` : '1 kg';

    // Free shipping for all orders
    const shippingPrice = '0 HUF';

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
      <g:identifier_exists>no</g:identifier_exists>
      <g:mpn>${mpn}</g:mpn>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type><![CDATA[${product.category.name}]]></g:product_type>
      <g:shipping>
        <g:country>HU</g:country>
        <g:service>Standard</g:service>
        <g:price>${shippingPrice}</g:price>
      </g:shipping>
      <g:shipping_weight>${shippingWeight}</g:shipping_weight>
      <g:item_group_id>${product.categoryId}</g:item_group_id>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Jovotech.hu - Termék Feed</title>
    <link>${baseUrl}</link>
    <description>Professzionális eszközök vállalkozásának</description>
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
  // Map Hungarian categories to Google's product taxonomy
  // Full list: https://www.google.com/basepages/producttype/taxonomy.en-US.txt
  
  const categoryMap: { [key: string]: number } = {
    // Automotive
    'auto-motorkerekparok': 888, // Vehicles & Parts > Vehicle Parts & Accessories
    
    // DIY & Tools
    'barkacsbolt': 632, // Business & Industrial > Construction
    'elektromos-szerszamok': 1167, // Hardware > Tools > Power Tools
    'keziszerszamok': 1162, // Hardware > Tools > Hand Tools
    'szerszamtarolas': 3456, // Hardware > Tool Storage & Organization
    'pneumatikus-szerszamok-es-kompresszorok': 1167, // Hardware > Tools > Power Tools
    
    // Safety & Security
    'biztonsag': 359, // Business & Industrial > Work Safety Equipment
    'munkacipo': 1604, // Apparel & Accessories > Shoes > Work & Safety Shoes
    
    // Health & Wellness
    'egeszseg-es-jollet': 491, // Health & Beauty
    
    // Industrial Equipment
    'emeloberendezesek-es-csorlok': 1810, // Business & Industrial > Material Handling
    'esztergak': 1305, // Business & Industrial > Manufacturing
    'hegesztes': 990, // Business & Industrial > Manufacturing > Welding
    'laboratorium': 2895, // Business & Industrial > Science & Laboratory
    'villamosmernoki': 127, // Electronics > Electronics Accessories
    
    // Painting & Art
    'festes': 504, // Hardware > Paint & Wall Treatments
    'textilnyomtatas': 2420, // Business & Industrial > Printing & Graphic Arts
    
    // Kids & Toys
    'gyermekek-es-jatekok': 1239, // Toys & Games
    
    // Pets
    'haziallatok': 2, // Animals & Pet Supplies
    
    // Cooling & Heating
    'huto-es-fagyasztoberendezesek': 2901, // Home & Garden > Kitchen & Dining > Kitchen Appliances
    'legkondicionalas': 604, // Home & Garden > Heating, Cooling & Air Quality
    
    // Office
    'irodaszerek': 922, // Office Supplies
    
    // Food & Beverages
    'italok': 499676, // Food, Beverages & Tobacco > Beverages
    'etelkeszito-berendezesek': 730, // Home & Garden > Kitchen & Dining > Kitchen Appliances
    
    // Garden & Outdoor
    'kert-es-gyep': 985, // Home & Garden > Lawn & Garden
    'metszes': 3798, // Home & Garden > Lawn & Garden > Outdoor Power Equipment
    'mezogazdasagi-es-erdeszeti-gepek': 3577, // Business & Industrial > Agriculture
    
    // Energy & Motors
    'megujulo-energia': 1684, // Hardware > Electrical > Solar Energy
    'motorok': 8526, // Business & Industrial > Manufacturing > Motors
    
    // Sports & Recreation
    'sport-es-kikapcsolodas': 988, // Sporting Goods
    
    // Pumps & Plumbing
    'szivattyuk': 1810, // Business & Industrial > Hydraulics, Pneumatics & Pumps
    'vizvezetek-szereles': 1810, // Hardware > Plumbing
    
    // Technology
    'technologia': 2082, // Electronics
    
    // Cleaning & Maintenance
    'tisztito-es-karbantarto-berendezesek': 1025, // Business & Industrial > Janitorial
    'tisztitoberendezesek': 623, // Home & Garden > Household Supplies > Household Cleaning Supplies
    
    // Storage & Material Handling
    'tarolo-es-anyagmozgato-berendezesek': 138, // Business & Industrial > Material Handling
    
    // Packaging Equipment
    'tolto-es-zarogepek': 1305, // Business & Industrial > Manufacturing
    
    // Lighting
    'vilagitas': 594, // Home & Garden > Lighting
    
    // Jewelry
    'ekszergyartas-es-javitas': 5122, // Business & Industrial > Manufacturing > Jewelry & Watch Making
    
    // Construction
    'epites-es-szerkezetek': 632, // Business & Industrial > Construction
    
    // New Products (default)
    'uj-termekek': 2082, // Electronics (default)
  };
  
  // Default to Business & Industrial if category not mapped
  return categoryMap[categorySlug] || 632;
}