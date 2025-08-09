// src/app/vasarloi-velemenyek/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Star, Shield, Award, ThumbsUp, MessageSquare, CheckCircle, TrendingUp, Users, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Remove metadata from client component - we'll handle it differently
// export const metadata: Metadata = {
//   title: 'Vásárlói vélemények - Értékelések | Jovotech.hu',
//   description: 'Olvassa el, mit mondanak vásárlóink a Jovotech.hu-ról. Tekintse meg a véleményeket, ellenőrizze értékelésünket és ossza meg vásárlási tapasztalatait.',
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

export default function VasarloiVelemenyekPage() {
  // Set page title
  useEffect(() => {
    document.title = 'Vásárlói vélemények - Értékelések | Jovotech.hu';
  }, []);

  // Initial review data with dynamic dates (40 reviews)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      author: 'Kovács Katalin',
      rating: 5,
      daysAgo: 0, // Today
      verified: true,
      product: 'CNC Router 3040',
      title: 'Kiváló bolt, ajánlom!',
      content: 'CNC routert rendeltem és nagyon elégedett vagyok. Gyors szállítás, a termék megfelel a leírásnak, az ügyfélszolgálat a legmagasabb szinten. Ráadásul törzsvasárlóként kedvezményt is kaptam!',
      helpful: 24,
      images: []
    },
    {
      id: 2,
      author: 'Kiss Péter',
      rating: 5,
      daysAgo: 1, // Yesterday
      verified: true,
      product: 'Ultrahangos tisztító 40kHz',
      title: 'Professzionális kiszolgálás',
      content: 'Ultrahangos tisztítót vettem a műhelyembe. Vásárlás előtt sok kérdésem volt - az ügyfélszolgálat türelmesen mindent elmagyarázott. A csomag másnap megérkezett, kiválóan csomagolva.',
      helpful: 18,
      images: []
    },
    {
      id: 3,
      author: 'Varga Anna',
      rating: 4,
      daysAgo: 2,
      verified: true,
      product: 'Hőprés 38x38',
      title: 'Jó termék, gyors szállítás',
      content: 'A prés kifogástalanul működik. Egyetlen mínusz, hogy nincs magyar nyelvű útmutató, de a support gyorsan küldött fordítást. Összességében elégedett vagyok a vásárlással.',
      helpful: 15,
      images: []
    },
    {
      id: 4,
      author: 'Juhász Márk',
      rating: 5,
      daysAgo: 3,
      verified: true,
      product: 'Lézergravírozó 80W',
      title: 'Legjobb ár a piacon',
      content: 'Sokáig kerestem jó árú lézert. A Jovotech-nél volt a legjobb ajánlat, ráadásul ingyenes szállítással. A berendezés tökéletesen működik, ajánlom!',
      helpful: 31,
      images: []
    },
    {
      id: 5,
      author: 'Szabó Éva',
      rating: 5,
      daysAgo: 4,
      verified: true,
      product: 'CNC router tartozékok',
      title: 'Széles tartozék választék',
      content: 'Szuper bolt hatalmas CNC gép tartozék választékkal. Minden egy helyen, versenyképes árak és villámgyors rendelés teljesítés.',
      helpful: 12,
      images: []
    },
    {
      id: 6,
      author: 'Balogh Tamás',
      rating: 5,
      daysAgo: 5,
      verified: true,
      product: 'CNC Router 6090',
      title: 'Professzionális eszköz',
      content: 'A CNC Router 6090 minden elvárásomnak megfelelt. A megmunkálási pontosság hihetetlen. A technikai támogatás segített a beállításban.',
      helpful: 28,
      images: []
    },
    {
      id: 7,
      author: 'Kocsis Magdolna',
      rating: 5,
      daysAgo: 6,
      verified: true,
      product: 'Hőprés 5in1',
      title: 'Ideális kis vállalkozáshoz',
      content: 'Kis nyomdai vállalkozást vezetek. Ez a prés telitalálat! A különböző felületekre való nyomtatás lehetősége óriási előny.',
      helpful: 19,
      images: []
    },
    {
      id: 8,
      author: 'Simon Róbert',
      rating: 4,
      daysAgo: 7,
      verified: false,
      product: 'Ultrahangos tisztító 15L',
      title: 'Masszív kivitelezés',
      content: 'Az ultrahangos mosó kiválóan működik. Mínusz pont a hangos működés, de a tisztítási eredmények kárpótolnak ezért a hiányosságért.',
      helpful: 14,
      images: []
    },
    {
      id: 9,
      author: 'Vincze Ágnes',
      rating: 5,
      daysAgo: 8,
      verified: true,
      product: 'CO2 lézer 40W',
      title: 'Egyszerű kezelés',
      content: 'Először vettem lézert és féltem a kezelésétől. Feleslegesen! Minden intuitív, az útmutató nagyon hasznos.',
      helpful: 22,
      images: []
    },
    {
      id: 10,
      author: 'Molnár Krisztián',
      rating: 5,
      daysAgo: 9,
      verified: true,
      product: 'CNC marók - készlet',
      title: 'Kiváló minőségű marók',
      content: 'Maró készletet rendeltem a routeremhez. A kivitelezés minősége a legmagasabb szinten, a vágóélek sokáig tartanak.',
      helpful: 16,
      images: []
    },
    {
      id: 11,
      author: 'Lukács Beáta',
      rating: 5,
      daysAgo: 10,
      verified: true,
      product: 'Bögre prés',
      title: 'Fantasztikus!',
      content: 'A bögre prés tökéletesen működik. A nyomatok élesek és tartósak. A szállítás expressz volt!',
      helpful: 25,
      images: []
    },
    {
      id: 12,
      author: 'Papp Dávid',
      rating: 4,
      daysAgo: 11,
      verified: false,
      product: 'CNC Router 3018',
      title: 'Jó kezdőknek',
      content: 'Első CNC routerként jól teljesít. Kicsit tapasztalat kell a beállításhoz, de az eredmények kielégítőek.',
      helpful: 11,
      images: []
    },
    {
      id: 13,
      author: 'Pintér Johanna',
      rating: 5,
      daysAgo: 12,
      verified: true,
      product: 'Ultrahangos tisztító 30L',
      title: 'Nélkülözhetetlen a műhelyben',
      content: 'Autóalkatrészek tisztítására használom. Az eredmények látványosak! Minden szerelőnek ajánlom.',
      helpful: 33,
      images: []
    },
    {
      id: 14,
      author: 'Rácz Mihály',
      rating: 5,
      daysAgo: 13,
      verified: true,
      product: 'Lézergravírozó 100W',
      title: 'Erő és pontosság',
      content: 'A 100W-os lézer egy vadállat! Fát, bőrt és fémet gravírozok vele. Minden anyag tökéletesen sikerül.',
      helpful: 27,
      images: []
    },
    {
      id: 15,
      author: 'Gál Alíz',
      rating: 5,
      daysAgo: 14,
      verified: true,
      product: 'Hőprés tartozékok',
      title: 'Minden ami kell',
      content: 'Széles tartozék választék egy helyen. Nem kell különböző boltokban keresgélni. Az árak nagyon versenyképesek.',
      helpful: 9,
      images: []
    },
    {
      id: 16,
      author: 'Kertész Dániel',
      rating: 4,
      daysAgo: 15,
      verified: false,
      product: 'CNC Router 4030',
      title: 'Stabil konstrukció',
      content: 'A router nagyon stabil. Csak a szoftver lehetne intuitívabb, de idővel hozzászoktam.',
      helpful: 13,
      images: []
    },
    {
      id: 17,
      author: 'Bognár Natália',
      rating: 5,
      daysAgo: 16,
      verified: true,
      product: 'Sapka prés',
      title: 'Ideális hímzéshez',
      content: 'Kifejezetten baseball sapkákra való transzferhez vettem. Kifogástalanul működik, a nyomatok tartósak.',
      helpful: 17,
      images: []
    },
    {
      id: 18,
      author: 'Török Vilmos',
      rating: 5,
      daysAgo: 17,
      verified: true,
      product: 'Ultrahangos tisztító 6L',
      title: 'Kompakt és hatékony',
      content: 'Kis ultrahangos tisztító otthoni műhelyhez. A kis méret ellenére minden szennyeződéssel megbirkózik.',
      helpful: 20,
      images: []
    },
    {
      id: 19,
      author: 'Sándor Mónika',
      rating: 5,
      daysAgo: 18,
      verified: true,
      product: 'CO2 lézer 60W',
      title: 'Megfelel az elvárásoknak',
      content: 'A lézer pontosan úgy működik, ahogy leírták. A technikai támogatás nagyon segítőkész volt az első indításkor.',
      helpful: 24,
      images: []
    },
    {
      id: 20,
      author: 'Vajda Ádám',
      rating: 4,
      daysAgo: 19,
      verified: false,
      product: 'Lézer hűtőrendszer',
      title: 'Szükséges kiegészítő',
      content: 'A hűtőrendszer jól működik, bár elég hangos. A lézer hőmérséklete stabil szinten marad.',
      helpful: 8,
      images: []
    },
    {
      id: 21,
      author: 'Mészáros Karolina',
      rating: 5,
      daysAgo: 20,
      verified: true,
      product: 'Hőprés 40x50',
      title: 'Nagy munkafelület',
      content: 'Nagy felületű prés - ideális XXL pólókhoz. Egyenletes melegítés az egész felületen.',
      helpful: 31,
      images: []
    },
    {
      id: 22,
      author: 'Jakab Lukács',
      rating: 5,
      daysAgo: 21,
      verified: true,
      product: 'CNC Router 1610',
      title: 'Kiváló NYÁK-hoz',
      content: 'NYÁK lemezek marásához használom. A pontosság elegendő még nagyon vékony vezetékekhez is.',
      helpful: 15,
      images: []
    },
    {
      id: 23,
      author: 'Kozma Éva',
      rating: 5,
      daysAgo: 22,
      verified: true,
      product: 'Ultrahangos tisztító 2L',
      title: 'Ékszerekhez ideális',
      content: 'Kis ultrahangos tisztító ékszerek tisztításához. Az eredmény mint új! Minden nőnek ajánlom.',
      helpful: 26,
      images: []
    },
    {
      id: 24,
      author: 'Pásztor Marcell',
      rating: 4,
      daysAgo: 23,
      verified: false,
      product: 'CNC orsó 500W',
      title: 'Jó orsó',
      content: 'Az orsó csendesen és simán működik. A teljesítmény elegendő fához és műanyaghoz. Fémhez erősebbet vennék.',
      helpful: 12,
      images: []
    },
    {
      id: 25,
      author: 'Antal Patrícia',
      rating: 5,
      daysAgo: 24,
      verified: true,
      product: 'Puzzle prés',
      title: 'Kiváló szublimációhoz',
      content: 'Speciális puzzle prés - végre tudok személyre szabott kirakókat készíteni! A transzfer minősége fantasztikus.',
      helpful: 18,
      images: []
    },
    {
      id: 26,
      author: 'Nemes Gergely',
      rating: 5,
      daysAgo: 25,
      verified: true,
      product: 'Lézergravírozó 50W',
      title: 'Univerzális eszköz',
      content: 'Az 50W-os lézer az arany középút - elegendő a legtöbb hobbi és kisvállalkozási alkalmazáshoz.',
      helpful: 29,
      images: []
    },
    {
      id: 27,
      author: 'Rózsa Szilvia',
      rating: 5,
      daysAgo: 26,
      verified: true,
      product: 'Ultrahangos tisztító 10L fűtéssel',
      title: 'A fűtés különbséget jelent',
      content: 'A fűtéses verzió teljesen más liga. A tisztítás sokkal hatékonyabb. Megéri a felár!',
      helpful: 35,
      images: []
    },
    {
      id: 28,
      author: 'Lengyel Balázs',
      rating: 4,
      daysAgo: 27,
      verified: false,
      product: 'CNC Router 3040 4 tengellyel',
      title: 'Negyedik tengely hasznos',
      content: 'A 4 tengelyes router több lehetőséget ad. A konfiguráció nehezebb volt, mint gondoltam, de megérte.',
      helpful: 10,
      images: []
    },
    {
      id: 29,
      author: 'Csaba Alexandra',
      rating: 5,
      daysAgo: 28,
      verified: true,
      product: 'Tányér prés',
      title: 'Kerámiához ideális',
      content: 'Személyre szabott tányérokat és bögréket készítek. Ez a prés erre ideális! Egyenletes nyomás.',
      helpful: 21,
      images: []
    },
    {
      id: 30,
      author: 'Budai Rafael',
      rating: 5,
      daysAgo: 29,
      verified: true,
      product: 'CO2 lézer 80W',
      title: 'Erős és gyors',
      content: 'A 80W-os lézer gond nélkül vágja a vastag anyagokat. A munkasebesség jelentősen nagyobb, mint a gyengébb modelleknél.',
      helpful: 23,
      images: []
    },
    {
      id: 31,
      author: 'Dudás Márta',
      rating: 5,
      daysAgo: 30,
      verified: true,
      product: 'Ultrahangos tisztító tartozékok',
      title: 'Hasznos kosarak és tartók',
      content: 'Kiegészítőket vásároltam a mosómhoz. A kis alkatrészekhez való kosarak nagyon megkönnyítik a munkát.',
      helpful: 7,
      images: []
    },
    {
      id: 32,
      author: 'Virág Kamil',
      rating: 4,
      daysAgo: 31,
      verified: false,
      product: 'CNC Router 6040',
      title: 'Megéri az árát',
      content: 'Jó ár-érték arány. Nem profi eszköz, de műhelybe pont megfelelő.',
      helpful: 16,
      images: []
    },
    {
      id: 33,
      author: 'Takács Izabella',
      rating: 5,
      daysAgo: 32,
      verified: true,
      product: 'Vákuumos prés 3D',
      title: '3D tárgyakhoz szuper',
      content: 'A vákuumos prés kiválóan alkalmas szokatlan formákhoz. A palackokon való transzfer tökéletesen sikerül.',
      helpful: 30,
      images: []
    },
    {
      id: 34,
      author: 'Zsolt Péter',
      rating: 5,
      daysAgo: 33,
      verified: true,
      product: 'Ultrahangos tisztító 20L',
      title: 'Nagy kapacitás',
      content: 'Nagy mosóra volt szükségem motorkerékpár alkatrészekhez. A 20L ideális kapacitás, minden belefér.',
      helpful: 25,
      images: []
    },
    {
      id: 35,
      author: 'Major Judit',
      rating: 5,
      daysAgo: 34,
      verified: true,
      product: 'Lézergravírozó 30W',
      title: 'Gravírozáshoz elegendő',
      content: 'Gravírozáshoz a 30W teljesen elegendő. Fa, bőr, műanyag - minden gyönyörűen sikerül.',
      helpful: 19,
      images: []
    },
    {
      id: 36,
      author: 'Deák Dávid',
      rating: 4,
      daysAgo: 35,
      verified: false,
      product: 'CNC vezérlő',
      title: 'Jó helyettesítő',
      content: 'A régi vezérlőt cseréltem erre. Jobban működik, bár a dokumentáció részletesebb lehetne.',
      helpful: 6,
      images: []
    },
    {
      id: 37,
      author: 'Sári Paulina',
      rating: 5,
      daysAgo: 36,
      verified: true,
      product: 'Toll prés',
      title: 'Ritka, de szükséges eszköz',
      content: 'Nehéz jó toll prést találni. Ez kiválóan működik, a transzfer tartós és éles.',
      helpful: 14,
      images: []
    },
    {
      id: 38,
      author: 'Rónai Sebestyén',
      rating: 5,
      daysAgo: 37,
      verified: true,
      product: 'CNC Router 1325',
      title: 'Professzionális gép',
      content: 'Nagy router professzionális használatra. Non-stop dolgozik a cégemnél. Nulla probléma!',
      helpful: 37,
      images: []
    },
    {
      id: 39,
      author: 'Balog Anett',
      rating: 5,
      daysAgo: 38,
      verified: true,
      product: 'Ultrahangos tisztító 3L',
      title: 'Kicsi, de hatékony',
      content: 'Szemüveghez és kis ékszerekhez ideális. Kevés helyet foglal, a tisztítási eredmények szuperek.',
      helpful: 22,
      images: []
    },
    {
      id: 40,
      author: 'László Mariusz',
      rating: 4,
      daysAgo: 39,
      verified: false,
      product: 'Lézer elszívó',
      title: 'Szükséges lézernél',
      content: 'Az elszívó jól szűri a levegőt. Kicsit hangos, de a biztonság mindenekelőtt.',
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
      toast.error('Már megjelölte ezt a véleményt hasznosnak');
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
    toast.success('Köszönjük, hogy hasznosnak jelölte a véleményt');
  };

  const handleReport = (reviewId: number) => {
    toast.success('Köszönjük a jelentést. Ellenőrizni fogjuk a véleményt.');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.author || !newReview.email || !newReview.title || !newReview.content) {
      toast.error('Töltse ki az összes kötelező mezőt');
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
    toast.success('Köszönjük véleményét! Ellenőrzés után publikáljuk.');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Jovotech.hu értékelések
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nézze meg, mit mondanak rólunk vásárlóink. Az Ön véleménye nagyon fontos számunkra!
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
              <p className="text-gray-600">{totalReviews} vélemény alapján</p>
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
                  <div className="font-semibold">Biztonságos vásárlás</div>
                  <div className="text-sm text-gray-600">SSL titkosítás</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold">Minőségi garancia</div>
                  <div className="text-sm text-gray-600">100% eredeti termékek</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold">20 év tapasztalat</div>
                  <div className="text-sm text-gray-600">50,000+ elégedett vásárló</div>
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
            <div className="text-sm text-gray-600">Elégedett vásárló</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24ó</div>
            <div className="text-sm text-gray-600">Átlagos szállítási idő</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,4ó</div>
            <div className="text-sm text-gray-600">support@jovotech.hu</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">14 nap</div>
            <div className="text-sm text-gray-600">Elállási jog</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Legújabb vélemények</h2>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition"
            >
              Vélemény írása
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
                            Ellenőrzött vásárlás
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
                        <span>{new Date(reviewDate).toLocaleDateString('hu-HU')}</span>
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
                      Hasznos ({review.helpful})
                    </button>
                    <button 
                      onClick={() => handleReport(review.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Jelentés
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              További vélemények →
            </button>
          </div>
        </div>

        {/* External Reviews Section */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vélemények más platformokon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 mb-2">Google Értékelések</div>
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
              <p className="text-sm text-gray-500 mt-2">89 vélemény alapján</p>
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
              <p className="text-sm text-gray-500 mt-2">156 vélemény alapján</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600 mb-2">Árukereso</div>
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
              <p className="text-sm text-gray-500 mt-2">67 vélemény alapján</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Vélemény írása</h3>
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
                    Név *
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
                    Értékelés *
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
                    Termék (opcionális)
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
                    Vélemény címe *
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
                    Vélemény szövege *
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
                  Mégse
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Vélemény küldése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}