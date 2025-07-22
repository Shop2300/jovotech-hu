// src/app/[categorySlug]/[productSlug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, Package, Info, MessageCircle, Truck, RotateCcw, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { RelatedProducts } from '@/components/RelatedProducts';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';

// Helper function to calculate next delivery date
function getNextDeliveryDate(): string {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Start with tomorrow if before 13:00, otherwise day after tomorrow
  let daysToAdd = currentHour < 13 ? 1 : 2;
  
  // Create delivery date
  let deliveryDate = new Date(now);
  
  while (daysToAdd > 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const dayOfWeek = deliveryDate.getDay();
    
    // Skip weekends
    if (dayOfWeek === 0) { // Sunday
      deliveryDate.setDate(deliveryDate.getDate() + 1); // Skip to Monday
    } else if (dayOfWeek === 6) { // Saturday
      deliveryDate.setDate(deliveryDate.getDate() + 2); // Skip to Monday
    } else {
      daysToAdd--; // Only count business days
    }
  }
  
  // Format date as DD.MM.
  const day = deliveryDate.getDate();
  const month = deliveryDate.getMonth() + 1;
  
  return `${day}.${month}.`;
}

// Helper function to format stock display
function formatStockDisplay(stock: number, availability: string = 'in_stock'): string {
  if (stock === 0) {
    return 'Wyprzedane';
  } else if (stock > 5) {
    // Use availability field to determine display text
    return availability === 'in_stock_supplier' 
      ? 'W magazynie u dostawcy: >5 SZT'
      : 'Na stanie: >5 SZT';
  } else {
    // Use availability field to determine display text
    return availability === 'in_stock_supplier'
      ? `W magazynie u dostawcy: ${stock} szt`
      : `Na stanie: ${stock} szt`;
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
    availability?: string | null; // NEW FIELD
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

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCart((state) => state.addItem);
  const getTotalItems = useCart((state) => state.getTotalItems);
  const getTotalPrice = useCart((state) => state.getTotalPrice);
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

  // Get unique colors and sizes - ALL of them, not filtered
  const colors = Array.from(new Set(product.variants?.filter(v => v.colorName).map(v => v.colorName))) as string[];
  const sizes = Array.from(new Set(product.variants?.filter(v => v.sizeName).map(v => v.sizeName))) as string[];
  
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;
  const hasVariants = product.variants && product.variants.length > 0;

  // Handle star rating click
  const handleStarClick = async (selectedRating: number) => {
    if (hasRated) {
      toast.error('Už oceniłeś ten produkt');
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
          authorName: 'Anonym',
          authorEmail: `anon${Date.now()}@example.com`
        }),
      });

      if (response.ok) {
        // Update local rating state
        const newTotal = rating.total + 1;
        const newAverage = ((rating.average * rating.total) + selectedRating) / newTotal;
        
        setRating({
          average: newAverage,
          total: newTotal
        });
        setHasRated(true);
        
        // Store in localStorage to prevent multiple ratings
        localStorage.setItem(`rated_${product.id}`, 'true');
        
        toast.success('Dziękujemy za ocenę!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Nie udało się zapisać oceny');
    }
  };

  // Check if user has already rated
  useEffect(() => {
    const rated = localStorage.getItem(`rated_${product.id}`);
    if (rated) {
      setHasRated(true);
    }
  }, [product.id]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showCartPopup) {
      document.body.style.overflow = 'hidden';
      
      // Handle ESC key
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowCartPopup(false);
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
  }, [showCartPopup]);

  // Fetch related products from the same category
  const fetchRelatedProducts = async () => {
    try {
      // Helper function to shuffle array
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
        // First try to get products from the same category
        const categoryResponse = await fetch(`/api/products?categoryId=${product.category.id}&limit=20`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          const filtered = categoryData.filter((p: any) => p.id !== product.id);
          
          if (filtered.length >= 4) {
            // Shuffle and take 4 random products from the same category
            productsToShow = shuffleArray(filtered).slice(0, 4);
            setRelatedProducts(productsToShow);
            return;
          } else if (filtered.length > 0) {
            // If less than 4, use what we have
            productsToShow = shuffleArray(filtered);
          }
        }
      }
      
      // If we need more products, get from all products
      if (productsToShow.length < 4) {
        const response = await fetch('/api/products?limit=50'); // Get more products for better randomization
        if (response.ok) {
          const data = await response.json();
          // Filter out current product and products already in the list
          const existingIds = new Set([product.id, ...productsToShow.map(p => p.id)]);
          const filtered = data.filter((p: any) => !existingIds.has(p.id));
          
          // Shuffle all products and take enough to fill up to 4
          const shuffled = shuffleArray(filtered);
          const needed = 4 - productsToShow.length;
          productsToShow = [...productsToShow, ...shuffled.slice(0, needed)];
        }
      }
      
      setRelatedProducts(productsToShow);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  useEffect(() => {
    if (showCartPopup) {
      fetchRelatedProducts();
    }
  }, [showCartPopup, product.category?.id, product.id]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (!hasVariants) return;

    let variant = null;

    // Try to find exact match first
    if (hasColors && hasSizes && selectedColor && selectedSize) {
      variant = product.variants?.find(v => 
        v.colorName === selectedColor && v.sizeName === selectedSize
      );
    } else if (hasColors && selectedColor && !hasSizes) {
      variant = product.variants?.find(v => v.colorName === selectedColor);
    } else if (hasSizes && selectedSize && !hasColors) {
      variant = product.variants?.find(v => v.sizeName === selectedSize);
    }

    setSelectedVariant(variant || null);
  }, [selectedColor, selectedSize, product.variants, hasColors, hasSizes, hasVariants]);

  // Auto-select first available option
  useEffect(() => {
    if (hasColors && !selectedColor && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
    if (hasSizes && !selectedSize && sizes.length > 0) {
      setSelectedSize(sizes[0]);
    }
  }, [colors, sizes, hasColors, hasSizes, selectedColor, selectedSize]);

  // Calculate effective price, regular price and stock
  const effectivePrice = selectedVariant?.price || product.price;
  const effectiveRegularPrice = selectedVariant?.regularPrice || product.regularPrice;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Check if a specific variant combination exists
  const variantExists = (color: string | null, size: string | null): boolean => {
    if (!hasVariants) return true;
    
    if (hasColors && hasSizes) {
      return product.variants?.some(v => v.colorName === color && v.sizeName === size) || false;
    } else if (hasColors) {
      return product.variants?.some(v => v.colorName === color) || false;
    } else if (hasSizes) {
      return product.variants?.some(v => v.sizeName === size) || false;
    }
    
    return true;
  };

  const handleAddToCart = () => {
    if (effectiveStock === 0) {
      toast.error('Produkt niedostępny');
      return;
    }
  
    if (hasColors && !selectedColor) {
      toast.error('Proszę wybrać kolor');
      return;
    }
  
    if (hasSizes && !selectedSize) {
      toast.error('Proszę wybrać rozmiar');
      return;
    }

    // Check if the selected combination exists
    if (hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant) {
      toast.error('Wybrana kombinacja nie jest dostępna');
      return;
    }
  
    // Create variant display name
    let variantDisplayName = '';
    if (selectedColor && selectedSize) {
      variantDisplayName = `${selectedColor} / ${selectedSize}`;
    } else if (selectedColor) {
      variantDisplayName = selectedColor;
    } else if (selectedSize) {
      variantDisplayName = selectedSize;
    }
  
    // Store quantity for popup display
    setAddedQuantity(quantity);
  
    // Add multiple items based on quantity
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
  
    // Show popup instead of toast
    setShowCartPopup(true);
    setQuantity(1);
  };

  // Handle contact form submission
  const handleContactFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        toast.success('Twoja wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe.');
        setShowContactForm(false);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast.error('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Prepare images for gallery
  const galleryImages = product.images || (product.image ? [{ 
    id: '1', 
    url: product.image, 
    alt: product.name,
    order: 0 
  }] : []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Strona główna', href: '/', isHome: true },
            ...(product.category ? [{ 
              label: product.category.name, 
              href: `/category/${product.category.slug}` 
            }] : []),
            { label: product.name }
          ]} 
        />
        
        {/* Updated grid to give more space to images (55% images, 45% details) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.22fr_1fr] gap-8">
          {/* Product Images - Now 10% larger due to grid adjustment */}
          <div>
            <ProductImageGallery images={galleryImages} productName={product.name} />
            
            {/* Detailed Description */}
            {product.detailDescription && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold mb-4 text-[#131921]">Szczegółowy opis</h2>
                <div 
                  className="prose max-w-none text-gray-700 [&>*]:!text-[15px]"
                  style={{ fontSize: '15px' }}
                  dangerouslySetInnerHTML={{ __html: product.detailDescription }}
                />
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Basic Info Section */}
            <div>
              <h1 className="text-2xl font-bold text-[#131921] mb-2">{product.name}</h1>
              {/* Brand and Product Code */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                {product.brand && (
                  <>
                    <span>Marka: {product.brand}</span>
                    <span className="text-gray-400">•</span>
                  </>
                )}
                <span>Kod: {product.code || product.id}</span>
              </div>
              
              {/* Rating - Interactive */}
              <div className="flex items-center gap-3 mb-4">
                {/* Interactive Stars */}
                <div 
                  className="flex items-center"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverRating > 0 
                      ? star <= hoverRating 
                      : star <= Math.round(rating.average);
                    
                    return (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => !hasRated && setHoverRating(star)}
                        className={`text-2xl transition-all duration-200 ${
                          hasRated ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-110 active:scale-125'
                        }`}
                        disabled={hasRated}
                        title={hasRated ? 'Już oceniłeś ten produkt' : `Oceń ${star} ${star === 1 ? 'gwiazdkę' : star < 5 ? 'gwiazdki' : 'gwiazdek'}`}
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
                  <span className="text-gray-600">
                    {rating.average.toFixed(1)} z 5 ({rating.total} {rating.total === 1 ? 'ocena' : rating.total < 5 ? 'oceny' : 'ocen'})
                  </span>
                )}
                
                {rating.total === 0 && !hasRated && (
                  <span className="text-gray-500 text-sm">Kliknij gwiazdkę, aby ocenić!</span>
                )}
                
                {hasRated && (
                  <span className="text-[#6da306] text-sm">✓ Dziękujemy za ocenę!</span>
                )}
              </div>
              
              {/* Product Description - Moved closer to title */}
              {product.description && (
                <div 
                  className="text-gray-600 prose max-w-none [&>*]:!text-[15px]"
                  style={{ fontSize: '15px' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
            
            {/* Add spacing between description and the rest of content */}
            <div className="mt-6 space-y-6">
              {/* Price Section - Updated to use effectiveRegularPrice */}
              <div className="space-y-2">
                {effectiveRegularPrice && effectiveRegularPrice > effectivePrice ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(Number(effectivePrice))}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(Number(effectiveRegularPrice))}
                      </span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                        -{calculateDiscount(Number(effectivePrice), Number(effectiveRegularPrice))}%
                      </span>
                    </div>
                    <p className="text-[#6da306] font-medium text-sm">
                      Oszczędzasz {formatPrice(Number(effectiveRegularPrice) - Number(effectivePrice))}
                    </p>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-black">
                    {formatPrice(Number(effectivePrice))}
                  </div>
                )}
              </div>
              
              {/* Color Selection - Updated with improved logic */}
              {hasColors && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black">Kolor</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const colorVariant = product.variants?.find(v => v.colorName === color);
                      // Check if this color has any in-stock variants
                      const hasStock = selectedSize 
                        ? product.variants?.some(v => v.colorName === color && v.sizeName === selectedSize && v.stock > 0)
                        : product.variants?.some(v => v.colorName === color && v.stock > 0);
                      
                      const isAvailable = !hasSizes || !selectedSize || variantExists(color, selectedSize);
                      
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border-2 transition flex items-center gap-2 ${
                            selectedColor === color
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {colorVariant?.colorCode && (
                            <span
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{ backgroundColor: colorVariant.colorCode }}
                            />
                          )}
                          <span className="text-black">{color}</span>
                          {!isAvailable && (
                            <span className="text-xs text-red-500">(niedostępne)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Size Selection - Updated with improved logic */}
              {hasSizes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black">Rozmiar</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      // Check if this size has any in-stock variants
                      const hasStock = selectedColor
                        ? product.variants?.some(v => v.sizeName === size && v.colorName === selectedColor && v.stock > 0)
                        : product.variants?.some(v => v.sizeName === size && v.stock > 0);
                      
                      const isAvailable = !hasColors || !selectedColor || variantExists(selectedColor, size);
                      
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 min-w-[60px] rounded-lg border-2 transition ${
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <span className="text-black font-medium">{size}</span>
                          {!isAvailable && (
                            <span className="text-xs text-red-500 block">(niedostępne)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warning message when selected combination doesn't exist */}
              {hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-800">
                    Kombinacja <strong>{selectedColor} / {selectedSize}</strong> nie jest dostępna.
                    Wybierz inną kombinację.
                  </p>
                </div>
              )}
              
              {/* Stock Status - UPDATED to use availability field */}
              <div className="flex items-center gap-2">
                <Package className={effectiveStock > 0 ? 'text-[#6da306]' : 'text-red-600'} size={20} />
                <div>
                  <span className={`font-semibold ${effectiveStock > 0 ? 'text-[#6da306]' : 'text-red-600'}`}>
                    {formatStockDisplay(effectiveStock, product.availability || 'in_stock')}
                  </span>
                  {effectiveStock > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Dostawa możliwa już <span className="font-semibold">{getNextDeliveryDate()}</span>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-black font-medium">Ilość:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border hover:bg-gray-100 transition"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border rounded-lg py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1"
                    max={effectiveStock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                    className="w-10 h-10 rounded-lg border hover:bg-gray-100 transition"
                    disabled={quantity >= effectiveStock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to Cart Button - Updated with more rounded corners */}
              <button
                onClick={handleAddToCart}
                disabled={!!(effectiveStock === 0 || (hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant))}
                className={`w-full py-4 rounded-full font-semibold text-lg transition flex items-center justify-center gap-3 ${
                  effectiveStock === 0 || (hasColors && hasSizes && selectedColor && selectedSize && !selectedVariant)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'text-white'
                }`}
                style={effectiveStock > 0 && (!hasColors || !hasSizes || selectedVariant) ? { backgroundColor: '#8fb300' } : undefined}
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
                <ShoppingCart size={24} />
                {effectiveStock === 0 ? 'Wyprzedane' : 'Dodaj do koszyka'}
              </button>
              
              {/* Price Guarantee and Warranty */}
              <div className="pt-6 relative">
                <div className="flex items-center gap-6 text-[14.3px]">
                  {/* Price Guarantee - Updated with custom icon and styling */}
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/images/icon_checkmark.png"
                      alt="Checkmark" 
                      width={20} 
                      height={20}
                      className="inline-block"
                    />
                    <span style={{ color: '#6da306' }} className="underline font-bold">Gwarancja najlepszej ceny</span>
                    <button
                      type="button"
                      className="relative"
                      onMouseEnter={() => setShowPriceGuarantee(true)}
                      onMouseLeave={() => setShowPriceGuarantee(false)}
                      onClick={() => setShowPriceGuarantee(!showPriceGuarantee)}
                    >
                      <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  
                  {/* Warranty */}
                  {product.warranty && (
                    <p className="text-gray-700">
                      <span className="text-black">Gwarancja</span> <span>✓ {product.warranty}</span>
                    </p>
                  )}
                  
                  {/* Contact Us */}
                  <div className="flex items-center gap-2">
                    <button
                      id="contact-button"
                      type="button"
                      className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setShowContactForm(!showContactForm)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="underline">Napisz do nas</span>
                    </button>
                  </div>
                </div>
                
                {/* Price Guarantee Popup */}
                {showPriceGuarantee && (
                  <div className="absolute z-10 mt-2 p-5 bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm">
                    <h4 className="font-semibold text-black mb-3 text-lg">Gwarancja najlepszej ceny</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        Gwarantujemy najniższą cenę na rynku. Jeśli znajdziesz ten sam produkt u konkurencji taniej, 
                        natychmiast zwrócimy Ci różnicę.
                      </p>
                      <p className="font-medium text-gray-700">Jak to działa:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Gwarancja obowiązuje 14 dni od zakupu</li>
                        <li>Produkt musi być identyczny (ten sam model, kolor, rozmiar)</li>
                        <li>Oferta konkurencji musi być aktualnie ważna</li>
                        <li>Wystarczy przesłać nam link do oferty konkurencji</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Shipping Info Icons */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-3 gap-4">
                  {/* Free Shipping */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Truck className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#131921] mb-1">Darmowa wysyłka</h4>
                    <p className="text-xs text-gray-600">Już od zakupu 0 zł</p>
                  </div>
                  
                  {/* Free Returns */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <RotateCcw className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#131921] mb-1">Bezpłatny zwrot</h4>
                    <p className="text-xs text-gray-600">Do 14 dni</p>
                  </div>
                  
                  {/* Reliable Shop */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <ShieldCheck className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#131921] mb-1">Wiarygodny sklep</h4>
                    <p className="text-xs text-gray-600">100% bezpieczne zakupy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts productId={product.id} />
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => setShowContactForm(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-black">Napisz do nas</h4>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={isSubmittingContact}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form className="space-y-4" onSubmit={handleContactFormSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię i nazwisko
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon (opcjonalnie)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temat wiadomości
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      defaultValue={`Pytanie o produkt: ${product.name}`}
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twoja wiadomość
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      disabled={isSubmittingContact}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Napisz do nas swoje pytanie dotyczące tego produktu..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isSubmittingContact ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      disabled={isSubmittingContact}
                      className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Zamknij
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Popup Modal - Updated to show variant regular price */}
      {showCartPopup && (
        <>
          {/* Backdrop - Transparent with blur */}
          <div 
            className="fixed inset-0"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              backdropFilter: 'blur(2px)',
              zIndex: 1100 // Higher than header (1000)
            }}
            onClick={() => setShowCartPopup(false)}
          />
          
          {/* Modal - Position based on promotional bar visibility */}
          <div 
            className="fixed left-0 right-0 flex justify-center px-4" 
            style={{ 
              top: (() => {
                // Check if promotional bar is closed (same logic as LayoutWrapper)
                const promoClosed = typeof window !== 'undefined' 
                  ? localStorage.getItem('promoClosed') === 'true'
                  : false;
                
                // If promo is closed or we've scrolled past it, use smaller top value
                if (promoClosed || (typeof window !== 'undefined' && window.scrollY > 40)) {
                  return '100px'; // Header (~80px) + gap (20px)
                } else {
                  return '140px'; // Promo (~40px) + Header (~80px) + gap (20px)
                }
              })(),
              zIndex: 1100  // Higher than header (1000)
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {/* Header */}
              <div className="bg-white p-6 rounded-t-2xl border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#6da306] rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#6da306]">
                      {addedQuantity > 1 
                        ? `${addedQuantity} ${addedQuantity < 5 ? 'produkty' : 'produktów'} ${addedQuantity < 5 ? 'dodane' : 'dodanych'} do koszyka!` 
                        : 'Produkt dodany do koszyka!'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCartPopup(false)}
                    className="text-black hover:text-gray-600 transition-colors p-1 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {/* Added Product */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <img
                    src={selectedVariant?.imageUrl || product.image || '/placeholder.png'}
                    alt={product.name}
                    className="w-48 h-48 object-contain rounded-xl bg-gray-50"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#131921] text-lg">{product.name}</h4>
                    {(selectedColor || selectedSize) && (
                      <p className="text-gray-600 text-sm">
                        {selectedColor && <span>Kolor: {selectedColor}</span>}
                        {selectedColor && selectedSize && <span> • </span>}
                        {selectedSize && <span>Rozmiar: {selectedSize}</span>}
                      </p>
                    )}
                    <div className="mt-1">
                      {effectiveRegularPrice && effectiveRegularPrice > effectivePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[#6da306] font-bold text-lg">
                            {formatPrice(Number(effectivePrice))}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(Number(effectiveRegularPrice))}
                          </span>
                          <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                            -{calculateDiscount(Number(effectivePrice), Number(effectiveRegularPrice))}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#6da306] font-bold text-lg">
                          {formatPrice(Number(effectivePrice))}
                        </span>
                      )}
                      {addedQuantity > 1 && (
                        <span className="text-sm text-gray-600 ml-2">
                          x {addedQuantity} = {formatPrice(Number(effectivePrice) * addedQuantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 my-6 flex items-center gap-3">
                  <Truck className="text-[#6da306]" size={20} />
                  <p className="text-sm">
                    <span className="font-semibold text-[#6da306]">Darmowa dostawa</span>
                    <span className="text-[#131921]"> już od 0 zł! Dostawa w 1-2 dni robocze.</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 my-6">
                  <button
                    onClick={() => setShowCartPopup(false)}
                    className="flex-1 py-3 px-6 bg-white border border-gray-100 rounded-xl font-semibold text-[#131921] hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
                  >
                    Kontynuuj zakupy
                  </button>
                  <Link
                    href="/cart"
                    className="flex-1 py-3 px-6 bg-[#6da306] text-white rounded-xl font-semibold hover:bg-[#5d8f05] transition-colors text-center"
                    onClick={() => setShowCartPopup(false)}
                  >
                    Przejdź do koszyka
                  </Link>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-[#131921] mb-4 text-center">Może Cię również zainteresować</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                              />
                            </div>
                            <h5 className="font-medium text-sm text-[#131921] line-clamp-2 mb-2">
                              {relatedProduct.name}
                            </h5>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-shrink-0">
                                {relatedProduct.regularPrice && relatedProduct.regularPrice > relatedProduct.price ? (
                                  <>
                                    <p className="text-[#6da306] font-bold">
                                      {formatPrice(relatedProduct.price)}
                                    </p>
                                    <p className="text-xs text-gray-500 line-through">
                                      {formatPrice(relatedProduct.regularPrice)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-[#6da306] font-bold">
                                    {formatPrice(relatedProduct.price)}
                                  </p>
                                )}
                              </div>
                              <button className="py-1.5 px-3 bg-[#6da306] text-white text-xs font-medium rounded-lg hover:bg-[#5d8f05] transition-colors whitespace-nowrap">
                                Zobacz
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
}