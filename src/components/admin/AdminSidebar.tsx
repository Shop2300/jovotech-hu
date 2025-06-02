// src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut,
  Store,
  Image as ImageIcon,
  Sparkles,
  FolderTree
} from 'lucide-react';
import toast from 'react-hot-toast';

const menuItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/categories',
    label: 'Kategorie',
    icon: FolderTree,
  },
  {
    href: '/admin/products',
    label: 'Produkty',
    icon: Package,
  },
  {
    href: '/admin/banners',
    label: 'Bannery',
    icon: ImageIcon,
  },
  {
    href: '/admin/feature-icons',
    label: 'Ikony funkcí',
    icon: Sparkles,
  },
  {
    href: '/admin/orders',
    label: 'Objednávky',
    icon: ShoppingCart,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Odhlášení úspěšné');
        router.push('/admin/login');
      }
    } catch (error) {
      toast.error('Chyba při odhlašování');
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Store className="w-8 h-8" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </Link>
      </div>
      
      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <LogOut size={20} />
          <span>Odhlásit se</span>
        </button>
      </div>
    </div>
  );
}