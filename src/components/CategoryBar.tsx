'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import ReactDOM from 'react-dom';
const { createPortal } = ReactDOM;
import { ChevronDown, ChevronRight, FolderOpen, Menu, X, Grid3X3 } from 'lucide-react';

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
          const websiteContainer = document.querySelector('.max-w-screen-2xl');
          const containerRect = websiteContainer?.getBoundingClientRect();
          
          setPosition({
            top: rect.bottom + window.scrollY,
            left: containerRect ? containerRect.left + window.scrollX : 0,
            width: containerRect ? containerRect.width : window.innerWidth
          });
        } else {
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
        transition: 'opacity 150ms ease-in-out'
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

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      setOpenDropdown(null);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

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

  const MobileMenu = () => (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      <div className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl overflow-y-auto">
        <div className="bg-gradient-to-r from-[#8bc34a] to-[#7cb342] text-white p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 size={24} />
              <h2 className="text-lg font-bold">Kategóriák</h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <nav className="py-2">
          {categories.map((category) => (
            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
              {category.children && category.children.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleDropdown(category.id)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left font-medium hover:bg-gray-50 transition-colors touch-manipulation"
                    style={{ minHeight: '52px' }}
                    aria-expanded={openDropdown === category.id}
                    aria-controls={`mobile-sub-${category.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FolderOpen size={20} className="text-gray-400" />
                        </div>
                      )}
                      <span className="text-[#131921]">{category.name}</span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        openDropdown === category.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {openDropdown === category.id && (
                    <div id={`mobile-sub-${category.id}`} className="bg-gray-50 py-2 px-4">
                      <Link
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#8bc34a] font-medium hover:bg-white rounded-lg transition-colors touch-manipulation focus:ring-2 focus:ring-[#8bc34a]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ChevronRight size={16} />
                        Összes mutatása
                      </Link>
                      {category.children.map((subcat) => (
                        <Link
                          key={subcat.id}
                          href={`/category/${subcat.slug}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors touch-manipulation focus:ring-2 focus:ring-[#8bc34a]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subcat.image ? (
                            <img 
                              src={subcat.image} 
                              alt={subcat.name}
                              className="w-6 h-6 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FolderOpen size={16} className="text-gray-400" />
                            </div>
                          )}
                          <span>{subcat.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-3 px-4 py-4 font-medium hover:bg-gray-50 transition-colors touch-manipulation focus:ring-2 focus:ring-[#8bc34a]"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ minHeight: '52px' }}
                >
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FolderOpen size={20} className="text-gray-400" />
                    </div>
                  )}
                  <span className="text-[#131921]">{category.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
        
        <div className="p-4 mt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {categories.length} kategória
          </p>
        </div>
      </div>
    </div>
  );

  const renderCategoryItem = (category: Category, isInMoreMenu: boolean = false) => {
    const hasChildren = category.children && category.children.length > 0;
    
    const categoryLink = (
      <Link
        ref={(el) => { if (!isInMoreMenu) buttonRefs.current[category.id] = el; }}
        href={`/category/${category.slug}`}
        className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#131921] hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-150 group whitespace-nowrap focus:ring-2 focus:ring-[#8bc34a]"
        onClick={() => setOpenDropdown(null)}
      >
        {category.image ? (
          <img 
            src={category.image} 
            alt=""
            className="w-5 h-5 rounded object-cover"
          />
        ) : (
          <FolderOpen size={16} className="text-gray-500" />
        )}
        {category.name}
        {hasChildren && !isInMoreMenu && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${openDropdown === category.id ? 'rotate-180' : ''} group-hover:text-gray-900`} />
        )}
      </Link>
    );

    if (hasChildren && !isInMoreMenu) {
      return (
        <div 
          key={category.id}
          data-category-id={category.id}
          className="relative inline-block"
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={handleMouseLeave}
        >
          {categoryLink}

          <DropdownPortal
            isOpen={openDropdown === category.id}
            targetRef={{ current: buttonRefs.current[category.id] } as React.RefObject<HTMLElement>}
            fullWidth={true}
          >
            <div 
              className="dropdown-content mt-2 bg-white rounded-xl shadow-xl border border-gray-100 w-full overflow-hidden"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex min-h-[280px]">
                <div className="w-64 bg-gray-50 p-6 flex-shrink-0 border-r border-gray-100">
                  {category.image && (
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                  )}
                  <h3 className="text-xl font-bold text-[#131921] mb-2">{category.name}</h3>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="text-sm font-medium text-[#8bc34a] hover:text-[#7cb342] transition-colors focus:ring-2 focus:ring-[#8bc34a]"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Összes mutatása ebben a kategóriában →
                  </Link>
                </div>
                <div className="flex-1 p-6 columns-4 gap-8">
                  {category.children?.map((subcat) => (
                    <Link
                      key={subcat.id}
                      href={`/category/${subcat.slug}`}
                      className="flex items-center gap-3 mb-4 text-sm text-[#131921] hover:underline transition-all duration-150 block break-inside-avoid focus:ring-2 focus:ring-[#8bc34a]"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {subcat.image ? (
                        <img
                          src={subcat.image}
                          alt={subcat.name}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FolderOpen size={16} className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium">{subcat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </DropdownPortal>
        </div>
      );
    }

    return (
      <div key={category.id} data-category-id={category.id}>
        {categoryLink}
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-between px-4 py-3 text-sm font-medium bg-[#8bc34a] text-white hover:bg-[#7cb342] rounded-lg transition-colors touch-manipulation w-full group focus:ring-2 focus:ring-white"
              style={{ minHeight: '48px' }}
            >
              <div className="flex items-center gap-3">
                <Grid3X3 size={20} />
                <span>Kategóriák böngészése</span>
              </div>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        {mobileMenuOpen && <MobileMenu />}
      </>
    );
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6" ref={containerRef}>
        <nav className="flex items-center gap-2 py-2 min-h-[52px]" ref={navRef}>
          {categories.map((category) => {
            if (!showMoreMenu || visibleCategories.includes(category.id)) {
              return renderCategoryItem(category);
            }
            return null;
          })}
          
          {showMoreMenu && hiddenCategories.length > 0 && (
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('more-menu')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                ref={moreButtonRef}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-[#131921] hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-150 group whitespace-nowrap focus:ring-2 focus:ring-[#8bc34a]"
              >
                <Menu className="w-4 h-4" />
                Több
                <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${openDropdown === 'more-menu' ? 'rotate-180' : ''} group-hover:text-gray-900`} />
              </button>

              <DropdownPortal
                isOpen={openDropdown === 'more-menu'}
                targetRef={moreButtonRef as React.RefObject<HTMLElement>}
              >
                <div 
                  className="dropdown-content mt-2 bg-white rounded-xl shadow-xl border border-gray-100"
                  style={{ 
                    width: 'max-content',
                    minWidth: '280px'
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
                              className="flex items-center justify-between px-4 py-3 text-sm font-bold text-[#131921] hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 focus:ring-2 focus:ring-[#8bc34a]"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {category.name}
                              <ChevronDown className="w-4 h-4 rotate-[-90deg] ml-2" />
                            </Link>
                            <div className="pl-4 border-l ml-4 bg-gray-50">
                              {category.children?.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/category/${subcat.slug}`}
                                  className="block px-4 py-2 text-sm text-[#131921]/80 hover:bg-gray-100 hover:text-[#131921] hover:underline transition-all duration-150 focus:ring-2 focus:ring-[#8bc34a]"
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
                            className="block px-4 py-3 text-sm font-bold text-[#131921] hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 focus:ring-2 focus:ring-[#8bc34a]"
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