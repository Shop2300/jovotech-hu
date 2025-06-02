// src/lib/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  variantId?: string;
  variantName?: string; // This will now be "Červená / L" format
  variantColor?: string;
  variantSize?: string; // Add size
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
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
    }),
    {
      name: 'shopping-cart',
    }
  )
);