// src/components/CategoryProductsClient.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilter, SortOption } from '@/components/ProductFilter';
import { Pagination } from '@/components/Pagination';

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
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  categorySlug: string;
}

export function CategoryProductsClient({ 
  products, 
  currentPage, 
  totalPages, 
  totalProducts,
  categorySlug 
}: CategoryProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSort, setCurrentSort] = useState<SortOption>('recommended');

  useEffect(() => {
    // Get sort from URL if available
    const sortParam = searchParams.get('sort');
    if (sortParam && ['recommended', 'bestselling', 'cheapest', 'expensive', 'alphabetical'].includes(sortParam)) {
      setCurrentSort(sortParam as SortOption);
    }
  }, [searchParams]);

  const handleSortChange = (newSort: SortOption) => {
    setCurrentSort(newSort);
    
    // Update URL with new sort parameter, reset to page 1
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.delete('page'); // Reset to first page when sorting changes
    
    router.push(`/category/${categorySlug}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page'); // Remove page param for page 1
    }
    
    // Preserve sort parameter
    if (currentSort !== 'recommended') {
      params.set('sort', currentSort);
    }
    
    router.push(`/category/${categorySlug}?${params.toString()}`);
    
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Calculate product range for current page
  const startProduct = (currentPage - 1) * 32 + 1;
  const endProduct = Math.min(currentPage * 32, totalProducts);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">V této kategorii zatím nejsou žádné produkty.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <ProductFilter 
        onSortChange={handleSortChange}
        currentSort={currentSort}
        productCount={totalProducts}
        startProduct={startProduct}
        endProduct={endProduct}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={{...product, stock: product.stock || 0}} />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}