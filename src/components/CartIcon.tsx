'use client';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function CartIcon() {
  const router = useRouter();
  const { getTotalItems, getTotalPrice, getTotalSavings, updateQuantity, removeItem } = useCart();

  const [totalItems, setTotalItems] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const prevItemsRef = useRef(0);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const liveRegionId = useId();

  // Initial mount
  useEffect(() => {
    const items = getTotalItems();
    setTotalItems(items);
    prevItemsRef.current = items;
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [getTotalItems]);

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = (useCart as any).subscribe?.(() => {
      const newTotal = getTotalItems();

      if (newTotal > prevItemsRef.current) {
        setIsAnimating(true);
        if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
        animTimeoutRef.current = setTimeout(() => setIsAnimating(false), 600);
      } else if (newTotal !== prevItemsRef.current) {
        setIsAnimating(false);
      }

      setTotalItems(newTotal);
      prevItemsRef.current = newTotal;
    });
    return unsubscribe ?? (() => {});
  }, [getTotalItems]);

  // Close on outside click / Esc
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onClickOutside);
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [open]);

  const labelText =
    totalItems === 0 ? 'Kosár — üres' : `Kosár — ${totalItems} termék`;

  const handleEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpen(true);
    router.prefetch?.('/cart');
    router.prefetch?.('/checkout');
  };

  const handleLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  // Read items directly; re-renders via subscribe
  const { items } = (useCart as any).getState() as {
    items: {
      id: string;
      name: string;
      price: number;
      regularPrice?: number;
      quantity: number;
      image: string | null;
      variantId?: string;
      variantName?: string;
      variantColor?: string;
      variantSize?: string;
      categorySlug?: string;
      productSlug?: string;
    }[];
  };

  // REMOVED SLICE - SHOW ALL ITEMS
  const subtotal = getTotalPrice();
  const savings = getTotalSavings();

  const productHref = (it: (typeof items)[number]) => {
    if (it.categorySlug && it.productSlug) return `/${it.categorySlug}/${it.productSlug}`;
    if (it.productSlug) return `/product/${it.productSlug}`;
    return undefined;
  };

  const onDecrement = (it: (typeof items)[number]) => {
    setBusyId(it.id + (it.variantId ?? ''));
    updateQuantity(it.id, it.quantity - 1, it.variantId);
    setBusyId(null);
  };

  const onIncrement = (it: (typeof items)[number]) => {
    setBusyId(it.id + (it.variantId ?? ''));
    updateQuantity(it.id, it.quantity + 1, it.variantId);
    setBusyId(null);
  };

  const onRemove = (it: (typeof items)[number]) => {
    setBusyId(it.id + (it.variantId ?? ''));
    removeItem(it.id, it.variantId);
    setBusyId(null);
  };

  const discountPct = (price?: number, regular?: number) =>
    regular && regular > price! ? Math.round((1 - price! / regular) * 100) : 0;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href="/cart"
        className="relative group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6da306]/60 focus-visible:ring-offset-2"
        aria-label={labelText}
        onFocus={handleEnter}
        onBlur={handleLeave}
        data-testid="cart-icon"
      >
        {/* Live region for screen readers */}
        <span id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
          {labelText}
        </span>

        {/* Icon */}
        <div className="relative">
          <ShoppingBag
            aria-hidden="true"
            className="text-[#131921] w-7 h-7 md:w-8 md:h-8 transform-gpu transition-transform duration-200 motion-safe:group-hover:scale-105"
            strokeWidth={1.5}
          />

          {/* Badge */}
          {totalItems > 0 && (
            <div
              className={[
                'absolute -top-1.5 -right-1.5',
                'bg-[#6da306] text-white rounded-full ring-2 ring-white',
                'min-w-[20px] h-[20px] px-0 flex items-center justify-center',
                'text-xs font-semibold',
                'transform-gpu transition-transform duration-500',
                isAnimating ? 'motion-safe:scale-110 motion-safe:animate-bounce' : 'scale-100',
              ].join(' ')}
              aria-hidden="true"
              style={{
                paddingLeft: totalItems > 9 ? 5 : 0,
                paddingRight: totalItems > 9 ? 5 : 0,
              }}
            >
              {totalItems > 99 ? '99+' : totalItems}
              <span
                className={isAnimating
                  ? 'absolute inset-0 -z-10 rounded-full bg-[#6da306]/40 motion-safe:animate-ping'
                  : 'hidden'}
              />
            </div>
          )}
        </div>

        {/* Text label */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm text-gray-500 leading-tight">Kosár</span>
          <span className="text-base font-semibold text-[#131921] leading-tight">
            {totalItems === 0 ? 'üres' : `${totalItems} termék`}
          </span>
        </div>

        {/* Hover underline accent */}
        <div
          className={[
            'absolute bottom-0 left-1/2 -translate-x-1/2',
            'h-0.5 bg-[#6da306] transition-all duration-300',
            totalItems > 0 ? 'w-0 group-hover:w-9' : 'w-0',
          ].join(' ')}
          aria-hidden="true"
        />
      </Link>

      {/* Bigger mini-cart popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Kosár előnézet"
          className="absolute right-0 mt-2 w-[380px] sm:w-[420px] rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 z-50 p-4"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {totalItems === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-6 w-6 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">A kosár üres.</p>
            </div>
          ) : (
            <>
              {/* UPDATED SCROLLABLE CONTAINER */}
              <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2">
                <ul className="divide-y divide-gray-100">
                  {items.map((it) => {
                    const href = productHref(it);
                    const pct = discountPct(it.price, it.regularPrice);
                    const lineRegular = it.regularPrice ? it.regularPrice * it.quantity : 0;
                    const lineDiscounted = it.price * it.quantity;

                    return (
                      <li key={it.id + (it.variantId ?? '')} className="py-4 flex gap-3">
                        <div className="h-16 w-16 sm:h-18 sm:w-18 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={it.image ?? '/favicon-32x32.png'}
                            alt={it.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            {href ? (
                              <Link href={href} className="block truncate text-sm font-medium text-[#131921] hover:underline">
                                {it.name}
                              </Link>
                            ) : (
                              <div className="truncate text-sm font-medium text-[#131921]">{it.name}</div>
                            )}
                            {pct > 0 && (
                              <span className="shrink-0 rounded-md bg-[#6da306]/10 text-[#6da306] text-[10px] px-1.5 py-0.5 font-semibold">
                                −{pct}%
                              </span>
                            )}
                          </div>

                          {it.variantName && (
                            <div className="text-xs text-gray-500 truncate mt-0.5">{it.variantName}</div>
                          )}

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onDecrement(it)}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
                              aria-label="Mennyiség csökkentése"
                              disabled={busyId === it.id + (it.variantId ?? '') || it.quantity <= 1}
                            >
                              {busyId === it.id + (it.variantId ?? '') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Minus className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <span className="w-7 text-center text-sm tabular-nums">{it.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onIncrement(it)}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
                              aria-label="Mennyiség növelése"
                              disabled={busyId === it.id + (it.variantId ?? '')}
                            >
                              {busyId === it.id + (it.variantId ?? '') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Plus className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* ICON-ONLY REMOVE BUTTON */}
                            <button
                              type="button"
                              onClick={() => onRemove(it)}
                              className="ml-2 h-7 w-7 inline-flex items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                              aria-label="Tétel eltávolítása"
                              disabled={busyId === it.id + (it.variantId ?? '')}
                            >
                              {busyId === it.id + (it.variantId ?? '') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Unit price with discount info */}
                          <div className="mt-1 text-xs text-gray-600">
                            {it.quantity}×{' '}
                            {it.regularPrice && it.regularPrice > it.price ? (
                              <>
                                <span className="line-through text-gray-400">{formatPrice(it.regularPrice)}</span>{' '}
                                <span className="font-medium text-[#131921]">{formatPrice(it.price)}</span>
                              </>
                            ) : (
                              <span className="font-medium text-[#131921]">{formatPrice(it.price)}</span>
                            )}
                          </div>
                        </div>

                        {/* Line totals including discount */}
                        <div className="text-right">
                          {it.regularPrice && it.regularPrice > it.price ? (
                            <div className="text-[11px] text-gray-400 line-through">
                              {formatPrice(lineRegular)}
                            </div>
                          ) : null}
                          <div className="text-sm font-semibold text-[#131921]">
                            {formatPrice(lineDiscounted)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Totals + actions */}
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Részösszeg</span>
                  {/* Bigger subtotal value */}
                  <span className="text-lg md:text-xl font-semibold text-[#131921]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#6da306]">
                    <span>Megtakarítás</span>
                    <span className="font-semibold">{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-1">
                  <Link
                    href="/cart"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-[#131921] hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Kosár
                  </Link>
                  {/* Subtle animated arrow on hover */}
                  <Link
                    href="/checkout"
                    className="group inline-flex items-center justify-center rounded-lg bg-[#6da306] px-3.5 py-2 text-sm font-semibold text-white hover:brightness-110"
                    onClick={() => setOpen(false)}
                  >
                    <span>Pénztár</span>
                    <ChevronRight
                      className="ml-1.5 h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}