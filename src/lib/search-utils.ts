// Improved debounce with proper cleanup and typing
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, wait);
  }) as T;
  
  // Add cancel method for cleanup
  (debounced as any).cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced as T & { cancel: () => void };
}

// --- Recent searches (persisted) ---
const KEY = 'recent_searches_v1';
const MAX = 5;

// Cache storage availability check
let storageAvailable: boolean | null = null;

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  
  // Use cached result if available
  if (storageAvailable !== null) {
    return storageAvailable ? window.localStorage : null;
  }
  
  try {
    // Test write access
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
    return window.localStorage;
  } catch {
    storageAvailable = false;
    return null;
  }
}

// In-memory fallback for when localStorage is unavailable
let memoryFallback: string[] = [];

export function getRecentSearches(): string[] {
  const ls = safeStorage();
  if (!ls) return memoryFallback;
  
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    // Validate that it's an array of strings
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(q: string): void {
  const query = q.trim();
  if (!query || query.length < 2) return;
  
  const ls = safeStorage();
  if (!ls) {
    // Update memory fallback
    memoryFallback = [
      query,
      ...memoryFallback.filter(s => s.toLowerCase() !== query.toLowerCase())
    ].slice(0, MAX);
    return;
  }
  
  try {
    const existing = getRecentSearches().filter(
      s => s.toLowerCase() !== query.toLowerCase()
    );
    const next = [query, ...existing].slice(0, MAX);
    ls.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    // Handle quota exceeded error
    console.warn('Failed to save recent search:', e);
    // Fall back to memory storage
    memoryFallback = [
      query,
      ...memoryFallback.filter(s => s.toLowerCase() !== query.toLowerCase())
    ].slice(0, MAX);
  }
}

export function clearRecentSearches(): void {
  const ls = safeStorage();
  memoryFallback = [];
  
  if (!ls) return;
  
  try {
    ls.removeItem(KEY);
  } catch (e) {
    console.warn('Failed to clear recent searches:', e);
  }
}

// Additional utility for migrating old search history formats
export function migrateSearchHistory(): void {
  const ls = safeStorage();
  if (!ls) return;
  
  try {
    // Check for old format keys and migrate if needed
    const oldKey = 'recentSearches';
    const oldData = ls.getItem(oldKey);
    
    if (oldData && !ls.getItem(KEY)) {
      // Migrate old data
      ls.setItem(KEY, oldData);
      ls.removeItem(oldKey);
    }
  } catch {
    // Silent fail - migration is not critical
  }
}