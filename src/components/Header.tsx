// src/components/Header.tsx
import Link from 'next/link';
import { CartIcon } from './CartIcon';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Můj E-shop
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Domů
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
              Produkty
            </Link>
            <CartIcon />
          </nav>
        </div>
      </div>
    </header>
  );
}