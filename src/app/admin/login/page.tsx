// src/app/admin/login/page.tsx
'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

interface LoginForm {
  password: string;
}

// Use the correct password from your documentation
const ADMIN_PASSWORD = 'O87TJpfbh2qtUqvzTGc0KjkioE2jZCGA';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const returnUrl = searchParams.get('returnUrl') || '/admin';
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  // Check if already authenticated via localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem('galaxy-admin-auth');
    if (isAuth === 'true') {
      router.push(returnUrl);
    }
  }, [router, returnUrl]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      // Simple client-side password check
      if (data.password === ADMIN_PASSWORD) {
        // Set auth in localStorage
        localStorage.setItem('galaxy-admin-auth', 'true');
        localStorage.setItem('galaxy-admin-auth-time', Date.now().toString());
        
        // Also try to set cookie via API
        await fetch('/api/admin/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        
        toast.success('Přihlášení úspěšné');
        router.push(returnUrl);
        router.refresh();
      } else {
        throw new Error('Nesprávné heslo');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nesprávné heslo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Admin přihlášení</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Heslo</label>
            <input
              type="password"
              {...register('password', { required: 'Heslo je povinné' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Zadejte admin heslo"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </form>
        
        <div className="text-sm text-gray-600 text-center mt-4 space-y-2">
          <p>Pro přístup do administrace kontaktujte správce</p>
          <p className="text-xs">Admin heslo: O87TJpfbh2qtUqvzTGc0KjkioE2jZCGA</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítání...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}