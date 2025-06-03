// src/app/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

interface LoginForm {
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const returnUrl = searchParams.get('returnUrl') || '/admin';
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        if (response.ok) {
          // Already authenticated, redirect
          router.push(returnUrl);
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };
    checkAuth();
  }, [router, returnUrl]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Important for cookies
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Nesprávné heslo');
      }

      toast.success('Přihlášení úspěšné');
      // Use router.push instead of window.location for better SPA experience
      router.push(returnUrl);
      // Force a router refresh to ensure middleware rechecks auth
      router.refresh();
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
          <p className="text-xs">
            Session platnost: 7 dní
          </p>
        </div>
      </div>
    </div>
  );
}