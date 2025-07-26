// src/app/ocena-sklepu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Star, Shield, Award, ThumbsUp, MessageSquare, CheckCircle, TrendingUp, Users, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Remove metadata from client component - we'll handle it differently
// export const metadata: Metadata = {
//   title: 'Ocena sklepu - Opinie klientów | Galaxysklep.pl',
//   description: 'Zobacz co mówią nasi klienci o Galaxysklep.pl. Przeczytaj opinie, sprawdź naszą ocenę i podziel się swoim doświadczeniem zakupowym.',
// };

interface Review {
  id: number;
  author: string;
  rating: number;
  daysAgo: number; // Changed from date to daysAgo
  verified: boolean;
  product: string;
  title: string;
  content: string;
  helpful: number;
  images: string[];
}

// Helper function to calculate date from days ago
const getDateFromDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export default function OcenaSklepuPage() {
  // Set page title
  useEffect(() => {
    document.title = 'Ocena sklepu - Opinie klientów | Galaxysklep.pl';
  }, []);

  // Initial review data with dynamic dates (40 reviews)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Katarzyna M.',
      rating: 5,
      daysAgo: 0, // Today
      verified: true,
      product: 'Router CNC 3040',
      title: 'Świetny sklep, polecam!',
      content: 'Zamówiłam router CNC i jestem bardzo zadowolona. Szybka dostawa, produkt zgodny z opisem, a obsługa klienta na najwyższym poziomie. Dodatkowo otrzymałam rabat jako stały klient!',
      helpful: 24,
      images: []
    },
    {
      id: 2,
      author: 'Piotr K.',
      rating: 5,
      daysAgo: 1, // Yesterday
      verified: true,
      product: 'Ultradźwięki 40kHz',
      title: 'Profesjonalna obsługa',
      content: 'Kupiłem ultradźwięki do warsztatu. Przed zakupem miałem wiele pytań - obsługa cierpliwie wszystko wyjaśniła. Przesyłka dotarła następnego dnia, świetnie zapakowana.',
      helpful: 18,
      images: []
    },
    {
      id: 3,
      author: 'Anna W.',
      rating: 4,
      daysAgo: 2,
      verified: true,
      product: 'Prasa termotransferowa 38x38',
      title: 'Dobry produkt, szybka wysyłka',
      content: 'Prasa działa bez zarzutu. Jedyny minus to brak polskiej instrukcji, ale support szybko przesłał mi tłumaczenie. Ogólnie jestem zadowolona z zakupu.',
      helpful: 15,
      images: []
    },
    {
      id: 4,
      author: 'Marek J.',
      rating: 5,
      daysAgo: 3,
      verified: true,
      product: 'Laser grawerujący 80W',
      title: 'Najlepsza cena na rynku',
      content: 'Długo szukałem lasera w dobrej cenie. Galaxy Sklep miał najlepszą ofertę, a do tego darmową dostawę. Urządzenie działa idealnie, polecam!',
      helpful: 31,
      images: []
    },
    {
      id: 5,
      author: 'Ewa S.',
      rating: 5,
      daysAgo: 4,
      verified: true,
      product: 'Akcesoria do routera CNC',
      title: 'Szeroki wybór akcesoriów',
      content: 'Super sklep z ogromnym wyborem akcesoriów do maszyn CNC. Wszystko w jednym miejscu, konkurencyjne ceny i błyskawiczna realizacja zamówienia.',
      helpful: 12,
      images: []
    },
    {
      id: 6,
      author: 'Tomasz B.',
      rating: 5,
      daysAgo: 5,
      verified: true,
      product: 'Router CNC 6090',
      title: 'Profesjonalne urządzenie',
      content: 'Router CNC 6090 spełnił wszystkie moje oczekiwania. Precyzja obróbki jest niesamowita. Wsparcie techniczne pomogło w konfiguracji.',
      helpful: 28,
      images: []
    },
    {
      id: 7,
      author: 'Magdalena K.',
      rating: 5,
      daysAgo: 6,
      verified: true,
      product: 'Prasa termotransferowa 5w1',
      title: 'Idealna do małej firmy',
      content: 'Prowadzę małą firmę z nadrukami. Ta prasa to strzał w dziesiątkę! Możliwość druku na różnych powierzchniach to ogromny plus.',
      helpful: 19,
      images: []
    },
    {
      id: 8,
      author: 'Robert S.',
      rating: 4,
      daysAgo: 7,
      verified: false,
      product: 'Ultradźwięki 15L',
      title: 'Solidne wykonanie',
      content: 'Myjka ultradźwiękowa działa świetnie. Minus za głośną pracę, ale efekty czyszczenia rekompensują ten mankament.',
      helpful: 14,
      images: []
    },
    {
      id: 9,
      author: 'Agnieszka W.',
      rating: 5,
      daysAgo: 8,
      verified: true,
      product: 'Laser CO2 40W',
      title: 'Łatwa obsługa',
      content: 'Pierwszy raz kupiłam laser i obawiałam się obsługi. Niepotrzebnie! Wszystko jest intuicyjne, a instrukcja bardzo pomocna.',
      helpful: 22,
      images: []
    },
    {
      id: 10,
      author: 'Krzysztof M.',
      rating: 5,
      daysAgo: 9,
      verified: true,
      product: 'Frezy do CNC - zestaw',
      title: 'Świetna jakość frezów',
      content: 'Zamówiłem zestaw frezów do mojego routera. Jakość wykonania na najwyższym poziomie, ostrza trzymają długo.',
      helpful: 16,
      images: []
    },
    {
      id: 11,
      author: 'Beata L.',
      rating: 5,
      daysAgo: 10,
      verified: true,
      product: 'Prasa do kubków',
      title: 'Rewelacja!',
      content: 'Prasa do kubków działa perfekcyjnie. Nadruki wychodzą ostre i trwałe. Dostawa była ekspresowa!',
      helpful: 25,
      images: []
    },
    {
      id: 12,
      author: 'Paweł D.',
      rating: 4,
      daysAgo: 11,
      verified: false,
      product: 'Router CNC 3018',
      title: 'Dobry na początek',
      content: 'Jako pierwszy router CNC sprawdza się dobrze. Wymaga trochę doświadczenia w konfiguracji, ale efekty są zadowalające.',
      helpful: 11,
      images: []
    },
    {
      id: 13,
      author: 'Joanna P.',
      rating: 5,
      daysAgo: 12,
      verified: true,
      product: 'Ultradźwięki 30L',
      title: 'Niezbędne w warsztacie',
      content: 'Używam do czyszczenia części samochodowych. Efekty są spektakularne! Polecam każdemu mechanikowi.',
      helpful: 33,
      images: []
    },
    {
      id: 14,
      author: 'Michał R.',
      rating: 5,
      daysAgo: 13,
      verified: true,
      product: 'Laser grawerujący 100W',
      title: 'Moc i precyzja',
      content: 'Laser 100W to bestia! Graweruję nim drewno, skórę i metal. Każdy materiał wychodzi idealnie.',
      helpful: 27,
      images: []
    },
    {
      id: 15,
      author: 'Alicja G.',
      rating: 5,
      daysAgo: 14,
      verified: true,
      product: 'Akcesoria do pras termotransferowych',
      title: 'Wszystko czego potrzeba',
      content: 'Szeroki wybór akcesoriów w jednym miejscu. Nie muszę szukać po różnych sklepach. Ceny bardzo konkurencyjne.',
      helpful: 9,
      images: []
    },
    {
      id: 16,
      author: 'Dariusz K.',
      rating: 4,
      daysAgo: 15,
      verified: false,
      product: 'Router CNC 4030',
      title: 'Solidna konstrukcja',
      content: 'Router jest bardzo solidny. Jedynie software mógłby być bardziej intuicyjny, ale po czasie się przyzwyczaiłem.',
      helpful: 13,
      images: []
    },
    {
      id: 17,
      author: 'Natalia B.',
      rating: 5,
      daysAgo: 16,
      verified: true,
      product: 'Prasa do czapek',
      title: 'Idealna do haftu',
      content: 'Kupowałam specjalnie do transferu na czapki z daszkiem. Działa bez zarzutu, nadruki są trwałe.',
      helpful: 17,
      images: []
    },
    {
      id: 18,
      author: 'Wojciech T.',
      rating: 5,
      daysAgo: 17,
      verified: true,
      product: 'Ultradźwięki 6L',
      title: 'Kompaktowe i wydajne',
      content: 'Małe ultradźwięki do domowego warsztatu. Mimo niewielkich rozmiarów radzi sobie z każdym brudem.',
      helpful: 20,
      images: []
    },
    {
      id: 19,
      author: 'Monika S.',
      rating: 5,
      daysAgo: 18,
      verified: true,
      product: 'Laser CO2 60W',
      title: 'Spełnia oczekiwania',
      content: 'Laser działa dokładnie tak jak opisano. Wsparcie techniczne bardzo pomocne przy pierwszym uruchomieniu.',
      helpful: 24,
      images: []
    },
    {
      id: 20,
      author: 'Adam W.',
      rating: 4,
      daysAgo: 19,
      verified: false,
      product: 'Chłodzenie do lasera',
      title: 'Niezbędny dodatek',
      content: 'System chłodzenia działa dobrze, choć jest dość głośny. Temperatura lasera utrzymuje się na stabilnym poziomie.',
      helpful: 8,
      images: []
    },
    {
      id: 21,
      author: 'Karolina M.',
      rating: 5,
      daysAgo: 20,
      verified: true,
      product: 'Prasa termotransferowa 40x50',
      title: 'Duża powierzchnia robocza',
      content: 'Prasa z dużą powierzchnią roboczą - idealna do koszulek XXL. Równomierne nagrzewanie na całej powierzchni.',
      helpful: 31,
      images: []
    },
    {
      id: 22,
      author: 'Łukasz J.',
      rating: 5,
      daysAgo: 21,
      verified: true,
      product: 'Router CNC 1610',
      title: 'Świetny do PCB',
      content: 'Używam do frezowania płytek PCB. Precyzja jest wystarczająca nawet do bardzo cienkich ścieżek.',
      helpful: 15,
      images: []
    },
    {
      id: 23,
      author: 'Ewa K.',
      rating: 5,
      daysAgo: 22,
      verified: true,
      product: 'Ultradźwięki 2L',
      title: 'Do biżuterii idealnie',
      content: 'Małe ultradźwięki do czyszczenia biżuterii. Efekt jak nowa! Polecam każdej kobiecie.',
      helpful: 26,
      images: []
    },
    {
      id: 24,
      author: 'Marcin P.',
      rating: 4,
      daysAgo: 23,
      verified: false,
      product: 'Wrzeciono do CNC 500W',
      title: 'Dobre wrzeciono',
      content: 'Wrzeciono pracuje cicho i płynnie. Moc wystarczająca do drewna i plastiku. Do metalu bym wziął mocniejsze.',
      helpful: 12,
      images: []
    },
    {
      id: 25,
      author: 'Patrycja A.',
      rating: 5,
      daysAgo: 24,
      verified: true,
      product: 'Prasa do puzzli',
      title: 'Świetna do sublimacji',
      content: 'Specjalna prasa do puzzli - nareszcie mogę robić personalizowane puzzle! Jakość transferu rewelacyjna.',
      helpful: 18,
      images: []
    },
    {
      id: 26,
      author: 'Grzegorz N.',
      rating: 5,
      daysAgo: 25,
      verified: true,
      product: 'Laser grawerujący 50W',
      title: 'Uniwersalne urządzenie',
      content: 'Laser 50W to złoty środek - wystarcza do większości zastosowań hobbystycznych i małego biznesu.',
      helpful: 29,
      images: []
    },
    {
      id: 27,
      author: 'Sylwia R.',
      rating: 5,
      daysAgo: 26,
      verified: true,
      product: 'Ultradźwięki 10L z podgrzewaniem',
      title: 'Podgrzewanie robi różnicę',
      content: 'Wersja z podgrzewaniem to zupełnie inna liga. Czyszczenie jest dużo skuteczniejsze. Warto dopłacić!',
      helpful: 35,
      images: []
    },
    {
      id: 28,
      author: 'Bartosz L.',
      rating: 4,
      daysAgo: 27,
      verified: false,
      product: 'Router CNC 3040 z 4 osią',
      title: 'Czwarta oś przydatna',
      content: 'Router z 4 osią daje więcej możliwości. Konfiguracja była trudniejsza niż myślałem, ale było warto.',
      helpful: 10,
      images: []
    },
    {
      id: 29,
      author: 'Aleksandra C.',
      rating: 5,
      daysAgo: 28,
      verified: true,
      product: 'Prasa do talerzy',
      title: 'Do ceramiki idealna',
      content: 'Robię personalizowane talerze i kubki. Ta prasa jest do tego idealna! Równomierne dociskanie.',
      helpful: 21,
      images: []
    },
    {
      id: 30,
      author: 'Rafał B.',
      rating: 5,
      daysAgo: 29,
      verified: true,
      product: 'Laser CO2 80W',
      title: 'Mocny i szybki',
      content: 'Laser 80W tnie grube materiały bez problemu. Prędkość pracy znacznie większa niż w słabszych modelach.',
      helpful: 23,
      images: []
    },
    {
      id: 31,
      author: 'Marta D.',
      rating: 5,
      daysAgo: 30,
      verified: true,
      product: 'Akcesoria do ultradźwięków',
      title: 'Przydatne kosze i uchwyty',
      content: 'Dokupowałam akcesoria do mojej myjki. Kosze na drobne elementy bardzo ułatwiają pracę.',
      helpful: 7,
      images: []
    },
    {
      id: 32,
      author: 'Kamil W.',
      rating: 4,
      daysAgo: 31,
      verified: false,
      product: 'Router CNC 6040',
      title: 'Wart swojej ceny',
      content: 'Dobry stosunek jakości do ceny. Nie jest to sprzęt profesjonalny, ale do warsztatu w sam raz.',
      helpful: 16,
      images: []
    },
    {
      id: 33,
      author: 'Izabela T.',
      rating: 5,
      daysAgo: 32,
      verified: true,
      product: 'Prasa próżniowa 3D',
      title: 'Do przedmiotów 3D super',
      content: 'Prasa próżniowa świetnie sprawdza się przy nietypowych kształtach. Transfer na butelkach wychodzi idealnie.',
      helpful: 30,
      images: []
    },
    {
      id: 34,
      author: 'Piotr Z.',
      rating: 5,
      daysAgo: 33,
      verified: true,
      product: 'Ultradźwięki 20L',
      title: 'Duża pojemność',
      content: 'Potrzebowałem dużej myjki do części motocyklowych. 20L to idealna pojemność, wszystko się mieści.',
      helpful: 25,
      images: []
    },
    {
      id: 35,
      author: 'Justyna M.',
      rating: 5,
      daysAgo: 34,
      verified: true,
      product: 'Laser grawerujący 30W',
      title: 'Do grawerowania wystarczy',
      content: 'Do grawerowania 30W w zupełności wystarcza. Drewno, skóra, plastik - wszystko wychodzi pięknie.',
      helpful: 19,
      images: []
    },
    {
      id: 36,
      author: 'Dawid K.',
      rating: 4,
      daysAgo: 35,
      verified: false,
      product: 'Sterownik do CNC',
      title: 'Dobry zamiennik',
      content: 'Wymieniłem stary sterownik na ten. Działa lepiej, choć dokumentacja mogłaby być bardziej szczegółowa.',
      helpful: 6,
      images: []
    },
    {
      id: 37,
      author: 'Paulina S.',
      rating: 5,
      daysAgo: 36,
      verified: true,
      product: 'Prasa do długopisów',
      title: 'Niszowy, ale potrzebny sprzęt',
      content: 'Trudno znaleźć dobrą prasę do długopisów. Ta działa świetnie, transfer jest trwały i ostry.',
      helpful: 14,
      images: []
    },
    {
      id: 38,
      author: 'Sebastian R.',
      rating: 5,
      daysAgo: 37,
      verified: true,
      product: 'Router CNC 1325',
      title: 'Profesjonalna maszyna',
      content: 'Duży router do profesjonalnych zastosowań. Pracuje non-stop w mojej firmie. Zero problemów!',
      helpful: 37,
      images: []
    },
    {
      id: 39,
      author: 'Aneta B.',
      rating: 5,
      daysAgo: 38,
      verified: true,
      product: 'Ultradźwięki 3L',
      title: 'Małe, ale skuteczne',
      content: 'Do okularów i małej biżuterii idealnie. Zajmuje mało miejsca, a efekty czyszczenia super.',
      helpful: 22,
      images: []
    },
    {
      id: 40,
      author: 'Mariusz L.',
      rating: 4,
      daysAgo: 39,
      verified: false,
      product: 'Odsysacz do lasera',
      title: 'Konieczność przy laserze',
      content: 'Odsysacz dobrze filtruje powietrze. Trochę głośny, ale bezpieczeństwo przede wszystkim.',
      helpful: 11,
      images: []
    }
  ]);

  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    email: '',
    rating: 5,
    product: '',
    title: '',
    content: ''
  });

  const ratingDistribution = [
    { stars: 5, count: 447, percentage: 73 },
    { stars: 4, count: 338, percentage: 19 },
    { stars: 3, count: 10, percentage: 5 },
    { stars: 2, count: 4, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
  ];

  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  const averageRating = (
    ratingDistribution.reduce((sum, item) => sum + item.stars * item.count, 0) / totalReviews
  ).toFixed(1);

  const handleHelpful = (reviewId: number) => {
    if (helpfulClicked.has(reviewId)) {
      toast.error('Już oznaczyłeś tę opinię jako pomocną');
      return;
    }

    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
    setHelpfulClicked(prev => new Set(prev).add(reviewId));
    toast.success('Dziękujemy za oznaczenie opinii jako pomocnej');
  };

  const handleReport = (reviewId: number) => {
    toast.success('Dziękujemy za zgłoszenie. Sprawdzimy tę opinię.');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.author || !newReview.email || !newReview.title || !newReview.content) {
      toast.error('Wypełnij wszystkie wymagane pola');
      return;
    }

    const review: Review = {
      id: reviews.length + 1,
      author: newReview.author,
      rating: newReview.rating,
      daysAgo: 0, // New review is from today
      verified: false,
      product: newReview.product,
      title: newReview.title,
      content: newReview.content,
      helpful: 0,
      images: []
    };

    setReviews([review, ...reviews]);
    setShowReviewModal(false);
    setNewReview({
      author: '',
      email: '',
      rating: 5,
      product: '',
      title: '',
      content: ''
    });
    toast.success('Dziękujemy za dodanie opinii! Zostanie ona opublikowana po weryfikacji.');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ocena sklepu Galaxysklep.pl
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Zobacz, co mówią o nas nasi klienci. Twoja opinia jest dla nas bardzo ważna!
          </p>
        </div>

        {/* Overall Rating Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">na podstawie {totalReviews} opinii</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm w-4">{item.stars}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold">Bezpieczne zakupy</div>
                  <div className="text-sm text-gray-600">Szyfrowanie SSL</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold">Gwarancja jakości</div>
                  <div className="text-sm text-gray-600">100% oryginalne produkty</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold">20 lat doświadczenia</div>
                  <div className="text-sm text-gray-600">Zaufało nam 50,000+ klientów</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Zadowolonych klientów</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24h</div>
            <div className="text-sm text-gray-600">Średni czas wysyłki</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,4h</div>
            <div className="text-sm text-gray-600">support@galaxysklep.pl</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">14 dni</div>
            <div className="text-sm text-gray-600">Na zwrot towaru</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Najnowsze opinie</h2>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition"
            >
              Dodaj opinię
            </button>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews
              .sort((a, b) => a.daysAgo - b.daysAgo) // Sort by daysAgo ascending (newest first)
              .map((review) => {
              const reviewDate = getDateFromDaysAgo(review.daysAgo);
              
              return (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{review.author}</h3>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Zweryfikowany zakup
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
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
                        <span>{new Date(reviewDate).toLocaleDateString('pl-PL')}</span>
                        {review.product && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">{review.product}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-3">{review.content}</p>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-2 text-sm transition ${
                        helpfulClicked.has(review.id) 
                          ? 'text-green-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Pomocne ({review.helpful})
                    </button>
                    <button 
                      onClick={() => handleReport(review.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Zgłoś
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Zobacz więcej opinii →
            </button>
          </div>
        </div>

        {/* External Reviews Section */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Opinie z innych platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 mb-2">Google Reviews</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">na podstawie 89 opinii</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.7/5</div>
              <div className="text-gray-600 mb-2">Facebook</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">na podstawie 156 opinii</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600 mb-2">Ceneo</div>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">na podstawie 67 opinii</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Dodaj opinię</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ocena *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="text-2xl"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produkt (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    value={newReview.product}
                    onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tytuł opinii *
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treść opinii *
                  </label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Dodaj opinię
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}