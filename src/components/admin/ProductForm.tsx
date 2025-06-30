// src/components/admin/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { Plus, Trash2, Code2, X, Link2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import { createPortal } from 'react-dom';
import { createSlug } from '@/lib/slug';

// Custom extension to preserve HTML attributes
const PreserveAttributes = Extension.create({
  name: 'preserveAttributes',
  
  addGlobalAttributes() {
    return [
      {
        types: ['bulletList', 'orderedList', 'listItem', 'paragraph'],
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              if (!attributes.class) {
                return {};
              }
              return { class: attributes.class };
            },
          },
        },
      },
    ];
  },
});

// HTML Editor Modal Component
function HtmlEditorModal({ isOpen, onClose, content, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (html: string) => void;
}) {
  const [htmlContent, setHtmlContent] = useState('');
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Create portal container
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setPortalContainer(document.body);
    }
  }, []);

  // Update HTML content when modal opens or content changes
  useEffect(() => {
    if (isOpen) {
      // Decode HTML entities to show raw HTML
      const textarea = document.createElement('textarea');
      textarea.innerHTML = content;
      setHtmlContent(textarea.value);
    }
  }, [isOpen, content]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Add pointer-events none to all tiptap editors
      const editors = document.querySelectorAll('.ProseMirror');
      editors.forEach(editor => {
        (editor as HTMLElement).style.pointerEvents = 'none';
      });
    } else {
      document.body.style.overflow = 'unset';
      // Restore pointer events
      const editors = document.querySelectorAll('.ProseMirror');
      editors.forEach(editor => {
        (editor as HTMLElement).style.pointerEvents = 'auto';
      });
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      const editors = document.querySelectorAll('.ProseMirror');
      editors.forEach(editor => {
        (editor as HTMLElement).style.pointerEvents = 'auto';
      });
    };
  }, [isOpen]);

  if (!isOpen || !portalContainer) return null;

  const handleSave = () => {
    onSave(htmlContent);
    onClose();
  };

  const modalContent = (
    <>
      {/* Full screen overlay that blocks everything */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-95" 
        style={{ 
          zIndex: 9999999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4" 
        style={{ 
          zIndex: 10000000,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        onClick={(e) => {
          // Prevent clicks from going through
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-2xl" style={{ isolation: 'isolate' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">HTML Editor</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <p className="text-sm text-gray-600 mb-3">
              Upravte HTML kód přímo. Změny se projeví po uložení.
            </p>
            
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="flex-1 w-full p-4 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              style={{ minHeight: '400px' }}
              spellCheck={false}
            />
            
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Uložit změny
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, portalContainer);
}

// Simplified Tiptap Editor Component
function TiptapEditor({ value, onChange, placeholder, height = '200px' }: { 
  value: string | null; 
  onChange: (value: string) => void; 
  placeholder?: string;
  height?: string;
}) {
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        paragraph: {
          HTMLAttributes: {},
        },
        listItem: { HTMLAttributes: {} },
      }),
      PreserveAttributes,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2',
      },
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  const handleHtmlSave = (newHtml: string) => {
    if (editor) {
      editor.commands.setContent(newHtml);
      onChange(newHtml);
    }
  };

  const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="border rounded-lg">
        <div className="border-b p-2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Tučné"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Podtržené"
          >
            <u>U</u>
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={addLink}
            className={`px-3 py-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Přidat odkaz"
          >
            🔗
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              className="px-3 py-1 rounded hover:bg-gray-100 text-red-600"
              title="Odstranit odkaz"
            >
              🔗✕
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setShowHtmlModal(true)}
            className="px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
            title="HTML Editor"
          >
            <Code2 size={16} />
            HTML
          </button>
        </div>
        <div 
          className="relative"
          style={{ minHeight: height }}
        >
          <EditorContent 
            editor={editor} 
            className="focus:outline-none"
          />
          {!editor.getText() && (
            <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>
      </div>
      
      <HtmlEditorModal
        isOpen={showHtmlModal}
        onClose={() => setShowHtmlModal(false)}
        content={editor.getHTML()}
        onSave={handleHtmlSave}
      />
    </>
  );
}

// Rest of the component interfaces and types
interface ProductImage {
  id?: string;
  url: string;
  order: number;
  alt?: string;
}

interface ProductVariant {
  id?: string;
  colorName?: string;
  colorCode?: string;
  sizeName?: string;
  sizeOrder?: number;
  stock: number;
  price?: number;
  regularPrice?: number; // NEW FIELD ADDED
  imageUrl?: string;
  order: number;
}

interface ProductFormData {
  name: string;
  code?: string;
  slug?: string;
  description: string | null;
  detailDescription: string | null;
  price: number;
  regularPrice: number | null;
  stock: number;
  categoryId: string | null;
  brand: string | null;
  warranty: string | null;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductFormProps {
  initialData?: ProductFormData & { 
    id: string; 
    image: string | null;
    images?: ProductImage[];
    variants?: ProductVariant[];
  };
}

// Common sizes for quick selection
const COMMON_SIZES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  universal: ['Univerzální']
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantType, setVariantType] = useState<'color' | 'size' | 'both'>('color');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [description, setDescription] = useState(initialData?.description || '');
  const [detailDescription, setDetailDescription] = useState(initialData?.detailDescription || '');
  const [generatedSlug, setGeneratedSlug] = useState(initialData?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [originalName, setOriginalName] = useState(initialData?.name || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProductFormData>({
    defaultValues: initialData || {
      name: '',
      code: '',
      slug: '',
      description: '',
      detailDescription: '',
      price: 0,
      regularPrice: null,
      stock: 0,
      categoryId: null,
      brand: null,
      warranty: null,
    }
  });

  const watchedName = watch('name');

  // Generate slug from name
  useEffect(() => {
    // Only auto-generate slug if:
    // 1. Creating new product OR
    // 2. Editing existing product and name changed AND slug wasn't manually edited
    if (!initialData || (initialData && watchedName !== originalName && !isSlugManuallyEdited)) {
      if (watchedName) {
        const newSlug = createSlug(watchedName);
        setGeneratedSlug(newSlug);
        setValue('slug', newSlug);
      }
    }
  }, [watchedName, initialData, originalName, isSlugManuallyEdited, setValue]);

  // Update form values when editors change
  useEffect(() => {
    setValue('description', description);
  }, [description, setValue]);

  useEffect(() => {
    setValue('detailDescription', detailDescription);
  }, [detailDescription, setValue]);

  // Initialize data
  useEffect(() => {
    if (initialData) {
      if (initialData.images && initialData.images.length > 0) {
        setProductImages(initialData.images);
      } else if (initialData.image) {
        setProductImages([{ 
          url: initialData.image, 
          order: 0,
          alt: initialData.name 
        }]);
      }
      
      if (initialData.variants) {
        setVariants(initialData.variants);
        // Detect variant type from existing data
        const hasColors = initialData.variants.some(v => v.colorName);
        const hasSizes = initialData.variants.some(v => v.sizeName);
        if (hasColors && hasSizes) setVariantType('both');
        else if (hasSizes) setVariantType('size');
        else setVariantType('color');
      }

      // Set the slug if editing
      if (initialData.slug) {
        setGeneratedSlug(initialData.slug);
        setValue('slug', initialData.slug);
      } else {
        // Generate slug if missing
        const newSlug = createSlug(initialData.name);
        setGeneratedSlug(newSlug);
        setValue('slug', newSlug);
      }
    }
  }, [initialData, setValue]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched categories:', data);
          setCategories(data);
        } else {
          console.error('Failed to fetch categories:', response.status);
          toast.error('Nepodařilo se načíst kategorie');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Chyba při načítání kategorií');
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

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

  const addVariant = () => {
    const newVariant: ProductVariant = {
      colorName: variantType !== 'size' ? '' : undefined,
      colorCode: '',
      sizeName: variantType !== 'color' ? '' : undefined,
      sizeOrder: variants.length,
      stock: 0,
      price: undefined,
      regularPrice: undefined, // NEW FIELD
      imageUrl: '',
      order: variants.length
    };
    setVariants([...variants, newVariant]);
  };

  const addMultipleSizes = (sizes: string[]) => {
    const newVariants: ProductVariant[] = sizes.map((size, index) => ({
      sizeName: size,
      sizeOrder: variants.length + index,
      stock: 0,
      price: undefined,
      regularPrice: undefined, // NEW FIELD
      imageUrl: '',
      order: variants.length + index
    }));
    setVariants([...variants, ...newVariants]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (productImages.length === 0) {
      toast.error('Přidejte alespoň jeden obrázek produktu');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = initialData 
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const mainImage = productImages.find(img => img.order === 0)?.url || productImages[0]?.url;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          code: data.code && data.code.trim() !== '' ? data.code : null,
          slug: data.slug || generatedSlug, // Use the generated slug
          image: mainImage,
          images: productImages,
          variants: variants.filter(v => v.colorName || v.sizeName),
          categoryId: data.categoryId || null,
          regularPrice: data.regularPrice || null,
          brand: data.brand || null,
          warranty: data.warranty || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to save product');

      toast.success(initialData ? 'Produkt byl aktualizován' : 'Produkt byl přidán');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error('Chyba při ukládání produktu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      {/* Name and Code - Adjusted grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          <label className="block text-sm font-medium mb-2 text-black">Název *</label>
          <input
            {...register('name', { required: 'Název je povinný' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="col-span-12 md:col-span-3">
          <label className="block text-sm font-medium mb-2 text-black">Kód produktu</label>
          <input
            {...register('code')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Auto ID"
          />
        </div>
      </div>

      {/* URL/Slug field */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">
          <Link2 className="inline w-4 h-4 mr-1" />
          URL adresa produktu
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">www.galaxysklep.pl/</span>
          <input
            {...register('slug')}
            value={generatedSlug}
            onChange={(e) => {
              const newSlug = e.target.value.toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
              setGeneratedSlug(newSlug);
              setValue('slug', newSlug);
              setIsSlugManuallyEdited(true);
            }}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="automaticky-generovano-z-nazvu"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          URL se generuje automaticky z názvu produktu. Můžete ji upravit ručně.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium mb-2 text-black">Kategorie</label>
          {isLoadingCategories ? (
            <div className="w-full px-3 py-2 border rounded-lg bg-gray-100">
              Načítání kategorií...
            </div>
          ) : (
            <select
              {...register('categoryId')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Bez kategorie</option>
              {categories.length > 0 ? (
                buildCategoryOptions(categories)
              ) : (
                <option disabled>Žádné kategorie nenalezeny</option>
              )}
            </select>
          )}
        </div>
        
        <div className="col-span-12 md:col-span-3">
          <label className="block text-sm font-medium mb-2 text-black">Značka</label>
          <input
            {...register('brand')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="např. Nike, Adidas..."
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <label className="block text-sm font-medium mb-2 text-black">Záruka</label>
          <input
            {...register('warranty')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="např. 24 měsíců..."
          />
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">Krátký popis</label>
        <TiptapEditor
          value={description}
          onChange={setDescription}
          placeholder="Stručný popis produktu pro výpis..."
          height="150px"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">Detailní popis</label>
        <TiptapEditor
          value={detailDescription}
          onChange={setDetailDescription}
          placeholder="Podrobný popis produktu, specifikace, vlastnosti..."
          height="300px"
        />
      </div>
      
      {/* Price and Stock in one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Základní cena (Kč) *</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { 
              required: 'Cena je povinná',
              min: { value: 0, message: 'Cena musí být kladná' }
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Běžná cena (Kč)</label>
          <input
            type="number"
            step="0.01"
            {...register('regularPrice', {
              min: { value: 0, message: 'Cena musí být kladná' }
            })}
            placeholder="Nepovinné"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.regularPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.regularPrice.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Základní skladem (ks) *</label>
          <input
            type="number"
            {...register('stock', { 
              required: 'Počet kusů je povinný',
              min: { value: 0, message: 'Počet musí být nezáporný' }
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <MultiImageUpload
          productId={initialData?.id}
          value={productImages}
          onChange={setProductImages}
          // Removed maxImages={10} to allow unlimited images (defaults to 999)
        />
      </div>
      
      {/* Variants Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Varianty produktu</h3>
          <div className="flex gap-2">
            <select
              value={variantType}
              onChange={(e) => setVariantType(e.target.value as 'color' | 'size' | 'both')}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="color">Pouze barvy</option>
              <option value="size">Pouze velikosti</option>
              <option value="both">Barvy a velikosti</option>
            </select>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Přidat variantu
            </button>
          </div>
        </div>

        {/* Quick size buttons */}
        {variantType !== 'color' && variants.length === 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2 text-black">Rychlé přidání velikostí:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addMultipleSizes(COMMON_SIZES.clothing)}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
              >
                Oblečení (XS-XXL)
              </button>
              <button
                type="button"
                onClick={() => addMultipleSizes(COMMON_SIZES.shoes)}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
              >
                Boty (36-45)
              </button>
              <button
                type="button"
                onClick={() => addMultipleSizes(COMMON_SIZES.universal)}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm"
              >
                Univerzální
              </button>
            </div>
          </div>
        )}
        
        {variants.length > 0 && (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-12 gap-3">
                  {variantType !== 'size' && (
                    <>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium mb-1 text-black">Barva</label>
                        <input
                          type="text"
                          value={variant.colorName || ''}
                          onChange={(e) => updateVariant(index, 'colorName', e.target.value)}
                          placeholder="např. Červená"
                          className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1 text-black">Kód barvy</label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={variant.colorCode || ''}
                            onChange={(e) => updateVariant(index, 'colorCode', e.target.value)}
                            placeholder="#FF0000"
                            className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <input
                            type="color"
                            value={variant.colorCode || '#000000'}
                            onChange={(e) => updateVariant(index, 'colorCode', e.target.value)}
                            className="w-10 h-10 border rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {variantType !== 'color' && (
                    <div className={variantType === 'size' ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-sm font-medium mb-1 text-black">Velikost</label>
                      <input
                        type="text"
                        value={variant.sizeName || ''}
                        onChange={(e) => updateVariant(index, 'sizeName', e.target.value)}
                        placeholder="M"
                        className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}
                  
                  <div className={variantType === 'both' ? 'col-span-1' : variantType === 'size' ? 'col-span-2' : 'col-span-2'}>
                    <label className="block text-sm font-medium mb-1 text-black">Skladem</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                      className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className={variantType === 'both' ? 'col-span-2' : 'col-span-3'}>
                    <label className="block text-sm font-medium mb-1 text-black">Cena (prázdné = základní)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price || ''}
                      onChange={(e) => updateVariant(index, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="Základní cena"
                      className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className={variantType === 'both' ? 'col-span-2' : 'col-span-3'}>
                    <label className="block text-sm font-medium mb-1 text-black">Běžná cena (Kč)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.regularPrice || ''}
                      onChange={(e) => updateVariant(index, 'regularPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="Nepovinné"
                      className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Odstranit variantu"
                    >
                      <Trash2 size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {variants.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Žádné varianty. Klikněte na "Přidat variantu" pro vytvoření.
          </p>
        )}
      </div>
      
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            isSubmitting 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Ukládám...' : (initialData ? 'Aktualizovat' : 'Přidat produkt')}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 border rounded-lg hover:bg-white transition"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}