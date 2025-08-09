// src/components/RecentReviews.tsx
import Link from 'next/link';
import { Star, CheckCircle } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  daysAgo: number; // Changed from date to daysAgo
  verified: boolean;
  product: string;
  title: string;
  content: string;
}

// Helper function to calculate date from days ago
const getDateFromDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Sample recent reviews - in production, these would come from your database
const recentReviews: Review[] = [
  {
    id: 1,
    author: 'Kovács Katalin',
    rating: 5,
    daysAgo: 2, // 2 days ago
    verified: true,
    product: 'CNC marógép 3040',
    title: 'Kiváló webáruház, ajánlom!',
    content: 'CNC marógépet rendeltem és nagyon elégedett vagyok. Gyors szállítás, a termék megfelel a leírásnak, az ügyfélszolgálat pedig a legmagasabb szinten működik. Ráadásul törzsVásárlóként kedvezményt is kaptam!'
  },
  {
    id: 2,
    author: 'Nagy Péter',
    rating: 5,
    daysAgo: 5, // 5 days ago
    verified: true,
    product: 'Ultrahangos tisztító 40kHz',
    title: 'Professzionális kiszolgálás',
    content: 'Ultrahangos tisztítót vásároltam a műhelyembe. Vásárlás előtt sok kérdésem volt - az ügyfélszolgálat türelmesen megválaszolt mindent. A csomag másnap megérkezett, kiválóan becsomagolva.'
  },
  {
    id: 3,
    author: 'Szabó Anna',
    rating: 4,
    daysAgo: 7, // 7 days ago
    verified: true,
    product: 'Hőprés 38x38',
    title: 'Jó termék, gyors szállítás',
    content: 'A hőprés kifogástalanul működik. Egyetlen mínusz, hogy nem volt magyar nyelvű útmutató, de a support gyorsan elküldött egy fordítást. Összességében elégedett vagyok a vásárlással.'
  },
  {
    id: 4,
    author: 'Tóth Márk',
    rating: 5,
    daysAgo: 12, // 12 days ago
    verified: true,
    product: 'Gravírozó lézer 80W',
    title: 'A legjobb ár a piacon',
    content: 'Sokáig kerestem jó árú lézert. A Jovotech.hu-nál volt a legjobb ajánlat, ráadásul ingyenes szállítással. A berendezés tökéletesen működik, ajánlom!'
  }
];

export function RecentReviews() {
  return (
    <section className="py-12 pb-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          <Link href="/ocena-sklepu" className="text-black hover:text-blue-600 transition-colors">
            Legutóbbi vásárlói vélemények →
          </Link>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentReviews.map((review) => {
            const reviewDate = getDateFromDaysAgo(review.daysAgo);
            
            return (
              <div 
                key={review.id} 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                {/* Header with author and rating */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{review.author}</h3>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ellenőrzött
                      </span>
                    )}
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(reviewDate).toLocaleDateString('hu-HU', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {/* Product name */}
                  {review.product && (
                    <p className="text-sm text-blue-600 font-medium mb-2">{review.product}</p>
                  )}
                </div>
                
                {/* Review title */}
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {review.title}
                </h4>
                
                {/* Review content - truncated */}
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {review.content}
                </p>
                
                {/* Read more link */}
                <Link 
                  href="/ocena-sklepu" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                >
                  Tovább olvasom →
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-2xl text-gray-900">4.8</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span>201 vélemény alapján</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <div className="hidden md:block">
              <span className="font-semibold">98%</span> vásárlónk ajánlja webáruházunkat
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}