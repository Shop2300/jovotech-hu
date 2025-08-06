// src/components/admin/CopyButton.tsx
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      // Reset the icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      // REMOVED: toast.success('Copied to clipboard');
      // No confirmation message as requested
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors ${className}`}
      title="Copy to clipboard"
      type="button"
    >
      {isCopied ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );
}