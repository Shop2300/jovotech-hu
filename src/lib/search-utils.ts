// Debounce with proper browser timeout typing
export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

// --- Recent searches (persisted) ---
const KEY = 'recent_searches_v1';
const MAX = 5;

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    // Test write access
    window.localStorage.setItem('__t', '1');
    window.localStorage.removeItem('__t');
    return window.localStorage;
  } catch {
    return null;
  }
}

let memoryFallback: string[] = [];

export function getRecentSearches(): string[] {
  const ls = safeStorage();
  if (!ls) return memoryFallback;
  try {
    const raw = ls.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(q: string): void {
  const query = q.trim();
  if (!query) return;

  const ls = safeStorage();
  if (!ls) {
    memoryFallback = [query, ...memoryFallback.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, MAX);
    return;
  }

  const existing = getRecentSearches().filter(s => s.toLowerCase() !== query.toLowerCase());
  const next = [query, ...existing].slice(0, MAX);
  try {
    ls.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
}

export function clearRecentSearches(): void {
  const ls = safeStorage();
  if (!ls) {
    memoryFallback = [];
    return;
  }
  try {
    ls.removeItem(KEY);
  } catch {
    // ignore
  }
}
