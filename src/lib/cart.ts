// src/lib/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  regularPrice?: number; // Add regular price for discount display
  quantity: number;
  image: string | null;
  variantId?: string;
  variantName?: string; // This will now be "Czerwona / L" format
  variantColor?: string;
  variantSize?: string; // Add size
  categorySlug?: string; // Add category slug for navigation
  productSlug?: string; // Add product slug for navigation
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalSavings: () => number; // Add method to calculate total savings
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          // Check for existing item with same product ID and variant ID
          const existingItem = state.items.find((i) => 
            i.id === item.id && i.variantId === item.variantId
          );
          
          if (existingItem) {
            // If item exists with same variant, increase quantity
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          
          // Add new item with quantity 1
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      
      removeItem: (id, variantId) => {
        set((state) => ({
          items: state.items.filter((item) => 
            !(item.id === id && item.variantId === variantId)
          ),
        }));
      },
      
      updateQuantity: (id, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id, variantId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.variantId === variantId 
              ? { ...item, quantity } 
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('shopping-cart');
        }
      },
      
      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalSavings: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          if (item.regularPrice && item.regularPrice > item.price) {
            return total + ((item.regularPrice - item.price) * item.quantity);
          }
          return total;
        }, 0);
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);