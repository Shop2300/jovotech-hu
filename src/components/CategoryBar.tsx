// src/components/CategoryBar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import ReactDOM from 'react-dom';
const { createPortal } = ReactDOM;
import { ChevronDown, FolderOpen, Menu, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  children?: Category[];
}

interface CategoryBarProps {
  initialCategories?: Category[];
}

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  targetRef: React.RefObject<HTMLElement>;
  fullWidth?: boolean;
}

function DropdownPortal({ children, isOpen, targetRef, fullWidth = false }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        
        if (fullWidth) {
          // Get the website container width for full-width dropdowns
          const websiteContainer = document.querySelector('.max-w-screen-2xl');
          const containerRect = websiteContainer?.getBoundingClientRect();
          
          setPosition({
            top: rect.bottom + window.scrollY,
            left: containerRect ? containerRect.left + window.scrollX : 0,
            width: containerRect ? containerRect.width : window.innerWidth
          });
        } else {
          // Regular dropdown positioning
          setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: 0
          });
        }
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
  }, [targetRef, isOpen, fullWidth]);

  if (!mounted || !isOpen || !isPositioned) return null;

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        ...(fullWidth && { width: `${position.width}px` }),
        zIndex: 9999,
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 100ms ease-in-out'
      }}
    >
      {children}
    </div>,
    document.body
  );
}

