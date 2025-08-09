// src/app/[categorySlug]/[productSlug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, Package, Info, MessageCircle, Truck, RotateCcw, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';

// Lazy load heavy components
const ProductImageGallery = dynamic(
  () => import('@/components/ProductImageGallery').then(mod => ({ default: mod.ProductImageGallery })),
  { 
    loading: () => <div className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
  }
);

const RelatedProducts = dynamic(
  () => import('@/components/RelatedProducts').then(mod => ({ default: mod.RelatedProducts })),
  { 
    loading: () => <div className="h-64" />
  }
);

// Helper functions remain the same
function getNextDeliveryDate(): string {
  const now = new Date();
  const currentHour = now.getHours();
  let daysToAdd = currentHour < 13 ? 1 : 2;
  let deliveryDate = new Date(now);
  
  while (daysToAdd > 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const dayOfWeek = deliveryDate.getDay();
    
    if (dayOfWeek === 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    } else if (dayOfWeek === 6) {
      deliveryDate.setDate(deliveryDate.getDate() + 2);
    } else {
      daysToAdd--;
    }
  }
  
  const day = deliveryDate.getDate();
  const month = deliveryDate.getMonth() + 1;
  return `${day}.${month}.`;
}

function formatStockDisplay(stock: number, availability: string = 'in_stock'): string {
  if (stock === 0) {
    return 'Elfogyott';
  } else if (stock > 5) {
    return availability === 'in_stock_supplier' 
      ? 'Beszállítói raktáron: >5 DB'
      : 'Raktáron: >5 DB';
  } else {
    return availability === 'in_stock_supplier'
      ? `Beszállítói raktáron: ${stock} db`
      : `Raktáron: ${stock} db`;
  }
}

interface ProductVariant {
  id: string;
  colorName?: string | null;
  colorCode?: string | null;
  sizeName?: string | null;
  stock: number;
  price?: number | null;
  regularPrice?: number | null;
  imageUrl?: string | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    code?: string | null;
    name: string;
    slug?: string | null;
    description: string | null;
    detailDescription: string | null;
    price: number;
    regularPrice?: number | null;
    stock: number;
    image: string | null;
    brand?: string | null;
    warranty?: string | null;
    availability?: string | null;
    averageRating?: number;
    totalRatings?: number;
    images?: ProductImage[];
    variants?: ProductVariant[];
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export const ProductDetailClient = memo(function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCart((state) => state.addItem);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState({
    average: product.averageRating || 0,
    total: product.totalRatings || 0
  });
  const [showPriceGuarantee, setShowPriceGuarantee] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [addedQuantity, setAddedQuantity] = useState(1);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Memoize variant calculations
  const isRandomVariant = useMemo(() => 
    product.variants && product.variants.length > 0 && 
    product.variants.every(v => v.colorName && !v.colorCode && !v.sizeName),
    [product.variants]
  );

  const colors = useMemo(() => 
    Array.from(new Set(product.variants?.filter(v => v.colorName).map(v => v.colorName))) as string[],
    [product.variants]
  );
  
  const sizes = useMemo(() => 
    Array.from(new Set(product.variants?.filter(v => v.sizeName).map(v => v.sizeName))) as string[],
    [product.variants]
  );
  
  const hasColors = colors.length > 0 && !isRandomVariant;
  const hasSizes = sizes.length > 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const hasRandomVariants = isRandomVariant;

  // Memoized handlers
  const handleStarClick = useCallback(async (selectedRating: number) => {
    if (hasRated) {
      toast.error('Már értékelted ezt a terméket');
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: selectedRating,
          comment: '',
          authorName: 'Anonim',
          authorEmail: `anon${Date.now()}@example.com`
        }),
      });

