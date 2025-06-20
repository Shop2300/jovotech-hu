// src/components/CopyLinkButton.tsx
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
    >
      {copied ? (
        <>
          <Check size={15} className="text-green-600" />
          <span className="text-green-600">Skopiowano!</span>
        </>
      ) : (
        <>
          <Copy size={15} />
          <span>Kopiuj link</span>
        </>
      )}
    </button>
  );
}