export const CategoryBar = memo(function CategoryBar({ initialCategories = [] }: CategoryBarProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const buttonRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      setOpenDropdown(null);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Calculate which categories fit in the available space (desktop only)
  const calculateVisibleCategories = useCallback(() => {
    if (isMobile || !navRef.current || !containerRef.current || categories.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const moreButtonWidth = 120;
    const availableWidth = containerWidth - moreButtonWidth - 48;

    let totalWidth = 0;
    const visible: string[] = [];

    const categoryElements = navRef.current.querySelectorAll('[data-category-id]');
    
    for (let i = 0; i < categoryElements.length; i++) {
      const element = categoryElements[i] as HTMLElement;
      const categoryId = element.getAttribute('data-category-id');
      if (!categoryId) continue;

      const elementWidth = element.offsetWidth + 16;
      
      if (totalWidth + elementWidth <= availableWidth) {
        totalWidth += elementWidth;
        visible.push(categoryId);
      } else {
        break;
      }
    }

    if (visible.length < categories.length && visible.length > 0) {
      setVisibleCategories(visible);
      setShowMoreMenu(true);
    } else {
      setVisibleCategories(categories.map(c => c.id));
      setShowMoreMenu(false);
    }
  }, [categories, isMobile]);

  // Only fetch categories if not provided from server
  useEffect(() => {
    if (initialCategories.length > 0) return;

    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          const hierarchical = buildHierarchy(data);
          setCategories(hierarchical);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, [initialCategories]);

  // Set up ResizeObserver for desktop
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleCategories();
    });

    resizeObserver.observe(containerRef.current);

    requestAnimationFrame(() => {
      calculateVisibleCategories();
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateVisibleCategories, isMobile]);

  const handleMouseEnter = (categoryId: string) => {
    if (!isMobile) {
      setOpenDropdown(categoryId);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpenDropdown(null);
    }
  };

  const buildHierarchy = (cats: any[]): Category[] => {
    const categoryMap: { [key: string]: Category } = {};
    const rootCategories: Category[] = [];

    cats.forEach(cat => {
      categoryMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        children: []
      };
    });

    cats.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children!.push(categoryMap[cat.id]);
      } else if (!cat.parentId) {
        rootCategories.push(categoryMap[cat.id]);
      }
    });

    return rootCategories;
  };

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  const hiddenCategories = categories.filter(cat => !visibleCategories.includes(cat.id));

  // Mobile menu component
  const MobileMenu = () => (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      <div className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Kategorie</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="py-4">
          {categories.map((category) => (
            <div key={category.id} className="border-b last:border-b-0">
              {category.children && category.children.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleDropdown(category.id)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left font-medium touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    <span>{category.name}</span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${
                        openDropdown === category.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {openDropdown === category.id && (
                    <div className="bg-gray-50 py-2">
                      <Link
                        href={`/category/${category.slug}`}
                        className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Pokaż wszystko
                      </Link>
                      {category.children.map((subcat) => (
                        <Link
                          key={subcat.id}
                          href={`/category/${subcat.slug}`}
                          className="block px-6 py-3 text-sm hover:bg-gray-100 touch-manipulation"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subcat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={`/category/${category.slug}`}
                  className="block px-4 py-4 font-medium hover:bg-gray-50 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ minHeight: '48px' }}
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

  const renderCategoryItem = (category: Category, isInMoreMenu: boolean = false) => {
    const hasChildren = category.children && category.children.length > 0;
    
    if (hasChildren && !isInMoreMenu) {
      return (
        <div 
          key={category.id}
          data-category-id={category.id}
          className="relative inline-block"
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            ref={(el) => { buttonRefs.current[category.id] = el; }}
            href={`/category/${category.slug}`}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-[#131921] hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-100 group whitespace-nowrap"
          >
            {category.name}
            <ChevronDown className={`w-4 h-4 transition-transform duration-100 ${openDropdown === category.id ? 'rotate-180' : ''} group-hover:text-gray-900`} />
          </Link>

          <DropdownPortal
            isOpen={openDropdown === category.id}
            targetRef={{ current: buttonRefs.current[category.id] } as React.RefObject<HTMLElement>}
            fullWidth={true}
          >
            <div 
              className="dropdown-content mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 w-full"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-6 py-8">
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-block mb-6 px-4 py-2 text-sm font-medium text-[#131921] hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-150"
                  onClick={() => setOpenDropdown(null)}
                >
                  <span>Pokaż wszystko w kategorii {category.name} →</span>
                </Link>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6">
                  {category.children?.map((subcat) => (
                    <Link
                      key={subcat.id}
                      href={`/category/${subcat.slug}`}
                      className="group flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <div className="relative w-12 h-12 mb-3 overflow-hidden rounded-lg bg-gray-100 group-hover:shadow-md transition-shadow">
                        {subcat.image ? (
                          <img
                            src={subcat.image}
                            alt={subcat.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FolderOpen size={20} />
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-center text-[#131921] group-hover:text-gray-900 font-bold px-2 leading-tight min-h-[2.5rem] flex items-center">
                        {subcat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </DropdownPortal>
        </div>
      );
    }

    // Simple category link (no children or in more menu)
    return (
      <Link
        key={category.id}
        data-category-id={category.id}
        href={`/category/${category.slug}`}
        className="inline-block px-4 py-3 text-sm font-bold text-[#131921] hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-100 whitespace-nowrap"
        onClick={() => setOpenDropdown(null)}
      >
        {category.name}
      </Link>
    );
  };

  if (isMobile) {
    return (
      <>
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-screen-2xl mx-auto px-4 py-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#131921] hover:bg-gray-100 rounded-lg touch-manipulation w-full"
              style={{ minHeight: '48px' }}
            >
              <Menu size={20} />
              <span>Kategorie</span>
            </button>
          </div>
        </div>
        {mobileMenuOpen && <MobileMenu />}
      </>
    );
  }

  // Desktop view
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6" ref={containerRef}>
        <nav className="flex items-center gap-4 py-2 min-h-[52px]" ref={navRef}>
          {/* Visible categories */}
          {categories.map((category) => {
            if (!showMoreMenu || visibleCategories.includes(category.id)) {
              return renderCategoryItem(category);
            }
            return null;
          })}
          
          {/* More menu button */}
          {showMoreMenu && hiddenCategories.length > 0 && (
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('more-menu')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                ref={moreButtonRef}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-[#131921] hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-100 group whitespace-nowrap"
              >
                <Menu className="w-4 h-4" />
                Więcej
                <ChevronDown className={`w-4 h-4 transition-transform duration-100 ${openDropdown === 'more-menu' ? 'rotate-180' : ''} group-hover:text-gray-900`} />
              </button>

              <DropdownPortal
                isOpen={openDropdown === 'more-menu'}
                targetRef={moreButtonRef as React.RefObject<HTMLElement>}
              >
                <div 
                  className="dropdown-content mt-2 bg-white rounded-lg shadow-2xl border border-gray-100"
                  style={{ 
                    width: 'max-content',
                    minWidth: '250px'
                  }}
                  onMouseEnter={() => handleMouseEnter('more-menu')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2">
                    {hiddenCategories.map((category) => (
                      <div key={category.id} className="relative">
                        {category.children && category.children.length > 0 ? (
                          <>
                            <Link
                              href={`/category/${category.slug}`}
                              className="flex items-center justify-between px-4 py-2 text-sm font-bold text-[#131921] hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {category.name}
                              <ChevronDown className="w-4 h-4 rotate-[-90deg] ml-2" />
                            </Link>
                            <div className="pl-4 border-l ml-4">
                              {category.children?.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/category/${subcat.slug}`}
                                  className="block px-4 py-2 text-sm text-[#131921]/70 hover:bg-gray-100 hover:text-[#131921] transition-colors duration-150"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {subcat.name}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={`/category/${category.slug}`}
                            className="block px-4 py-2 text-sm font-bold text-[#131921] hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {category.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownPortal>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
});