// src/components/admin/ProductForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { Plus, Trash2, Code2, X, Link2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { createPortal } from 'react-dom';
import { createSlug } from '@/lib/slug';
import DOMPurify from 'dompurify';

// HTML Preview Modal Component
function HtmlPreviewModal({ isOpen, onClose, content }: {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}) {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999]" 
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Náhled HTML</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto border rounded-lg p-4 bg-gray-50">
            <div 
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// Enhanced HTML Editor Modal Component
function HtmlEditorModal({ isOpen, onClose, content, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (html: string) => void;
}) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setHtmlContent(content);
    }
  }, [isOpen, content]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(htmlContent);
    onClose();
  };

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-95 z-[9999]" 
        onClick={onClose}
      />
      
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 z-[10000]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl h-[95vh] flex flex-col">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="flex-1 w-full p-4 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            style={{ minHeight: '85vh' }}
            spellCheck={false}
            placeholder='Vložte nebo napište HTML kód zde...'
            autoFocus
          />
          
          <div className="flex gap-3 mt-4 justify-center">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Uložit změny
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 transition"
            >
              Zrušit
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// Enhanced Raw HTML Editor Component with editable preview
function RawHtmlEditor({ value, onChange, placeholder, height = '200px' }: { 
  value: string | null; 
  onChange: (value: string) => void; 
  placeholder?: string;
  height?: string;
}) {
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Update active formats when selection changes
  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveFormats);
    return () => {
      document.removeEventListener('selectionchange', updateActiveFormats);
    };
  }, []);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleHtmlSave = (newHtml: string) => {
    setLocalValue(newHtml);
    onChange(newHtml);
  };

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML;
      setLocalValue(newContent);
      onChange(newContent);
      updateActiveFormats();
    }
  };

  // Check if content is truly empty
  const isContentEmpty = (content: string) => {
    const emptyPatterns = ['', '<br>', '<p><br></p>', '<div><br></div>', '<p></p>', '<div></div>'];
    return !content || emptyPatterns.includes(content.trim()) || content.trim().replace(/<[^>]*>/g, '') === '';
  };

  const hasContent = !isContentEmpty(localValue);

  // Focus handler to clear placeholder
  const handleFocus = () => {
    if (!hasContent && contentEditableRef.current) {
      contentEditableRef.current.innerHTML = '';
    }
  };

  // Blur handler to show placeholder if empty
  const handleBlur = () => {
    if (contentEditableRef.current) {
      const content = contentEditableRef.current.innerHTML;
      if (isContentEmpty(content)) {
        contentEditableRef.current.innerHTML = '';
      }
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    if (text) {
      document.execCommand('insertHTML', false, text);
      handleContentChange();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          break;
      }
    }
  };

  useEffect(() => {
    if (contentEditableRef.current && localValue !== contentEditableRef.current.innerHTML) {
      // Only update if content is different to avoid cursor jump
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const startOffset = range?.startOffset || 0;
      
      contentEditableRef.current.innerHTML = localValue;
      
      // Restore cursor position if possible
      if (range && contentEditableRef.current.firstChild) {
        try {
          const newRange = document.createRange();
          newRange.setStart(contentEditableRef.current.firstChild, Math.min(startOffset, contentEditableRef.current.textContent?.length || 0));
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        } catch (e) {
          // Ignore errors when restoring cursor
        }
      }
    }
  }, [localValue]);

  // Format text with execCommand
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
    handleContentChange();
    setTimeout(updateActiveFormats, 10); // Small delay to ensure state is updated
  };

  return (
    <>
      <div className="border rounded-lg">
        <div className="border-b p-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); formatText('bold'); }}
                className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition ${
                  activeFormats.bold ? 'bg-blue-100 border-blue-300' : 'bg-white'
                }`}
                title="Tučné (Ctrl+B)"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); formatText('italic'); }}
                className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition ${
                  activeFormats.italic ? 'bg-blue-100 border-blue-300' : 'bg-white'
                }`}
                title="Kurzíva (Ctrl+I)"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); formatText('underline'); }}
                className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition ${
                  activeFormats.underline ? 'bg-blue-100 border-blue-300' : 'bg-white'
                }`}
                title="Podtržené (Ctrl+U)"
              >
                <u>U</u>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowHtmlModal(true)}
              className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition"
            >
              <Code2 size={16} />
              HTML Editor
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={contentEditableRef}
            contentEditable
            onInput={handleContentChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onClick={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            className="p-4 overflow-auto prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg min-h-[150px]"
            style={{ minHeight: height }}
            suppressContentEditableWarning={true}
          />
          {!hasContent && (
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
              {placeholder || 'Začněte psát nebo použijte tlačítka výše pro formátování textu. Pro pokročilé úpravy použijte HTML Editor.'}
            </div>
          )}
        </div>
      </div>

      <HtmlEditorModal
        isOpen={showHtmlModal}
        onClose={() => setShowHtmlModal(false)}
        content={localValue}
        onSave={handleHtmlSave}
      />
    </>
  );
}

// Simplified Tiptap Editor Component
function TiptapEditor({ value, onChange, placeholder, height = '200px', useRawHtml = false }: { 
  value: string | null; 
  onChange: (value: string) => void; 
  placeholder?: string;
  height?: string;
  useRawHtml?: boolean;
}) {
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // If using raw HTML mode, return the simple editor
  if (useRawHtml) {
    return <RawHtmlEditor value={value} onChange={onChange} placeholder={placeholder} height={height} />;
  }
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
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
    immediatelyRender: false, // Fix SSR warning
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2',
      },
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
        <div className="border-b p-2 flex items-center gap-1 flex-wrap">
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
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Kurzíva"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Podtržené"
          >
            <u>U</u>
          </button>
          <div className="w-px bg-gray-300 mx-1 h-6" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Odrážkový seznam"
          >
            • —
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Číslovaný seznam"
          >
            1. —
          </button>
          <div className="w-px bg-gray-300 mx-1 h-6" />
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
            onClick={() => setShowPreview(true)}
            className="px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
            title="Náhled"
          >
            Náhled
          </button>
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
      
      <HtmlPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={editor.getHTML()}
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
  regularPrice?: number;
  imageUrl?: string;
  order: number;
  variantName?: string; // NEW: For random variant type
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
  availability: string; // NEW FIELD
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

const COMMON_SIZES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  universal: ['Univerzální']
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantType, setVariantType] = useState<'color' | 'size' | 'both' | 'random'>('color');
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
      availability: 'in_stock', // NEW FIELD DEFAULT
    }
  });

  const watchedName = watch('name');

  // Generate slug from name
  useEffect(() => {
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
        const hasColors = initialData.variants.some(v => v.colorName);
        const hasSizes = initialData.variants.some(v => v.sizeName);
        const hasVariantNames = initialData.variants.some(v => v.variantName);
        
        if (hasVariantNames) setVariantType('random');
        else if (hasColors && hasSizes) setVariantType('both');
        else if (hasSizes) setVariantType('size');
        else setVariantType('color');
      }

      if (initialData.slug) {
        setGeneratedSlug(initialData.slug);
        setValue('slug', initialData.slug);
      } else {
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
          setCategories(data);
        } else {
          toast.error('Nepodařilo se načíst kategorie');
        }
      } catch (error) {
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
      colorName: variantType === 'color' || variantType === 'both' ? '' : undefined,
      colorCode: variantType === 'color' || variantType === 'both' ? '' : undefined,
      sizeName: variantType === 'size' || variantType === 'both' ? '' : undefined,
      sizeOrder: variants.length,
      stock: 0,
      price: undefined,
      regularPrice: undefined,
      imageUrl: '',
      order: variants.length,
      variantName: variantType === 'random' ? '' : undefined,
    };
    setVariants([...variants, newVariant]);
  };

  const addMultipleSizes = (sizes: string[]) => {
    const newVariants: ProductVariant[] = sizes.map((size, index) => ({
      sizeName: size,
      sizeOrder: variants.length + index,
      stock: 0,
      price: undefined,
      regularPrice: undefined,
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

  const handleDelete = async () => {
    if (!initialData) return;
    
    const productName = initialData.name;
    if (!confirm(`Opravdu chcete smazat produkt "${productName}"? Tato akce je nevratná.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${initialData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast.success('Produkt byl úspěšně smazán');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error('Chyba při mazání produktu');
    } finally {
      setIsDeleting(false);
    }
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
      
      // Process variants based on type
      const processedVariants = variants.map(v => {
        if (variantType === 'random') {
          // For random variants, we'll store the variant name in colorName field
          return {
            ...v,
            colorName: v.variantName,
            variantName: undefined,
          };
        }
        return v;
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          code: data.code && data.code.trim() !== '' ? data.code : null,
          slug: data.slug || generatedSlug,
          image: mainImage,
          images: productImages,
          variants: processedVariants.filter(v => v.colorName || v.sizeName),
          categoryId: data.categoryId || null,
          regularPrice: data.regularPrice || null,
          brand: data.brand || null,
          warranty: data.warranty || null,
          availability: data.availability || 'in_stock', // INCLUDE AVAILABILITY
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
          <span className="text-sm text-gray-500">www.dannyfashion.cz</span>
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

      {/* NEW AVAILABILITY FIELD */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">Dostupnost produktu</label>
        <select
          {...register('availability')}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="in_stock">Na stanie</option>
          <option value="in_stock_supplier">W magazynie u dostawcy</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Toto nastavení určuje, jak se zobrazí dostupnost když má produkt skladem více než 0 kusů
        </p>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">Krátký popis</label>
        <TiptapEditor
          value={description}
          onChange={setDescription}
          placeholder="Stručný popis produktu pro výpis..."
          height="150px"
          useRawHtml={true} // Enable raw HTML mode for short description
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">
          Detailní popis
        </label>
        <TiptapEditor
          value={detailDescription}
          onChange={setDetailDescription}
          placeholder="Podrobný popis produktu, specifikace, vlastnosti..."
          height="300px"
          useRawHtml={true} // Enable raw HTML mode for detailed description
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
        />
      </div>
      
      {/* Variants Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Varianty produktu</h3>
          <div className="flex gap-2">
            <select
              value={variantType}
              onChange={(e) => setVariantType(e.target.value as 'color' | 'size' | 'both' | 'random')}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="color">Barva</option>
              <option value="size">Velikosti</option>
              <option value="both">Barvy a velikosti</option>
              <option value="random">Random</option>
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
        {variantType === 'size' && variants.length === 0 && (
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
                  {/* Random variant type layout */}
                  {variantType === 'random' && (
                    <>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium mb-1 text-black">Varianta</label>
                        <input
                          type="text"
                          value={variant.variantName || ''}
                          onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
                          placeholder="např. Premium"
                          className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1 text-black">Skladem</label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                          className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      
                      <div className="col-span-3">
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
                      
                      <div className="col-span-3">
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
                    </>
                  )}

                  {/* Original variant layouts for color, size, and both */}
                  {variantType !== 'random' && (
                    <>
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
                    </>
                  )}
                  
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

        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={`ml-auto px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition flex items-center gap-2 ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Smazat produkt"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Mazání...' : 'Smazat'}
          </button>
        )}
      </div>
    </form>
  );
}