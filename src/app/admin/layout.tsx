// src/app/admin/layout.tsx
'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // If it's the login page, render without sidebar
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        {children}
      </div>
    );
  }

  // Otherwise, render with sidebar
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster 
        position="top-right" 
        toastOptions={{
          // Mobile-friendly toast options
          style: {
            maxWidth: '90vw',
            fontSize: '14px',
          },
          className: 'sm:max-w-md',
        }}
      />
      <div className="flex flex-col lg:flex-row min-h-screen">
        <AdminSidebar />
        <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
          {/* Mobile: smaller padding, Desktop: regular padding */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Additional wrapper to prevent horizontal overflow on mobile */}
            <div className="max-w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}