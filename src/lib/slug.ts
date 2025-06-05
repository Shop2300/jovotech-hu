// src/lib/slug.ts
export function createSlug(text: string): string {
  if (!text) return '';
  
  // Map of special characters to their replacements
  const charMap: { [key: string]: string } = {
    // Polish
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z',
    // Czech
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
    'í': 'i', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't',
    'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
    'Á': 'a', 'Č': 'c', 'Ď': 'd', 'É': 'e', 'Ě': 'e',
    'Í': 'i', 'Ň': 'n', 'Ř': 'r', 'Š': 's', 'Ť': 't',
    'Ú': 'u', 'Ů': 'u', 'Ý': 'y', 'Ž': 'z'
  };
  
  // Replace special characters
  let slug = text;
  for (const [char, replacement] of Object.entries(charMap)) {
    slug = slug.replace(new RegExp(char, 'g'), replacement);
  }
  
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove remaining diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')             // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');        // Remove leading/trailing hyphens
}