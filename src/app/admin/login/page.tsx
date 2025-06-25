// src/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, just check the password directly
      const ADMIN_PASSWORD = 'O87TJpfbh2qtUqvzTGc0KjkioE2jZCGA';
      const ADMIN_TOKEN = 'd3a165840e65153fc24bf57c1228c1d927e16f2ff5122e72e2612b073d9749e2';
      
      if (password === ADMIN_PASSWORD) {
        // Store token in localStorage for API calls
        localStorage.setItem('adminToken', ADMIN_TOKEN);
        
        // Set the galaxy-admin-session cookie for middleware
        document.cookie = `galaxy-admin-session=${ADMIN_TOKEN}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        
        toast.success('Přihlášení úspěšné');
        router.push('/admin');
        router.refresh();
      } else {
        toast.error('Nesprávné heslo');
      }
    } catch (error) {
      toast.error('Chyba při přihlašování');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin přihlášení
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Galaxysklep.pl Admin Panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Heslo
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Zadejte heslo"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}