// src/components/admin/AdminSidebar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Package, 
  ShoppingCart, 
  LogOut,
  Store,
  FolderTree,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const menuItems = [
  {
    href: '/admin/orders',
    label: 'Objednávky',
    icon: ShoppingCart,
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
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Close menu when switching from mobile to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu on route change (mobile)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle swipe to close on mobile
  useEffect(() => {
    if (!isMobileMenuOpen || !isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      // Swipe left to close (from right to left)
      if (touchStartX - touchEndX > 50) {
        setIsMobileMenuOpen(false);
      }
    };

    const sidebar = document.getElementById('mobile-sidebar');
    if (sidebar) {
      sidebar.addEventListener('touchstart', handleTouchStart);
      sidebar.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        sidebar.removeEventListener('touchstart', handleTouchStart);
        sidebar.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobileMenuOpen, isMobile]);
  
  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('adminToken');
      
      // Clear cookie
      document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Call logout endpoint to clear server-side cookie
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Odhlášení úspěšné');
        router.push('/admin/login');
        router.refresh();
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      // Even if the API call fails, we've already cleared local storage
      // So redirect anyway
      toast.success('Odhlášení úspěšné');
      router.push('/admin/login');
      router.refresh();
    }
  };

  // Mobile Header with Hamburger Menu
  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4">
        <Link href="/admin/orders" className="flex items-center gap-2">
          <Store className="w-6 h-6" />
          <span className="text-lg font-bold">Admin Panel</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );

  // Sidebar Content (shared between mobile and desktop)
  const SidebarContent = () => (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block p-6">
        <Link href="/admin/orders" className="flex items-center gap-2">
          <Store className="w-8 h-8" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </Link>
      </div>

      {/* Mobile Header in Drawer */}
      <div className="lg:hidden p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <Link href="/admin/orders" className="flex items-center gap-2">
            <Store className="w-8 h-8" />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 lg:py-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition min-h-[48px] ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-base lg:text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800 lg:absolute lg:bottom-0 lg:w-64">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700 transition min-h-[48px]"
        >
          <LogOut size={20} />
          <span className="text-base lg:text-sm">Odhlásit se</span>
        </button>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white min-h-screen relative">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-sidebar"
        className={`
          lg:hidden fixed top-0 left-0 h-full w-72 sm:w-80 bg-gray-900 text-white z-50
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          safe-top safe-bottom
        `}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile Spacer - to push content below fixed header */}
      <div className="lg:hidden h-14" />
    </>
  );
}