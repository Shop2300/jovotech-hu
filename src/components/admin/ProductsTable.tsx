// src/components/admin/ProductsTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Edit, Trash, Image, Copy, Download, Upload, CheckSquare, Square, FolderOpen, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductImportModal } from './ProductImportModal';

interface Product {
  id: string;
  name: string;
  code?: string | null;
  price: number;
  regularPrice?: number | null;
  stock: number;
  image: string | null;
  brand?: string | null;
  warranty?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    images: number;
    variants: number;
  };
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductsTableProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

export function ProductsTable({ products: initialProducts, totalCount, currentPage, itemsPerPage }: ProductsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Bulk operations state
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkMoving, setIsBulkMoving] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Update products when props change
  useEffect(() => {
    setProducts(initialProducts);
    // Clear selection when products change
    setSelectedProducts(new Set());
  }, [initialProducts]);

  // Load categories when needed
  useEffect(() => {
    if (showCategoryModal && categories.length === 0) {
      fetchCategories();
    }
  }, [showCategoryModal]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ 
      limit: e.target.value,
      page: '1' // Reset to first page when changing items per page
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    
    const confirmMessage = `Opravdu chcete smazat ${selectedProducts.size} vybraných produktů? Tato akce je nevratná.`;
    if (!confirm(confirmMessage)) return;

    setIsBulkDeleting(true);
    try {
      const response = await fetch('/api/admin/products/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: Array.from(selectedProducts)
        }),
      });

      if (!response.ok) throw new Error('Failed to delete products');

      const result = await response.json();
      
      // Remove deleted products from the list
      setProducts(products.filter(p => !selectedProducts.has(p.id)));
      setSelectedProducts(new Set());
      
      toast.success(`${result.deletedCount} produktů bylo úspěšně smazáno`);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při mazání produktů');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkMove = async () => {
    if (selectedProducts.size === 0 || !selectedCategoryId) return;

    setIsBulkMoving(true);
    try {
      const response = await fetch('/api/admin/products/bulk-move', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          categoryId: selectedCategoryId === 'null' ? null : selectedCategoryId
        }),
      });

      if (!response.ok) throw new Error('Failed to move products');

      const result = await response.json();
      
      // Update products in the list
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      setProducts(products.map(p => {
        if (selectedProducts.has(p.id)) {
          return {
            ...p,
            category: selectedCategoryId === 'null' ? null : {
              id: selectedCategoryId,
              name: selectedCategory?.name || ''
            }
          };
        }
        return p;
      }));
      
      setSelectedProducts(new Set());
      setShowCategoryModal(false);
      setSelectedCategoryId('');
      
      toast.success(`${result.movedCount} produktů bylo přesunuto`);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při přesunu produktů');
    } finally {
      setIsBulkMoving(false);
    }
  };

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
      
      const blob = await response.blob();
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

  // Build category options hierarchy
  function buildCategoryOptions(cats: Category[], parentId: string | null = null, level: number = 0): React.ReactElement[] {
    const options: React.ReactElement[] = [];
    const children = cats.filter(cat => cat.parentId === parentId);
    
    children.forEach(category => {
      const prefix = '— '.repeat(level);
      options.push(
        <option key={category.id} value={category.id}>
          {prefix}{category.name}
        </option>
      );
      const subOptions = buildCategoryOptions(cats, category.id, level + 1);
      options.push(...subOptions);
    });
    
    return options;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div>
      {/* Bulk actions bar */}
      {selectedProducts.size > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-900">
              Vybráno: {selectedProducts.size} produktů
            </span>
            <button
              onClick={() => setSelectedProducts(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Zrušit výběr
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FolderOpen size={18} />
              Přesunout do kategorie
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={18} />
              {isBulkDeleting ? 'Mazání...' : 'Smazat vybrané'}
            </button>
          </div>
        </div>
      )}

      {/* Export, Import, and Items per page */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Zobrazeno {startItem}-{endItem} z {totalCount} produktů
          </span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Produktů na stránku:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
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
            {isExporting ? 'Exportování...' : `Exportovat (${totalCount} produktů)`}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {selectedProducts.size === products.length ? (
                    <CheckSquare size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
              </th>
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
                  <button
                    onClick={() => handleSelectProduct(product.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {selectedProducts.has(product.id) ? (
                      <CheckSquare size={20} />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    {product.image ? (
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                        <Image className="text-gray-400" size={20} />
                      </div>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="text-left hover:text-blue-600 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 hover:text-blue-600">{product.name}</div>
                    {product._count && product._count.variants > 0 && (
                      <div className="text-xs text-gray-500">
                        {product._count.variants} variant
                      </div>
                    )}
                  </button>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Předchozí
            </button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  disabled={page === '...'}
                  className={`px-3 py-2 rounded-lg ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : page === '...'
                      ? 'cursor-default'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Další
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Stránka {currentPage} z {totalPages}
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ProductImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Přesunout produkty do kategorie</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Vyberte kategorii:</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Vyberte kategorii --</option>
                <option value="null">Bez kategorie</option>
                {buildCategoryOptions(categories)}
              </select>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              Přesunout {selectedProducts.size} vybraných produktů
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setSelectedCategoryId('');
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Zrušit
              </button>
              <button
                onClick={handleBulkMove}
                disabled={!selectedCategoryId || isBulkMoving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isBulkMoving ? 'Přesouvám...' : 'Přesunout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}