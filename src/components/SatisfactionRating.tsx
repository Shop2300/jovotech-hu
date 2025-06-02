// src/components/SatisfactionRating.tsx
'use client';

import { useState } from 'react';

interface SatisfactionRatingProps {
  orderNumber: string;
}

export function SatisfactionRating({ orderNumber }: SatisfactionRatingProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Rating emojis
  const ratingOptions = [
    { value: 1, emoji: '😢', label: 'Velmi nespokojený' },
    { value: 2, emoji: '😕', label: 'Nespokojený' },
    { value: 3, emoji: '😐', label: 'Neutrální' },
    { value: 4, emoji: '😊', label: 'Spokojený' },
    { value: 5, emoji: '😍', label: 'Velmi spokojený' },
  ];

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    // Here you can add API call to save the rating
    console.log('Rating selected for order', orderNumber, ':', rating);
    
    // Example API call (uncomment when you have the endpoint):
    // fetch(`/api/orders/${orderNumber}/rating`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ rating })
    // });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold mb-4">Jak jste spokojeni s objednávkou?</h3>
      <div className="flex justify-around">
        {ratingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleRating(option.value)}
            className={`group relative transition-all ${
              selectedRating === option.value ? 'transform scale-125' : ''
            }`}
            title={option.label}
          >
            <span className={`text-3xl hover:transform hover:scale-110 transition-transform cursor-pointer ${
              selectedRating === option.value ? '' : 'opacity-70 hover:opacity-100'
            }`}>
              {option.emoji}
            </span>
          </button>
        ))}
      </div>
      {selectedRating && (
        <p className="text-sm text-green-600 text-center mt-4">
          Děkujeme za vaše hodnocení!
        </p>
      )}
    </div>
  );
}