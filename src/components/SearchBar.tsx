'use client';

import { useState, useEffect, useRef, useCallback, useId, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { debounce, getRecentSearches, saveRecentSearch, clearRecentSearches } from '@/lib/search-utils';

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

type InstantPayload = {
  products: SearchResult[];
  categories: Category[];
  totalResults: number;
};

const CACHE_TTL_MS = 2 * 60 * 1000;
const MIN_QUERY_LENGTH = 2;

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const strip = (s: string) => {
    const n = s.normalize('NFD');
    let out = '';
    for (let i = 0; i < n.length; i++) {
      const code = n.charCodeAt(i);
      if (code < 0x300 || code > 0x36f) out += n[i];
    }
    return out;
  };
  
  const base = strip(text);
  const q = strip(query.trim());
  const escaped = escapeRegExp(q);
  if (!escaped) return <>{text}</>;
  
  const re = new RegExp(`(${escaped})`, 'ig');
  const parts = base.split(re);
  let idx = 0;
  const out: React.ReactNode[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const start = base.indexOf(part, idx);
    const end = start + part.length;
    if (i % 2 === 1) {
      out.push(<mark key={i} className="bg-yellow-200 text-black">{text.slice(start, end)}</mark>);
    } else {
      out.push(<span key={i}>{text.slice(start, end)}</span>);
    }
    idx = end;
  }
  return <>{out}</>;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchState, setSearchState] = useState<{
    loading: boolean;
    results: SearchResult[];
    categories: Category[];
    totalResults: number;
    didYouMean: string | null;
    hasSearched: boolean;
  }>({
    loading: false,
    results: [],
    categories: [],
    totalResults: 0,
    didYouMean: null,
    hasSearched: false
  });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const statusId = useId();

  // Request control + cache
  const abortRef = useRef<AbortController | null>(null);
  const lastRequestId = useRef(0);
  const cacheRef = useRef<Map<string, { ts: number; data: InstantPayload }>>(new Map());

  // Load recent searches and fetch random products on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
    void fetchRandomProducts();
  }, []);

  // Fetch random products for popular searches
  const fetchRandomProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=50', { cache: 'no-store' });
      if (response.ok) {
        const products = await response.json();
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 5);
        const productNames = randomProducts.map((p: any) =>
          p.name.length > 30 ? `${p.name.substring(0, 30)}...` : p.name
        );
        setPopularSearches(productNames);
      } else {
        setPopularSearches(['CNC maró', 'ultrahang', 'prések', 'lézerek', 'elektronika']);
      }
    } catch {
      setPopularSearches(['CNC maró', 'ultrahang', 'prések', 'lézerek', 'elektronika']);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global shortcut: "/" or Ctrl/Cmd+K to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isModK = e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey);
      if (isModK || (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey)) {
        const el = document.activeElement as HTMLElement | null;
        const tag = el?.tagName ?? '';
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
          e.preventDefault();
          inputRef.current?.focus();
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Body scroll-lock when dropdown is open (mobile-only)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

    if (isOpen && isMobile) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.paddingRight = prevPaddingRight || '';
    }

    return () => {
      document.body.style.overflow = prevOverflow || '';
      document.body.style.paddingRight = prevPaddingRight || '';
    };
  }, [isOpen]);

  // Improved search function with better state management
  const performSearch = useCallback(async (searchQuery: string) => {
    const qRaw = searchQuery.trim();
    
    if (qRaw.length < MIN_QUERY_LENGTH) {
      setSearchState({
        loading: false,
        results: [],
        categories: [],
        totalResults: 0,
        didYouMean: null,
        hasSearched: false
      });
      return;
    }

    // Set loading state immediately
    setSearchState(prev => ({ ...prev, loading: true, hasSearched: true }));

    const nowMs = Date.now();

    // Helper functions
    const strip = (s: string) => {
      const n = s.normalize('NFD');
      let out = '';
      for (let i = 0; i < n.length; i++) {
        const code = n.charCodeAt(i);
        if (code < 0x300 || code > 0x36f) out += n[i];
      }
      return out;
    };

    const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

    const replaceAllCI = (src: string, find: string, repl: string) => {
      let out = src;
      const f = find.toLowerCase();
      let pos = out.toLowerCase().indexOf(f);
      while (pos !== -1) {
        out = out.slice(0, pos) + repl + out.slice(pos + find.length);
        pos = out.toLowerCase().indexOf(f, pos + repl.length);
      }
      return out;
    };

    const readNumberBefore = (text: string, unit: string) => {
      const low = text.toLowerCase();
      const idx = low.indexOf(unit);
      if (idx === -1) return null;
      let i = idx - 1;
      while (i >= 0 && low[i] === ' ') i--;
      let j = i;
      const digits = '0123456789.,';
      while (j >= 0 && digits.indexOf(low[j]) !== -1) j--;
      const numStr = low.slice(j + 1, i + 1);
      if (!numStr) return null;
      const before = text.slice(0, j + 1);
      const after = text.slice(idx + unit.length);
      const val = parseFloat(numStr.replace(',', '.'));
      if (Number.isNaN(val)) return null;
      return { before, after, val };
    };

    const buildAlternates = (q: string) => {
      const vars: string[] = [];
      vars.push(q);
      const noAcc = strip(q);
      if (noAcc !== q) vars.push(noAcc);
      vars.push(q.split('×').join('x'));
      vars.push(q.split('x').join('×'));
      
      let syn = q;
      syn = replaceAllCI(syn, 'lezer', 'lézer');
      syn = replaceAllCI(syn, 'laser', 'lézer');
      syn = replaceAllCI(syn, 'heat press', 'hőprés');
      syn = replaceAllCI(syn, 'hot press', 'hőprés');
      syn = replaceAllCI(syn, 'press', 'prés');
      syn = replaceAllCI(syn, 'router', 'maró');
      syn = replaceAllCI(syn, 'ultrasonic', 'ultrahang');
      syn = replaceAllCI(syn, 'compressor', 'kompresszor');
      if (syn !== q) vars.push(syn);

      // Unit conversions
      const psi = readNumberBefore(q, 'psi');
      if (psi) {
        const bar = Math.round(psi.val * 0.0689476);
        const mpa = Math.round(psi.val / 145.0377377);
        vars.push(`${psi.before}${bar} bar${psi.after}`.trim());
        vars.push(`${psi.before}${mpa} mpa${psi.after}`.trim());
      } else {
        const bar = readNumberBefore(q, 'bar');
        if (bar) {
          const psiVal = Math.round(bar.val * 14.5037738);
          const mpa = Math.round(bar.val / 10);
          vars.push(`${bar.before}${psiVal} psi${bar.after}`.trim());
          vars.push(`${bar.before}${mpa} mpa${bar.after}`.trim());
        } else {
          const mpa = readNumberBefore(q, 'mpa');
          if (mpa) {
            const barVal = Math.round(mpa.val * 10);
            const psiVal = Math.round(mpa.val * 145.0377377);
            vars.push(`${mpa.before}${barVal} bar${mpa.after}`.trim());
            vars.push(`${mpa.before}${psiVal} psi${mpa.after}`.trim());
          }
        }
      }

      const mm = readNumberBefore(q, 'mm');
      if (mm) {
        const cm = mm.val / 10;
        const inch = mm.val / 25.4;
        vars.push(`${mm.before}${cm % 1 === 0 ? cm : cm.toFixed(1)} cm${mm.after}`.trim());
        vars.push(`${mm.before}${inch % 1 === 0 ? inch : inch.toFixed(2)} inch${mm.after}`.trim());
      } else {
        const inch = readNumberBefore(q, 'inch') || readNumberBefore(q, ' in');
        if (inch) {
          const mmVal = Math.round(inch.val * 25.4);
          const cm = (inch.val * 25.4) / 10;
          vars.push(`${inch.before}${mmVal} mm${inch.after}`.trim());
          vars.push(`${inch.before}${cm % 1 === 0 ? cm : cm.toFixed(1)} cm${inch.after}`.trim());
        } else {
          const cm = readNumberBefore(q, 'cm');
          if (cm) {
            const mmVal = Math.round(cm.val * 10);
            const inchVal = (cm.val * 10) / 25.4;
            vars.push(`${cm.before}${mmVal} mm${cm.after}`.trim());
            vars.push(`${cm.before}${inchVal % 1 === 0 ? inchVal : inchVal.toFixed(2)} inch${cm.after}`.trim());
          }
        }
      }

      return uniq(vars).slice(0, 6);
    };

    const doFetch = async (q: string): Promise<InstantPayload | null> => {
      const hit = cacheRef.current.get(q);
      if (hit && nowMs - hit.ts < CACHE_TTL_MS) return hit.data;

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const reqId = ++lastRequestId.current;
      
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&instant=true&limit=5`, { 
          signal: controller.signal, 
          cache: 'no-store' 
        });
        const data: Partial<InstantPayload> = res.ok ? await res.json() : {};
        if (reqId !== lastRequestId.current) return null;
        
        const payload: InstantPayload = {
          products: data.products || [],
          categories: data.categories || [],
          totalResults: data.totalResults ?? (data.products?.length || 0)
        };
        
        cacheRef.current.set(q, { ts: Date.now(), data: payload });
        return payload;
      } catch (e: any) {
        if (e?.name === 'AbortError') return null;
        console.error('Search error:', e);
        return null;
      }
    };

    let payload = await doFetch(qRaw);
    let didYouMean: string | null = null;
    
    if (payload && payload.products.length === 0 && payload.categories.length === 0) {
      const alts = buildAlternates(qRaw).filter(v => v.toLowerCase() !== qRaw.toLowerCase());
      for (const alt of alts.slice(0, 2)) {
        const p2 = await doFetch(alt);
        if (p2 && (p2.products.length > 0 || p2.categories.length > 0)) {
          payload = p2;
          didYouMean = alt;
          break;
        }
      }
    }

    // Update state in one batch
    setSearchState({
      loading: false,
      results: payload ? [...payload.products].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0)) : [],
      categories: payload?.categories || [],
      totalResults: payload?.totalResults || 0,
      didYouMean,
      hasSearched: true
    });
  }, []);

  // Memoized debounced search function
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      setIsOpen(true);
      debouncedSearch(value);
    } else {
      setIsOpen(true);
      setSearchState({
        loading: false,
        results: [],
        categories: [],
        totalResults: 0,
        didYouMean: null,
        hasSearched: false
      });
    }
  };

  // Submit helpers
  const goToSearchPage = (q: string) => {
    saveRecentSearch(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) goToSearchPage(query.trim());
  };

  const totalItems = searchState.categories.length + searchState.results.length;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && ['ArrowDown', 'ArrowUp'].includes(e.key)) setIsOpen(true);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(totalItems > 0 ? 0 : -1);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(totalItems > 0 ? totalItems - 1 : -1);
        break;
      case 'Enter': {
        if (selectedIndex >= 0) {
          e.preventDefault();
          if (selectedIndex < searchState.categories.length) {
            const category = searchState.categories[selectedIndex];
            router.push(`/category/${category.slug}`);
          } else {
            const product = searchState.results[selectedIndex - searchState.categories.length];
            const productUrl =
              product.category?.slug && product.slug
                ? `/${product.category.slug}/${product.slug}`
                : `/products/${product.id}`;
            router.push(productUrl);
          }
          setIsOpen(false);
          inputRef.current?.blur();
        } else if (query.trim()) {
          goToSearchPage(query.trim());
        }
        break;
      }
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Suggestion click
  const handleSuggestionClick = (searchTerm: string) => {
    setQuery(searchTerm);
    goToSearchPage(searchTerm);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchState({
      loading: false,
      results: [],
      categories: [],
      totalResults: 0,
      didYouMean: null,
      hasSearched: false
    });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const activeId = selectedIndex >= 0 ? `sb-opt-${selectedIndex}` : undefined;
  const getGlobalIndex = (i: number, isCategory: boolean) => (isCategory ? i : searchState.categories.length + i);
  const prefetch = (href: string) => {
    try { router.prefetch(href); } catch {}
  };

  return (
    <div ref={searchRef} className="relative w-full search-bar-container">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          id={`search-${listboxId}`}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Mit keres? Pl. CNC maró, ultrahang, hőprés..."
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus-visible:ring-1 focus-visible:ring-[#131921] focus-visible:border-[#131921] text-black bg-white placeholder:text-sm placeholder:text-gray-400"
          aria-label="Termék keresőmező"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-describedby={statusId}
          aria-busy={searchState.loading}
        />

        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 h-full py-1">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Keresés törlése"
            >
              <X size={20} />
            </button>
          )}

          <button
            type="submit"
            className="text-gray-600 hover:text-gray-900 transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={searchState.loading ? 'Keresés folyamatban' : 'Keresés'}
          >
            {searchState.loading ? <Loader2 size={22} className="animate-spin" /> : <Search size={22} />}
          </button>
        </div>
      </form>

      {/* Screen reader status */}
      <div id={statusId} role="status" aria-live="polite" className="sr-only">
        {searchState.loading
          ? 'Keresés folyamatban...'
          : isOpen && query && (searchState.results.length > 0 || searchState.categories.length > 0)
            ? `Találatok: ${searchState.categories.length} kategória és ${searchState.results.length} termék`
            : isOpen && query && !searchState.loading && searchState.hasSearched && searchState.results.length === 0 && searchState.categories.length === 0
              ? `Nincs találat erre: ${query}`
              : ''}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <>
          <div className="search-backdrop-overlay" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 max-h-[500px] overflow-hidden search-dropdown">
            <div className="overflow-y-auto max-h-[500px] bg-white search-results-scroll" id={listboxId} role="listbox" aria-busy={searchState.loading}>
              {/* Categories Section */}
              {searchState.categories.length > 0 && (
                <div className="border-b border-gray-100 bg-white">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase" role="presentation">
                    Kategóriák
                  </div>
                  <ul className="divide-y divide-gray-50" role="presentation">
                    {searchState.categories.map((category, i) => {
                      const gi = getGlobalIndex(i, true);
                      const id = `sb-opt-${gi}`;
                      return (
                        <li
                          key={category.id}
                          id={id}
                          role="option"
                          aria-selected={selectedIndex === gi}
                          className={`px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIndex === gi ? 'bg-gray-50' : ''}`}
                          onMouseEnter={() => setSelectedIndex(gi)}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/category/${category.slug}`);
                          }}
                          onMouseOver={() => prefetch(`/category/${category.slug}`)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                              <HighlightMatch text={category.name} query={query} />
                            </span>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Did you mean */}
              {searchState.didYouMean && searchState.didYouMean.toLowerCase() !== query.trim().toLowerCase() && (
                <div className="px-4 py-2 text-xs text-gray-600">
                  Ezt kereste:{' '}
                  <button onClick={() => handleSuggestionClick(searchState.didYouMean!)} className="underline text-[#131921]">
                    „{searchState.didYouMean}"
                  </button>?
                </div>
              )}

              {/* Loading skeleton */}
              {searchState.loading && query && searchState.results.length === 0 && searchState.categories.length === 0 && (
                <div className="px-4 py-3 space-y-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Products Section */}
              {searchState.results.length > 0 && (
                <div className="border-b border-gray-100 bg-white">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase" role="presentation">
                    Termékek
                  </div>
                  <ul className="divide-y divide-gray-50" role="presentation">
                    {searchState.results.map((product, i) => {
                      const gi = getGlobalIndex(i, false);
                      const id = `sb-opt-${gi}`;
                      const productUrl =
                        product.category?.slug && product.slug
                          ? `/${product.category.slug}/${product.slug}`
                          : `/products/${product.id}`;
                      const discount = product.regularPrice
                        ? calculateDiscount(product.price, product.regularPrice)
                        : 0;

                      return (
                        <li
                          key={product.id}
                          id={id}
                          role="option"
                          aria-selected={selectedIndex === gi}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIndex === gi ? 'bg-gray-50' : ''}`}
                          onMouseEnter={() => setSelectedIndex(gi)}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setIsOpen(false);
                            router.push(productUrl);
                          }}
                          onMouseOver={() => prefetch(productUrl)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  loading="lazy"
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  <Search size={20} className="text-gray-400" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-900 font-medium truncate">
                                <HighlightMatch text={product.name} query={query} />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {discount > 0 ? (
                                  <>
                                    <span className="text-sm font-semibold text-red-600">
                                      {formatPrice(product.price)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatPrice(product.regularPrice!)}
                                    </span>
                                    <span className="text-xs text-red-600 font-medium">-{discount}%</span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold text-gray-900">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                                {product.stock === 0 ? (
                                  <>
                                    <span className="text-xs text-red-500">Elfogyott</span>
                                    <button
                                      className="text-xs text-blue-600 underline"
                                      onClick={(e) => { e.preventDefault(); router.push(`${productUrl}?notify=1`); }}
                                    >
                                      Értesítsen, ha elérhető
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* View all */}
              {query && searchState.totalResults > 5 && (
                <button
                  onMouseOver={() => prefetch(`/search?q=${encodeURIComponent(query)}`)}
                  onClick={() => {
                    setIsOpen(false);
                    goToSearchPage(query);
                  }}
                  className="w-full px-4 py-3 text-center text-sm text-[#131921] hover:bg-gray-50 transition-colors"
                  role="option"
                  aria-selected={false}
                >
                  Összes találat megtekintése ({searchState.totalResults})
                </button>
              )}

              {/* No results - Only show after search has completed */}
              {query && !searchState.loading && searchState.hasSearched && searchState.results.length === 0 && searchState.categories.length === 0 && (
                <div className="px-4 py-8 text-center bg-white">
                  <Search size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">
                    Nem találtunk eredményt a következőre: "{query}"
                  </p>
                </div>
              )}

              {/* Recent & Popular */}
              {!query && !searchState.loading && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="border-b border-gray-100 bg-white">
                      <div className="px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Legutóbbi keresések</span>
                        <button
                          onClick={() => {
                            clearRecentSearches();
                            setRecentSearches([]);
                          }}
                          className="text-xs text-gray-400 hover:text-gray-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Keresési előzmények törlése"
                        >
                          Törlés
                        </button>
                      </div>
                      <ul role="presentation">
                        {recentSearches.map((s, i) => {
                          const gi = i;
                          const id = `sb-opt-${gi}`;
                          return (
                            <li key={s}>
                              <button
                                id={id}
                                role="option"
                                aria-selected={selectedIndex === gi}
                                onMouseEnter={() => setSelectedIndex(gi)}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => handleSuggestionClick(s)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 min-h-[44px]"
                              >
                                <Clock size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-700">{s}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {popularSearches.length > 0 && (
                    <div className="bg-white">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase" role="presentation">
                        Népszerű keresések
                      </div>
                      <ul role="presentation">
                        {popularSearches.map((s, i) => (
                          <li key={`${s}-${i}`}>
                            <button
                              role="option"
                              aria-selected={false}
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => handleSuggestionClick(s)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 min-h-[44px]"
                            >
                              <TrendingUp size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-700">{s}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}