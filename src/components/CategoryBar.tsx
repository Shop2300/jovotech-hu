// src/components/CategoryBar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
const { createPortal } = ReactDOM;
import { ChevronDown, FolderOpen } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  children?: Category[];
}

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  targetRef: React.RefObject<HTMLElement>;
}

function DropdownPortal({ children, isOpen, targetRef }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
        setIsPositioned(true);
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    } else {
      setIsPositioned(false);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetRef, isOpen]);

  if (!mounted || !isOpen || !isPositioned) return null;

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 150ms ease-in-out'
      }}
    >
      {children}
    </div>,
    document.body
  );
}

export function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Build hierarchy
          const hierarchical = buildHierarchy(data);
          setCategories(hierarchical);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (categoryId: string) => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    // Add a small delay to prevent flickering when moving between button and dropdown
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 50);
  };

  const buildHierarchy = (cats: any[]): Category[] => {
    const categoryMap: { [key: string]: Category } = {};
    const rootCategories: Category[] = [];

    // First pass: create all categories
    cats.forEach(cat => {
      categoryMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        children: []
      };
    });

    // Second pass: build hierarchy
    cats.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children!.push(categoryMap[cat.id]);
      } else if (!cat.parentId) {
        rootCategories.push(categoryMap[cat.id]);
      }
    });

    return rootCategories;
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6">
        <nav className="flex items-center gap-4 py-2 overflow-x-auto">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="relative"
              onMouseEnter={() => {
                if (category.children && category.children.length > 0) {
                  handleMouseEnter(category.id);
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              {category.children && category.children.length > 0 ? (
                <>
                  <Link
                    ref={(el) => { buttonRefs.current[category.id] = el; }}
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 group whitespace-nowrap"
                  >
                    {category.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === category.id ? 'rotate-180' : ''} group-hover:text-gray-900`} />
                  </Link>

                  <DropdownPortal
                    isOpen={openDropdown === category.id}
                    targetRef={{ current: buttonRefs.current[category.id] } as React.RefObject<HTMLElement>}
                  >
                    <div 
                      className="dropdown-content mt-2 bg-white rounded-lg shadow-2xl border border-gray-200"
                      style={{ 
                        width: 'max-content',
                        minWidth: '700px',
                        maxWidth: '1000px'
                      }}
                      onMouseEnter={() => {
                        if (timeoutRef.current) {
                          clearTimeout(timeoutRef.current);
                        }
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-8">
                        <Link
                          href={`/category/${category.slug}`}
                          className="inline-block mb-6 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-150"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span>Zobrazit vše v kategorii {category.name} →</span>
                        </Link>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
                          {category.children.map((subcat) => (
                            <Link
                              key={subcat.id}
                              href={`/category/${subcat.slug}`}
                              className="group flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 min-w-[120px]"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <div className="relative w-12 h-12 mb-3 overflow-hidden rounded-lg bg-gray-100 group-hover:shadow-md transition-shadow">
                                {subcat.image ? (
                                  <img
                                    src={subcat.image}
                                    alt={subcat.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FolderOpen size={20} />
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-center text-gray-700 group-hover:text-gray-900 font-bold px-2 leading-tight min-h-[2.5rem] flex items-center">
                                {subcat.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DropdownPortal>
                </>
              ) : (
                <Link
                  href={`/category/${category.slug}`}
                  className="block px-4 py-3 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  {category.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}