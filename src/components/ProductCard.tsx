// src/components/ProductCard.tsx
'use client';

import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  nameCs: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Produkt není skladem');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      nameCs: product.nameCs,
      price: product.price,
      image: product.image,
    });

    toast.success(`${product.nameCs} přidáno do košíku!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.nameCs} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <span className="text-gray-400">Obrázek produktu</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.nameCs}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded transition ${
              product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {product.stock === 0 ? 'Vyprodáno' : 'Do košíku'}
          </button>
        </div>
      </div>
    </div>
  );
}