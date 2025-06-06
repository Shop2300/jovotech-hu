// src/components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Proszę wybrać ocenę');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          authorName: authorName.trim() || 'Anonim',
          authorEmail: authorEmail.trim() || 'anonymous@example.com',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      toast.success('Dziękujemy za Twoją recenzję!');
      
      // Reset form
      setRating(0);
      setComment('');
      setAuthorName('');
      setAuthorEmail('');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Błąd podczas wysyłania recenzji');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-black mb-4">Napisz recenzję</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2 text-black">
          Twoja ocena *
        </label>
        <StarRating 
          rating={rating} 
          size="lg" 
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Imię (opcjonalnie)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Anonim"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Email (opcjonalnie)
          </label>
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="twój@email.pl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black">
          Twój komentarz
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Podziel się swoimi doświadczeniami z tym produktem..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-2 rounded-lg font-semibold transition ${
          isSubmitting
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Wysyłam...' : 'Wyślij recenzję'}
      </button>
    </form>
  );
}