// src/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { debounce, highlightText, getRecentSearches, saveRecentSearch, clearRecentSearches } from '@/lib/search-utils';

interface SearchResult {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  regularPrice?: number | null;
  image: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular searches (Polish products)
  const popularSearches = ['router CNC', 'ultradźwięki', 'prasy', 'lasery', 'elektronika'];

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setCategories([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&instant=true&limit=5`
        );
        const data = await response.json();

        if (response.ok) {
          setResults(data.products || []);
          setCategories(data.categories || []);
          setTotalResults(data.totalResults || 0);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      setIsOpen(true);
      performSearch(value);
    } else {
      setIsOpen(true); // Show recent/popular searches
      setResults([]);
      setCategories([]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + categories.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          if (selectedIndex < categories.length) {
            // Navigate to category
            const category = categories[selectedIndex];
            router.push(`/category/${category.slug}`);
          } else {
            // Navigate to product
            const product = results[selectedIndex - categories.length];
            const productUrl = product.category?.slug && product.slug
              ? `/${product.category.slug}/${product.slug}`
              : `/products/${product.id}`;
            router.push(productUrl);
          }
          setIsOpen(false);
          inputRef.current?.blur();
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setCategories([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full search-bar-container" style={{ zIndex: 2147483645 }}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Czego szukasz? Np. router CNC, ultradźwięki, prasy termotransferowe..."
          className="w-full px-4 py-2.5 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white placeholder:text-sm placeholder:text-gray-400"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          
          <button
            type="submit"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <>
          {/* Invisible backdrop to ensure isolation */}
          <div 
            className="fixed inset-0 search-backdrop-overlay" 
            style={{ zIndex: 2147483646 }}
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-hidden search-dropdown" style={{ 
            backgroundColor: '#ffffff',
            zIndex: 2147483647,
            isolation: 'isolate'
          }}>
          <div className="overflow-y-auto max-h-[500px] bg-white">
            {/* Categories Section */}
            {categories.length > 0 && (
              <div className="border-b border-gray-100 bg-white">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Kategorie
                </div>
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 hover:bg-gray-50 transition-colors ${
                      selectedIndex === index ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(category.name, query) 
                        }}
                      />
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Products Section */}
            {results.length > 0 && (
              <div className="border-b border-gray-100 bg-white">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Produkty
                </div>
                {results.map((product, index) => {
                  const actualIndex = categories.length + index;
                  const productUrl = product.category?.slug && product.slug
                    ? `/${product.category.slug}/${product.slug}`
                    : `/products/${product.id}`;
                  const discount = product.regularPrice 
                    ? calculateDiscount(product.price, product.regularPrice) 
                    : 0;

                  return (
                    <Link
                      key={product.id}
                      href={productUrl}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedIndex === actualIndex ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Product Image */}
                        <div className="w-12 h-12 flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <Search size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div 
                            className="text-sm text-gray-900 font-medium truncate"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightText(product.name, query) 
                            }}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            {discount > 0 ? (
                              <>
                                <span className="text-sm font-semibold text-red-600">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(product.regularPrice!)}
                                </span>
                                <span className="text-xs text-red-600 font-medium">
                                  -{discount}%
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                            )}
                            {product.stock === 0 && (
                              <span className="text-xs text-red-500">Wyprzedane</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Show "View all results" if there are more results */}
            {query && totalResults > 5 && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center text-sm text-blue-600 hover:bg-gray-50 transition-colors"
              >
                Zobacz wszystkie wyniki ({totalResults})
              </Link>
            )}

            {/* No results message */}
            {query && !loading && results.length === 0 && categories.length === 0 && (
              <div className="px-4 py-8 text-center bg-white">
                <Search size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  Nie znaleźliśmy żadnych wyników dla "{query}"
                </p>
              </div>
            )}

            {/* Recent & Popular Searches (when no query) */}
            {!query && !loading && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="border-b border-gray-100 bg-white">
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Ostatnie wyszukiwania
                      </span>
                      <button
                        onClick={() => {
                          clearRecentSearches();
                          setRecentSearches([]);
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Wyczyść
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                <div className="bg-white">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Popularne wyszukiwania
                  </div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <TrendingUp size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}