// src/components/RecentReviews.tsx
import Link from 'next/link';
import { Star, CheckCircle } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  product: string;
  title: string;
  content: string;
}

// Sample recent reviews - in production, these would come from your database
const recentReviews: Review[] = [
  {
    id: 1,
    author: 'Katarzyna M.',
    rating: 5,
    date: '2025-06-08',
    verified: true,
    product: 'Router CNC 3040',
    title: 'Świetny sklep, polecam!',
    content: 'Zamówiłam router CNC i jestem bardzo zadowolona. Szybka dostawa, produkt zgodny z opisem, a obsługa klienta na najwyższym poziomie. Dodatkowo otrzymałam rabat jako stały klient!'
  },
  {
    id: 2,
    author: 'Piotr K.',
    rating: 5,
    date: '2025-06-05',
    verified: true,
    product: 'Ultradźwięki 40kHz',
    title: 'Profesjonalna obsługa',
    content: 'Kupiłem ultradźwięki do warsztatu. Przed zakupem miałem wiele pytań - obsługa cierpliwie wszystko wyjaśniła. Przesyłka dotarła następnego dnia, świetnie zapakowana.'
  },
  {
    id: 3,
    author: 'Anna W.',
    rating: 4,
    date: '2025-06-03',
    verified: true,
    product: 'Prasa termotransferowa 38x38',
    title: 'Dobry produkt, szybka wysyłka',
    content: 'Prasa działa bez zarzutu. Jedyny minus to brak polskiej instrukcji, ale support szybko przesłał mi tłumaczenie. Ogólnie jestem zadowolona z zakupu.'
  },
  {
    id: 4,
    author: 'Marek J.',
    rating: 5,
    date: '2025-05-28',
    verified: true,
    product: 'Laser grawerujący 80W',
    title: 'Najlepsza cena na rynku',
    content: 'Długo szukałem lasera w dobrej cenie. Galaxy Sklep miał najlepszą ofertę, a do tego darmową dostawę. Urządzenie działa idealnie, polecam!'
  }
];

export function RecentReviews() {
  return (
    <section className="py-12 pb-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          <Link href="/ocena-sklepu" className="text-black hover:text-blue-600 transition-colors">
            Ostatnie opinie klientów →
          </Link>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentReviews.map((review) => (
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
                      Zweryfikowany
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
                    {new Date(review.date).toLocaleDateString('pl-PL', { 
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
                Czytaj więcej →
              </Link>
            </div>
          ))}
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
              <span>na podstawie 201 opinii</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <div className="hidden md:block">
              <span className="font-semibold">98%</span> klientów poleca nasz sklep
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}