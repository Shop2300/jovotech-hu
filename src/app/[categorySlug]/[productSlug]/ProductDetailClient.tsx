// src/app/[categorySlug]/[productSlug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, Package, Info, MessageCircle, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { StarRating } from '@/components/StarRating';
import { ReviewForm } from '@/components/ReviewForm';
import { RelatedProducts } from '@/components/RelatedProducts';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
function formatStockDisplay(stock: number): string {
  if (stock === 0) {
    return 'Wyprzedane';
  } else if (stock > 5) {
    return 'Na stanie: >5 SZT';
  } else {
    return `Na stanie: ${stock} szt`;
  }
}

interface ProductVariant {
  id: string;
  colorName?: string | null;
  colorCode?: string | null;
  sizeName?: string | null;
  stock: number;
  price?: number | null;
  imageUrl?: string | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    detailDescription: string | null;
    price: number;
    regularPrice?: number | null;
    stock: number;
    image: string | null;
    brand?: string | null;
    warranty?: string | null;
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showPriceGuarantee, setShowPriceGuarantee] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Get unique colors and sizes
  const colors = Array.from(new Set(product.variants?.filter(v => v.colorName).map(v => v.colorName))) as string[];
  const sizes = Array.from(new Set(product.variants?.filter(v => v.sizeName).map(v => v.sizeName))) as string[];
  
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;
  const hasVariants = product.variants && product.variants.length > 0;

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Update selected variant when color or size changes
  useEffect(() => {
    if (!hasVariants) return;

    if (hasColors && !hasSizes) {
      // Only colors
      const variant = product.variants?.find(v => v.colorName === selectedColor);
      setSelectedVariant(variant || null);
    } else if (hasSizes && !hasColors) {
      // Only sizes
      const variant = product.variants?.find(v => v.sizeName === selectedSize);
      setSelectedVariant(variant || null);
    } else if (hasColors && hasSizes) {
      // Both colors and sizes
      const variant = product.variants?.find(v => 
        v.colorName === selectedColor && v.sizeName === selectedSize
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedColor, selectedSize, product.variants, hasColors, hasSizes, hasVariants]);

  // Auto-select first available option
  useEffect(() => {
    if (hasColors && !selectedColor) {
      setSelectedColor(colors[0]);
    }
    if (hasSizes && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [colors, sizes, hasColors, hasSizes, selectedColor, selectedSize]);

  // Calculate effective price and stock
  const effectivePrice = selectedVariant?.price || product.price;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Get available sizes for selected color
  const getAvailableSizes = (color: string) => {
    return product.variants
      ?.filter(v => v.colorName === color && v.sizeName)
      .map(v => v.sizeName) || [];
  };

  // Get available colors for selected size
  const getAvailableColors = (size: string) => {
    return product.variants
      ?.filter(v => v.sizeName === size && v.colorName)
      .map(v => v.colorName) || [];
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

    // Create variant display name
    let variantDisplayName = '';
    if (selectedColor && selectedSize) {
      variantDisplayName = `${selectedColor} / ${selectedSize}`;
    } else if (selectedColor) {
      variantDisplayName = selectedColor;
    } else if (selectedSize) {
      variantDisplayName = selectedSize;
    }

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(effectivePrice),
        image: selectedVariant?.imageUrl || product.image,
        variantId: selectedVariant?.id,
        variantName: variantDisplayName,
        variantColor: selectedVariant?.colorCode || undefined,
        variantSize: selectedSize || undefined
      });
    }

    toast.success(`${quantity}x ${product.name} ${variantDisplayName ? `(${variantDisplayName})` : ''} dodano do koszyka!`);
    setQuantity(1);
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
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <ProductImageGallery images={galleryImages} productName={product.name} />
            
            {/* Detailed Description */}
            {product.detailDescription && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold mb-4 text-black">Szczegółowy opis</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.detailDescription }}
                />
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Basic Info Section */}
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mb-2">Marka: <span className="font-semibold">{product.brand}</span></p>
              )}
              
              {/* Rating */}
              {product.totalRatings !== undefined && product.totalRatings > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating 
                    rating={product.averageRating || 0} 
                    size="md"
                  />
                  <span className="text-gray-600">
                    {product.averageRating?.toFixed(1)} z 5 ({product.totalRatings} recenzji)
                  </span>
                </div>
              )}
            </div>
            
            {/* Add spacing between title section and the rest of content */}
            <div className="mt-8 space-y-6">
              {/* Product Description - Moved here */}
              {product.description && (
                <div 
                  className="text-gray-600 text-base prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
              {/* Price Section */}
              <div className="space-y-2">
                {product.regularPrice && product.regularPrice > product.price ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(Number(effectivePrice))}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                        -{calculateDiscount(Number(effectivePrice), product.regularPrice)}%
                      </span>
                    </div>
                    <p className="text-green-600 font-medium text-sm">
                      Oszczędzasz {formatPrice(product.regularPrice - Number(effectivePrice))}
                    </p>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-black">
                    {formatPrice(Number(effectivePrice))}
                  </div>
                )}
              </div>
              
              {/* Color Selection */}
              {hasColors && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black">Kolor</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                      const colorVariant = product.variants?.find(v => v.colorName === color);
                      const isAvailable = hasSizes 
                        ? getAvailableSizes(color).includes(selectedSize!)
                        : (colorVariant?.stock || 0) > 0;
                      
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border-2 transition flex items-center gap-2 ${
                            selectedColor === color
                              ? 'border-blue-600 bg-blue-50'
                              : isAvailable
                              ? 'border-gray-300 hover:border-gray-400'
                              : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {colorVariant?.colorCode && (
                            <span
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{ backgroundColor: colorVariant.colorCode }}
                            />
                          )}
                          <span className="text-black">{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Size Selection */}
              {hasSizes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black">Rozmiar</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const isAvailable = hasColors 
                        ? getAvailableColors(size).includes(selectedColor!)
                        : product.variants?.some(v => v.sizeName === size && v.stock > 0);
                      
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 min-w-[60px] rounded-lg border-2 transition ${
                            selectedSize === size
                              ? 'border-blue-600 bg-blue-50'
                              : isAvailable
                              ? 'border-gray-300 hover:border-gray-400'
                              : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-black font-medium">{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <Package className={effectiveStock > 0 ? 'text-green-600' : 'text-red-600'} size={20} />
                <div>
                  <span className={`font-semibold ${effectiveStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatStockDisplay(effectiveStock)}
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
              
              {/* Add to Cart Button - Updated Color */}
              <button
                onClick={handleAddToCart}
                disabled={effectiveStock === 0}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-3 ${
                  effectiveStock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'text-white'
                }`}
                style={effectiveStock > 0 ? { backgroundColor: '#8fb300' } : undefined}
                onMouseEnter={(e) => {
                  if (effectiveStock > 0) {
                    e.currentTarget.style.backgroundColor = '#7a9900';
                  }
                }}
                onMouseLeave={(e) => {
                  if (effectiveStock > 0) {
                    e.currentTarget.style.backgroundColor = '#8fb300';
                  }
                }}
              >
                <ShoppingCart size={24} />
                {effectiveStock === 0 ? 'Wyprzedane' : 'Dodaj do koszyka'}
              </button>
              
              {/* Price Guarantee and Warranty */}
              <div className="pt-6 relative">
                <div className="flex items-center gap-6 text-base">
                  {/* Price Guarantee - Fixed underline */}
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#2ca335' }}>✅</span>
                    <span style={{ color: '#2ca335' }} className="underline">Gwarancja najlepszej ceny</span>
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
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Darmowa wysyłka</h4>
                    <p className="text-xs text-gray-600">Już od zakupu 0 zł</p>
                  </div>
                  
                  {/* Free Returns */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <RotateCcw className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Bezpłatny zwrot</h4>
                    <p className="text-xs text-gray-600">Do 14 dni</p>
                  </div>
                  
                  {/* Reliable Shop */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <ShieldCheck className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Wiarygodny sklep</h4>
                    <p className="text-xs text-gray-600">100% bezpieczne zakupy</p>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black">
                    Recenzje ({reviews.length})
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showReviewForm ? 'Anuluj' : 'Napisz recenzję'}
                  </button>
                </div>
                
                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm 
                      productId={product.id} 
                      onSuccess={() => {
                        setShowReviewForm(false);
                        fetchReviews();
                        window.location.reload(); // Refresh to update rating
                      }} 
                    />
                  </div>
                )}
                
                {/* Display Reviews */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Brak recenzji. Bądź pierwszy!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {review.authorName && review.authorName !== 'Anonym' && (
                              <p className="font-semibold text-black mb-1">{review.authorName}</p>
                            )}
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 mt-2">{review.comment}</p>
                        )}
                      </div>
                    ))
                  )}
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
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Twoja wiadomość została wysłana!');
                  setShowContactForm(false);
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię i nazwisko
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon (opcjonalnie)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temat wiadomości
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={`Pytanie o produkt: ${product.name}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twoja wiadomość
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Napisz do nas swoje pytanie dotyczące tego produktu..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
                    >
                      Wyślij wiadomość
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
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
    </div>
  );
}