      if (response.ok) {
        const newTotal = rating.total + 1;
        const newAverage = ((rating.average * rating.total) + selectedRating) / newTotal;
        
        setRating({
          average: newAverage,
          total: newTotal
        });
        setHasRated(true);
        localStorage.setItem(`rated_${product.id}`, 'true');
        toast.success('Köszönjük az értékelést!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Nem sikerült elmenteni az értékelést');
    }
  }, [hasRated, product.id, rating]);

  // Check if user has already rated
  useEffect(() => {
    const rated = localStorage.getItem(`rated_${product.id}`);
    if (rated) {
      setHasRated(true);
    }
  }, [product.id]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showCartPopup || showContactForm) {
      document.body.style.overflow = 'hidden';
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowCartPopup(false);
          setShowContactForm(false);
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showCartPopup, showContactForm]);

  // Optimized related products fetch
  const fetchRelatedProducts = useCallback(async () => {
    try {
      const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      let productsToShow: any[] = [];
      
      if (product.category) {
        const categoryResponse = await fetch(`/api/products?categoryId=${product.category.id}&limit=20`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          const filtered = categoryData.filter((p: any) => p.id !== product.id);
          
          if (filtered.length >= 4) {
            productsToShow = shuffleArray(filtered).slice(0, 4);
            setRelatedProducts(productsToShow);
            return;
          } else if (filtered.length > 0) {
            productsToShow = shuffleArray(filtered);
          }
        }
      }
      
      if (productsToShow.length < 4) {
        const response = await fetch('/api/products?limit=50');
        if (response.ok) {
          const data = await response.json();
          const existingIds = new Set([product.id, ...productsToShow.map(p => p.id)]);
          const filtered = data.filter((p: any) => !existingIds.has(p.id));
          const shuffled = shuffleArray(filtered);
          const needed = 4 - productsToShow.length;
          productsToShow = [...productsToShow, ...shuffled.slice(0, needed)];
        }
      }
      
      setRelatedProducts(productsToShow);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  }, [product.category?.id, product.id]);

  useEffect(() => {
    if (showCartPopup) {
      fetchRelatedProducts();
    }
  }, [showCartPopup, fetchRelatedProducts]);

  // Update selected variant
  useEffect(() => {
    if (!hasVariants) return;

    let variant = null;

    if (hasColors && hasSizes && selectedColor && selectedSize) {
      variant = product.variants?.find(v => 
        v.colorName === selectedColor && v.sizeName === selectedSize
      );
    } else if ((hasColors || hasRandomVariants) && selectedColor && !hasSizes) {
      variant = product.variants?.find(v => v.colorName === selectedColor);
    } else if (hasSizes && selectedSize && !hasColors && !hasRandomVariants) {
      variant = product.variants?.find(v => v.sizeName === selectedSize);
    }

    setSelectedVariant(variant || null);
  }, [selectedColor, selectedSize, product.variants, hasColors, hasSizes, hasVariants, hasRandomVariants]);

  // Auto-select first available option
  useEffect(() => {
    if ((hasColors || hasRandomVariants) && !selectedColor && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
    if (hasSizes && !selectedSize && sizes.length > 0) {
      setSelectedSize(sizes[0]);
    }
  }, [colors, sizes, hasColors, hasSizes, hasRandomVariants, selectedColor, selectedSize]);

  // Memoized calculations
  const effectivePrice = useMemo(() => selectedVariant?.price || product.price, [selectedVariant, product.price]);
  const effectiveRegularPrice = useMemo(() => selectedVariant?.regularPrice || product.regularPrice, [selectedVariant, product.regularPrice]);
  const effectiveStock = useMemo(() => selectedVariant ? selectedVariant.stock : product.stock, [selectedVariant, product.stock]);

  const variantExists = useCallback((color: string | null, size: string | null): boolean => {
    if (!hasVariants) return true;
    
    if (hasColors && hasSizes) {
      return product.variants?.some(v => v.colorName === color && v.sizeName === size) || false;
    } else if (hasColors || hasRandomVariants) {
      return product.variants?.some(v => v.colorName === color) || false;
    } else if (hasSizes) {
      return product.variants?.some(v => v.sizeName === size) || false;
    }
    
    return true;
  }, [hasVariants, hasColors, hasSizes, hasRandomVariants, product.variants]);

  const handleAddToCart = useCallback(() => {
    if (effectiveStock === 0) {
      toast.error('A termék nem elérhető');
      return;
    }
  
    if ((hasColors || hasRandomVariants) && !selectedColor) {
      toast.error(hasRandomVariants ? 'Kérjük, válassz változatot' : 'Kérjük, válassz színt');
      return;
    }
  
    if (hasSizes && !selectedSize) {
      toast.error('Kérjük, válassz méretet');
      return;
    }

    if (hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant) {
      toast.error('A kiválasztott kombináció nem elérhető');
      return;
    }
  
    let variantDisplayName = '';
    if (selectedColor && selectedSize) {
      variantDisplayName = `${selectedColor} / ${selectedSize}`;
    } else if (selectedColor) {
      variantDisplayName = selectedColor;
    } else if (selectedSize) {
      variantDisplayName = selectedSize;
    }
  
    setAddedQuantity(quantity);
  
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(effectivePrice),
        regularPrice: effectiveRegularPrice || undefined,
        image: selectedVariant?.imageUrl || product.image,
        variantId: selectedVariant?.id,
        variantName: variantDisplayName,
        variantColor: selectedVariant?.colorCode || undefined,
        variantSize: selectedSize || undefined,
        categorySlug: product.category?.slug,
        productSlug: product.slug || undefined
      });
    }
  
    setShowCartPopup(true);
    setQuantity(1);
  }, [effectiveStock, hasColors, hasRandomVariants, hasSizes, selectedColor, selectedSize, selectedVariant, quantity, addItem, product, effectivePrice, effectiveRegularPrice]);

  const handleContactFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    const formData = new FormData(e.currentTarget);
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';

    try {
      const response = await fetch('/api/contact/product-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || '',
          subject: formData.get('subject'),
          message: formData.get('message'),
          productName: product.name,
          productUrl: productUrl
        }),
      });

      if (response.ok) {
        toast.success('Az üzeneted elküldtük! A lehető leghamarabb válaszolunk.');
        setShowContactForm(false);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast.error('Hiba történt az üzenet küldése során. Próbáld újra.');
    } finally {
      setIsSubmittingContact(false);
    }
  }, [product.name]);

  // Prepare images for gallery
  const galleryImages = useMemo(() => 
    product.images || (product.image ? [{ 
      id: '1', 
      url: product.image, 
      alt: product.name,
      order: 0 
    }] : []),
    [product.images, product.image, product.name]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Főoldal', href: '/', isHome: true },
            ...(product.category ? [{ 
              label: product.category.name, 
              href: `/category/${product.category.slug}` 
            }] : []),
            { label: product.name }
          ]} 
        />
        
        {/* Mobile: Stack layout, Desktop: Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1.22fr_1fr] gap-4 md:gap-8">
          {/* Product Images */}
          <div className="order-1">
            <ProductImageGallery images={galleryImages} productName={product.name} />
            
            {/* Detailed Description - Hidden on mobile by default */}
            {product.detailDescription && (
              <details className="mt-6 md:mt-8 border-t border-gray-200 pt-4 md:pt-6">
                <summary className="text-base md:text-lg font-bold mb-3 md:mb-4 text-[#131921] cursor-pointer touch-manipulation md:cursor-default list-none">
                  <span className="flex items-center justify-between">
                    Részletes leírás
                    <span className="md:hidden text-sm font-normal text-gray-500">Kattints a kibontáshoz</span>
                  </span>
                </summary>
                <div 
                  className="prose max-w-none text-gray-700 [&>*]:!text-sm md:[&>*]:!text-[15px]"
                  dangerouslySetInnerHTML={{ __html: product.detailDescription }}
                />
              </details>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-4 md:space-y-6 order-2">
            {/* Title and Basic Info Section */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#131921] mb-2">{product.name}</h1>
              
              {/* Brand and Product Code */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-2">
                {product.brand && (
                  <>
                    <span>Márka: {product.brand}</span>
                    <span className="text-gray-400">•</span>
                  </>
                )}
                <span>Kód: {product.code || product.id}</span>
              </div>
              
              {/* Rating - Mobile optimized */}
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div 
                  className="flex items-center"
                  onMouseLeave={() => !isMobile && setHoverRating(0)}
                  onTouchEnd={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverRating > 0 
                      ? star <= hoverRating 
                      : star <= Math.round(rating.average);
                    
                    return (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => !isMobile && !hasRated && setHoverRating(star)}
                        onTouchStart={() => isMobile && !hasRated && setHoverRating(star)}
                        className={`text-xl md:text-2xl transition-all duration-200 touch-manipulation ${
                          hasRated ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-110 active:scale-125'
                        }`}
                        disabled={hasRated}
                        title={hasRated ? 'Már értékelted ezt a terméket' : `Értékelj ${star} csillagot`}
                        style={{ minWidth: '32px', minHeight: '32px' }}
                      >
                        <span className={`${isFilled ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-200`}>
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Rating Info */}
                {rating.total > 0 && (
                  <span className="text-xs md:text-base text-gray-600">
                    {rating.average.toFixed(1)} ({rating.total})
                  </span>
                )}
                
                {rating.total === 0 && !hasRated && (
                  <span className="text-gray-500 text-xs md:text-sm">Értékeld!</span>
                )}
                
                {hasRated && (
                  <span className="text-[#6da306] text-xs md:text-sm">✓</span>
                )}
              </div>
              
              {/* Product Description */}
              {product.description && (
                <div 
                  className="text-gray-600 prose max-w-none [&>*]:!text-sm md:[&>*]:!text-[15px]"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
            
            {/* Price Section - Mobile sticky */}
            <div className={`space-y-2 ${isMobile ? 'sticky top-0 bg-white z-10 pb-2 pt-2' : ''}`}>
              {effectiveRegularPrice && effectiveRegularPrice > effectivePrice ? (
                <>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl font-bold text-red-600">
                      {formatPrice(Number(effectivePrice))}
                    </span>
                    <span className="text-base md:text-lg text-gray-500 line-through">
                      {formatPrice(Number(effectiveRegularPrice))}
                    </span>
                    <span className="bg-red-600 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg text-xs md:text-sm font-bold">
                      -{calculateDiscount(Number(effectivePrice), Number(effectiveRegularPrice))}%
                    </span>
                  </div>
                  <p className="text-[#6da306] font-medium text-xs md:text-sm">
                    Megtakarítasz {formatPrice(Number(effectiveRegularPrice) - Number(effectivePrice))}
                  </p>
                </>
              ) : (
                <div className="text-xl md:text-2xl font-bold text-black">
                  {formatPrice(Number(effectivePrice))}
                </div>
              )}
            </div>
            
            {/* Variant Selection - Mobile optimized */}
            {hasRandomVariants && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-black">Változat</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((variantName) => {
                    const variant = product.variants?.find(v => v.colorName === variantName);
                    const hasStock = variant && variant.stock > 0;
                    
                    return (
                      <button
                        key={variantName}
                        onClick={() => setSelectedColor(variantName)}
                        className={`px-3 md:px-4 py-2 rounded-lg border-2 transition touch-manipulation ${
                          selectedColor === variantName
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        <span className="text-sm md:text-base text-black">{variantName}</span>
                        {!hasStock && (
                          <span className="text-xs text-red-500 ml-1 block md:inline">(nem elérhető)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Color Selection */}
            {hasColors && !hasRandomVariants && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-black">Szín</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const colorVariant = product.variants?.find(v => v.colorName === color);
                    const hasStock = selectedSize 
                      ? product.variants?.some(v => v.colorName === color && v.sizeName === selectedSize && v.stock > 0)
                      : product.variants?.some(v => v.colorName === color && v.stock > 0);
                    
                    const isAvailable = !hasSizes || !selectedSize || variantExists(color, selectedSize);
                    
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 md:px-4 py-2 rounded-lg border-2 transition flex items-center gap-2 touch-manipulation ${
                          selectedColor === color
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        {colorVariant?.colorCode && (
                          <span
                            className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-gray-300"
                            style={{ backgroundColor: colorVariant.colorCode }}
                          />
                        )}
                        <span className="text-sm md:text-base text-black">{color}</span>
                        {!isAvailable && (
                          <span className="text-xs text-red-500 hidden md:inline">(nem elérhető)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {hasSizes && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-black">Méret</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const hasStock = selectedColor
                      ? product.variants?.some(v => v.sizeName === size && v.colorName === selectedColor && v.stock > 0)
                      : product.variants?.some(v => v.sizeName === size && v.stock > 0);
                    
                    const isAvailable = !hasColors || !selectedColor || variantExists(selectedColor, size);
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 md:px-4 py-2 min-w-[50px] md:min-w-[60px] rounded-lg border-2 transition touch-manipulation ${
                          selectedSize === size
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        <span className="text-sm md:text-base text-black font-medium">{size}</span>
                        {!isAvailable && (
                          <span className="text-xs text-red-500 block md:inline">(nem elérhető)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warning message */}
            {hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 md:p-3 text-xs md:text-sm">
                <p className="text-yellow-800">
                  A(z) <strong>{selectedColor} / {selectedSize}</strong> kombináció nem elérhető.
                </p>
              </div>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className={`${effectiveStock > 0 ? 'text-[#6da306]' : 'text-red-600'} w-5 h-5`} />
              <div>
                <span className={`font-semibold text-sm md:text-base ${effectiveStock > 0 ? 'text-[#6da306]' : 'text-red-600'}`}>
                  {formatStockDisplay(effectiveStock, product.availability || 'in_stock')}
                </span>
                {effectiveStock > 0 && (
                  <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                    Szállítás már <span className="font-semibold">{getNextDeliveryDate()}</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Quantity Selector - Mobile optimized */}
            <div className="flex items-center gap-3 md:gap-4">
              <label className="text-sm md:text-base text-black font-medium">Mennyiség:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 md:w-10 md:h-10 rounded-lg border hover:bg-gray-100 transition touch-manipulation text-lg"
                  disabled={quantity <= 1}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 md:w-16 text-center border rounded-lg py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm md:text-base"
                  min="1"
                  max={effectiveStock}
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                  className="w-10 h-10 md:w-10 md:h-10 rounded-lg border hover:bg-gray-100 transition touch-manipulation text-lg"
                  disabled={quantity >= effectiveStock}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button - Mobile sticky */}
            <div className={isMobile ? 'sticky bottom-0 bg-white pb-4 pt-2 z-10' : ''}>
              <button
                onClick={handleAddToCart}
                disabled={!!(effectiveStock === 0 || (hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant))}
                className={`w-full py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition flex items-center justify-center gap-2 md:gap-3 touch-manipulation ${
                  effectiveStock === 0 || (hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'text-white active:scale-95'
                }`}
                style={{
                  backgroundColor: effectiveStock > 0 && (!hasColors || !hasSizes || selectedVariant) ? '#8fb300' : undefined,
                  minHeight: '48px'
                }}
                onMouseEnter={(e) => {
                  if (effectiveStock > 0 && (!hasColors || !hasSizes || selectedVariant)) {
                    e.currentTarget.style.backgroundColor = '#7a9900';
                  }
                }}
                onMouseLeave={(e) => {
                  if (effectiveStock > 0 && (!hasColors || !hasSizes || selectedVariant)) {
                    e.currentTarget.style.backgroundColor = '#8fb300';
                  }
                }}
              >
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                {effectiveStock === 0 ? 'Elfogyott' : 'Kosárba'}
              </button>
            </div>
            
            {/* Price Guarantee and Warranty - Mobile optimized */}
            <div className="pt-4 md:pt-6 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-xs md:text-[14.3px]">
                {/* Price Guarantee */}
                <div className="flex items-center gap-2">
                  <Image 
                    src="/images/icon_checkmark.png"
                    alt="Checkmark" 
                    width={16} 
                    height={16}
                    className="inline-block md:w-5 md:h-5"
                  />
                  <span style={{ color: '#6da306' }} className="underline font-bold">Legjobb ár garancia</span>
                  <button
                    type="button"
                    className="relative touch-manipulation p-1"
                    onMouseEnter={() => !isMobile && setShowPriceGuarantee(true)}
                    onMouseLeave={() => !isMobile && setShowPriceGuarantee(false)}
                    onClick={() => setShowPriceGuarantee(!showPriceGuarantee)}
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <Info className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                
                {/* Warranty */}
                {product.warranty && (
                  <p className="text-gray-700">
                    <span className="text-black">Garancia</span> <span>✓ {product.warranty}</span>
                  </p>
                )}
                
                {/* Contact Us */}
                <div className="flex items-center gap-2">
                  <button
                    id="contact-button"
                    type="button"
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors touch-manipulation p-1"
                    onClick={() => setShowContactForm(!showContactForm)}
                    style={{ minHeight: '32px' }}
                  >
                    <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="underline">Írj nekünk</span>
                  </button>
                </div>
              </div>
              
              {/* Price Guarantee Popup - Mobile optimized */}
              {showPriceGuarantee && (
                <div className={`absolute z-10 mt-2 p-4 md:p-5 bg-white rounded-lg shadow-xl border border-gray-200 ${
                  isMobile ? 'left-0 right-0' : 'max-w-sm'
                }`}>
                  <h4 className="font-semibold text-black mb-2 md:mb-3 text-base md:text-lg">Legjobb ár garancia</h4>
                  <div className="space-y-2 text-xs md:text-sm text-gray-600">
                    <p>
                      Garantáljuk a legalacsonyabb árat a piacon. Ha ugyanezt a terméket olcsóbban találod a versenytársaknál, 
                      azonnal visszatérítjük a különbözetet.
                    </p>
                    <p className="font-medium text-gray-700">Hogyan működik:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>A garancia a vásárlástól számított 14 napig érvényes</li>
                      <li>A terméknek azonosnak kell lennie</li>
                      <li>A versenytárs ajánlatának érvényesnek kell lennie</li>
                      <li>Csak küldd el nekünk a linket</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* Shipping Info Icons - Mobile optimized */}
            <div className="border-t border-gray-200 pt-4 md:pt-6">
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 md:mb-2">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold text-[#131921] mb-0.5 md:mb-1">Ingyenes szállítás</h4>
                  <p className="text-[10px] md:text-xs text-gray-600">0 Ft-tól</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 md:mb-2">
                    <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold text-[#131921] mb-0.5 md:mb-1">Ingyenes visszaküldés</h4>
                  <p className="text-[10px] md:text-xs text-gray-600">14 napig</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 md:mb-2">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold text-[#131921] mb-0.5 md:mb-1">Megbízható bolt</h4>
                  <p className="text-[10px] md:text-xs text-gray-600">100% biztonságos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-8 md:mt-16">
          <RelatedProducts productId={product.id} />
        </div>
      </div>

      {/* Contact Form Modal - Mobile optimized */}
      {showContactForm && (
        <>
          <div 
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => setShowContactForm(false)}
          />
          
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
            <div className={`bg-white ${
              isMobile 
                ? 'rounded-t-2xl w-full max-h-[90vh]' 
                : 'rounded-lg shadow-2xl w-full max-w-md max-h-[90vh]'
            } overflow-y-auto`}>
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h4 className="text-lg md:text-xl font-bold text-black">Írj nekünk</h4>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700 touch-manipulation p-1"
                    disabled={isSubmittingContact}
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
                
                <form className="space-y-3 md:space-y-4" onSubmit={handleContactFormSubmit}>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Név
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
                      style={{ minHeight: '40px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
                      style={{ minHeight: '40px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Telefon (opcionális)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
                      style={{ minHeight: '40px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Üzenet tárgya
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      defaultValue={`Kérdés a termékről: ${product.name}`}
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
                      style={{ minHeight: '40px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Üzeneted
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm md:text-base"
                      placeholder="Írd meg nekünk a kérdésed..."
                    />
                  </div>
                  <div className="flex gap-2 md:gap-3 pt-2 md:pt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="flex-1 bg-blue-600 text-white py-2.5 md:py-2 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed text-sm md:text-base touch-manipulation"
                      style={{ minHeight: '44px' }}
                    >
                      {isSubmittingContact ? 'Küldés...' : 'Küldés'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      disabled={isSubmittingContact}
                      className="px-4 md:px-6 py-2.5 md:py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base touch-manipulation"
                      style={{ minHeight: '44px' }}
                    >
                      Bezárás
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Popup Modal - Mobile optimized */}
      {showCartPopup && (
        <>
          <div 
            className="fixed inset-0"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              backdropFilter: 'blur(2px)',
              zIndex: 1100
            }}
            onClick={() => setShowCartPopup(false)}
          />
          
          <div 
            className={`fixed left-0 right-0 flex justify-center ${isMobile ? 'px-2' : 'px-4'}`} 
            style={{ 
              top: isMobile ? '20px' : '100px',
              zIndex: 1100
            }}
          >
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${
              isMobile ? 'max-w-lg' : 'max-w-5xl'
            }`} style={{ maxHeight: 'calc(100vh - 40px)' }}>
              {/* Header */}
              <div className="bg-white p-4 md:p-6 rounded-t-2xl border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="bg-[#6da306] rounded-full p-1.5 md:p-2">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-[#6da306]">
                      {addedQuantity > 1 
                        ? `${addedQuantity} termék a kosárba került!` 
                        : 'Termék a kosárba került!'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCartPopup(false)}
                    className="text-black hover:text-gray-600 transition-colors p-1 rounded-lg touch-manipulation"
                    style={{ minWidth: '32px', minHeight: '32px' }}
                  >
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 280px)' }}>
                {/* Added Product */}
                <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4 md:gap-6 pb-4 md:pb-6 border-b border-gray-100`}>
                  <img
                    src={selectedVariant?.imageUrl || product.image || '/placeholder.png'}
                    alt={product.name}
                    className={`${
                      isMobile ? 'w-full h-48' : 'w-48 h-48'
                    } object-contain rounded-xl bg-gray-50`}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#131921] text-base md:text-lg">{product.name}</h4>
                    {(selectedColor || selectedSize) && (
                      <p className="text-gray-600 text-xs md:text-sm">
                        {selectedColor && <span>{hasRandomVariants ? 'Változat' : 'Szín'}: {selectedColor}</span>}
                        {selectedColor && selectedSize && <span> • </span>}
                        {selectedSize && <span>Méret: {selectedSize}</span>}
                      </p>
                    )}
                    <div className="mt-1">
                      {effectiveRegularPrice && effectiveRegularPrice > effectivePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[#6da306] font-bold text-base md:text-lg">
                            {formatPrice(Number(effectivePrice))}
                          </span>
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            {formatPrice(Number(effectiveRegularPrice))}
                          </span>
                          <span className="bg-red-600 text-white px-1 md:px-1.5 py-0.5 rounded text-xs font-bold">
                            -{calculateDiscount(Number(effectivePrice), Number(effectiveRegularPrice))}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#6da306] font-bold text-base md:text-lg">
                          {formatPrice(Number(effectivePrice))}
                        </span>
                      )}
                      {addedQuantity > 1 && (
                        <span className="text-xs md:text-sm text-gray-600 ml-2">
                          x {addedQuantity} = {formatPrice(Number(effectivePrice) * addedQuantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 my-4 md:my-6 flex items-center gap-2 md:gap-3">
                  <Truck className="text-[#6da306] w-5 h-5" size={20} />
                  <p className="text-xs md:text-sm">
                    <span className="font-semibold text-[#6da306]">Ingyenes szállítás</span>
                    <span className="text-[#131921]"> már 0 Ft-tól!</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 md:gap-4 my-4 md:my-6">
                  <button
                    onClick={() => setShowCartPopup(false)}
                    className="flex-1 py-2.5 md:py-3 px-4 md:px-6 bg-white border border-gray-100 rounded-xl font-semibold text-sm md:text-base text-[#131921] hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 touch-manipulation"
                    style={{ minHeight: '44px' }}
                  >
                    Vásárlás folytatása
                  </button>
                  <Link
                    href="/cart"
                    className="flex-1 py-2.5 md:py-3 px-4 md:px-6 bg-[#6da306] text-white rounded-xl font-semibold text-sm md:text-base hover:bg-[#5d8f05] transition-colors text-center touch-manipulation flex items-center justify-center"
                    onClick={() => setShowCartPopup(false)}
                    style={{ minHeight: '44px' }}
                  >
                    Ugrás a kosárhoz
                  </Link>
                </div>

                {/* Related Products - Hidden on mobile */}
                {!isMobile && relatedProducts.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-[#131921] mb-4 text-center">Érdekelhet még</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {relatedProducts.map((relatedProduct) => (
                        <Link
                          key={relatedProduct.id}
                          href={`/${relatedProduct.category?.slug || 'product'}/${relatedProduct.slug}`}
                          className="group"
                          onClick={() => setShowCartPopup(false)}
                        >
                          <div className="rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
                            <div className="aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50">
                              <img
                                src={relatedProduct.image || '/placeholder.png'}
                                alt={relatedProduct.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>
                            <h5 className="font-medium text-sm text-[#131921] line-clamp-2 mb-2">
                              {relatedProduct.name}
                            </h5>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-shrink-0">
                                {relatedProduct.regularPrice && relatedProduct.regularPrice > relatedProduct.price ? (
                                  <>
                                    <p className="text-[#6da306] font-bold text-sm">
                                      {formatPrice(relatedProduct.price)}
                                    </p>
                                    <p className="text-xs text-gray-500 line-through">
                                      {formatPrice(relatedProduct.regularPrice)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-[#6da306] font-bold text-sm">
                                    {formatPrice(relatedProduct.price)}
                                  </p>
                                )}
                              </div>
                              <button className="py-1.5 px-3 bg-[#6da306] text-white text-xs font-medium rounded-lg hover:bg-[#5d8f05] transition-colors whitespace-nowrap">
                                Megnézem
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});