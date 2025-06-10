// src/app/search/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug?: string | null;
  description: string | null;
  price: number;
  regularPrice?: number | null;
  stock: number;
  image: string | null;
  brand?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  variants?: Array<{
    id: string;
    colorName: string;
    colorCode?: string | null;
    stock: number;
  }>;
  averageRating?: number;
  totalRatings?: number;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filters
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to search products');
        }

        // Extract unique brands and categories
        const brands = [...new Set(data.products
          .map((p: Product) => p.brand)
          .filter(Boolean))] as string[];
        setAvailableBrands(brands.sort());

        const categories = [...new Map(data.products
          .filter((p: Product) => p.category)
          .map((p: Product) => [p.category!.id, p.category!]))
          .values()];
        setAvailableCategories(
    categories
      .filter((cat): cat is { id: string; name: string } => cat !== null && cat !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name))
  );

        // Calculate price range
        if (data.products.length > 0) {
          const prices = data.products.map((p: Product) => p.price);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }

        setProducts(data.products);
      } catch (err) {
        setError('Coś poszło nie tak podczas wyszukiwania');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      // Stock filter
      if (showInStockOnly) {
        const hasStock = product.variants && product.variants.length > 0
          ? product.variants.some(v => v.stock > 0)
          : product.stock > 0;
        if (!hasStock) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand || '')) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category?.id || '')) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'relevance':
        default:
          return 0; // Keep original order from API
      }
    });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setShowInStockOnly(false);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSortBy('relevance');
  };

  const hasActiveFilters = showInStockOnly || selectedBrands.length > 0 || selectedCategories.length > 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Wyniki wyszukiwania
          </h1>
          {query && (
            <p className="text-gray-700">
              Szukana fraza: <span className="font-semibold">"{query}"</span>
              {!loading && (
                <span className="ml-2 text-gray-500">
                  ({filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'wynik' : filteredAndSortedProducts.length < 5 ? 'wyniki' : 'wyników'})
                </span>
              )}
            </p>
          )}
        </div>

        {/* Filters and Sort Bar */}
        {!loading && !error && products.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                <span>Filtry</span>
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {[showInStockOnly, selectedBrands.length > 0, selectedCategories.length > 0].filter(Boolean).length}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Wyczyść filtry
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Trafność</option>
                <option value="price-asc">Cena: od najniższej</option>
                <option value="price-desc">Cena: od najwyższej</option>
                <option value="name-asc">Nazwa: A-Z</option>
                <option value="rating">Ocena</option>
              </select>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && !loading && !error && products.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stock Filter */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Dostępność</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tylko dostępne</span>
                </label>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900">Marka</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900">Kategoria</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableCategories.map(category => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Search size={48} className="mx-auto text-gray-400 animate-pulse mb-4" />
              <p className="text-gray-700">Wyszukuję produkty...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-900 text-lg mb-2">
              {hasActiveFilters 
                ? `Nie znaleźliśmy produktów spełniających twoje kryteria`
                : `Nie znaleźliśmy produktów pasujących do "${query}"`
              }
            </p>
            <p className="text-gray-600 mb-4">
              Spróbuj zmienić wyszukiwaną frazę lub dostosuj filtry
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Wyczyść filtry
              </button>
            )}
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && filteredAndSortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Ładowanie wyników...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}