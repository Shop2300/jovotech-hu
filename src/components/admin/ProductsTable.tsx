// src/components/admin/ProductsTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Edit, Trash, Image, Copy, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductImportModal } from './ProductImportModal';

interface Product {
  id: string;
  name: string;
  code?: string | null;  // Add code field
  price: number;
  regularPrice?: number | null;
  stock: number;
  image: string | null;
  brand?: string | null;
  warranty?: string | null;
  category?: {
    id: string;
    name: string;  // Changed from nameCs to name
  } | null;
  _count?: {
    images: number;
    variants: number;
  };
}

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Update products when props change (important for filtering)
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento produkt?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setProducts(products.filter(p => p.id !== id));
      toast.success('Produkt byl smazán');
      router.refresh();
    } catch (error) {
      toast.error('Chyba při mazání produktu');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setDuplicatingId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to duplicate');

      const newProduct = await response.json();
      
      toast.success('Produkt byl zduplikován');
      router.push(`/admin/products/${newProduct.id}/edit`);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při duplikování produktu');
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Build URL with current filters
      const params = new URLSearchParams();
      const categoryId = searchParams.get('category');
      const searchTerm = searchParams.get('search');
      
      if (categoryId) {
        params.append('category', categoryId);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/admin/products/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `produkty-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Export produktů byl úspěšně dokončen');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Chyba při exportu produktů');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportComplete = () => {
    setIsImportModalOpen(false);
    router.refresh();
  };

  return (
    <div>
      {/* Export and Import buttons */}
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <Upload size={20} />
          Importovat produkty
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting || products.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          {isExporting ? 'Exportování...' : `Exportovat (${products.length} produktů)`}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Obrázek
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Název
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kód
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Značka
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skladem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akce
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {product.image ? (
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                      <Image className="text-gray-400" size={20} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  {product._count && product._count.variants > 0 && (
                    <div className="text-xs text-gray-500">
                      {product._count.variants} variant
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 font-mono">
                    {product.code || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {product.brand || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {product.category?.name || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} ks
                  </span>
                  {product._count && product._count.variants > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      + ve variantách
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Upravit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(product.id)}
                      disabled={duplicatingId === product.id}
                      className="text-green-600 hover:text-green-800 disabled:opacity-50"
                      title="Duplikovat"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Smazat"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Žádné produkty nenalezeny
          </div>
        )}
      </div>

      {/* Import Modal */}
      <ProductImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}