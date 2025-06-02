// src/lib/search-utils.ts

// In-memory storage for recent searches (per session)
let recentSearchesMemory: string[] = [];

/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Highlight matching text in search results
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-black">$1</mark>');
}

/**
 * Get recent searches from memory
 */
export function getRecentSearches(): string[] {
  return recentSearchesMemory;
}

/**
 * Save search to recent searches in memory
 */
export function saveRecentSearch(query: string): void {
  if (!query.trim()) return;
  
  // Remove duplicate if exists
  recentSearchesMemory = recentSearchesMemory.filter(
    s => s.toLowerCase() !== query.toLowerCase()
  );
  
  // Add to beginning and keep only 5 most recent
  recentSearchesMemory = [query, ...recentSearchesMemory].slice(0, 5);
}

/**
 * Clear recent searches from memory
 */
export function clearRecentSearches(): void {
  recentSearchesMemory = [];
}