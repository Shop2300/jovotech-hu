// src/components/CategoryProductsClient.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilter, SortOption } from '@/components/ProductFilter';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  regularPrice: number | null;
  image: string | null;
  description: string | null;
  code: string | null;
  stock: number | null;
  brand: string | null;
  warranty: string | null;
  isActive: boolean;
  categoryId: string;
  averageRating?: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  variants?: Array<{
    id: string;
    colorName: string;
    colorCode: string | null;
    stock: number;
  }>;
}

interface CategoryProductsClientProps {
  products: Product[];
}

export function CategoryProductsClient({ products }: CategoryProductsClientProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>('recommended');

  useEffect(() => {
    console.log('Current sort changed to:', currentSort);
  }, [currentSort]);

  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];
    
    switch (currentSort) {
      case 'cheapest':
        return productsCopy.sort((a, b) => a.price - b.price);
      
      case 'expensive':
        return productsCopy.sort((a, b) => b.price - a.price);
      
      case 'alphabetical':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
      
      case 'bestselling':
      case 'recommended':
      default:
        // For both bestselling and recommended, we'll use a seeded random
        // This ensures the order is random but consistent during the session
        return productsCopy.sort((a, b) => {
          const seedA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const seedB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          return (seedA * 9301 + 49297) % 233280 - (seedB * 9301 + 49297) % 233280;
        });
    }
  }, [products, currentSort]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 text-lg">V této kategorii zatím nejsou žádné produkty.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <ProductFilter 
        onSortChange={setCurrentSort}
        currentSort={currentSort}
        productCount={products.length}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={{...product, stock: product.stock || 0}} />
        ))}
      </div>
    </div>
  );
}