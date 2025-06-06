// src/app/o-nas/page.tsx
import Link from 'next/link';
import { ArrowLeft, Users, Award, Heart, Target, TrendingUp, Shield } from 'lucide-react';

export default function ONasPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Powrót do strony głównej
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">O nas</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Poznaj historię naszego sklepu i wartości, którymi się kierujemy
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Witamy w Galaxy Sklep</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Jesteśmy nowoczesnym sklepem internetowym z tradycją od 2020 roku. Specjalizujemy się w sprzedaży 
                wysokiej jakości produktów w uczciwych cenach, kładąc nacisk na zadowolenie klientów.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">10 000+</div>
                <div className="text-gray-600">Zadowolonych klientów</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">50 000+</div>
                <div className="text-gray-600">Zrealizowanych zamówień</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
                <div className="text-gray-600">Ocena klientów</div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Nasze wartości</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-2">Klient na pierwszym miejscu</h3>
                <p className="text-gray-700">
                  Twoje zadowolenie jest naszym priorytetem. Zapewniamy indywidualne podejście i profesjonalną obsługę.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-2">Jakość i oryginalność</h3>
                <p className="text-gray-700">
                  Sprzedajemy wyłącznie oryginalne produkty od sprawdzonych dostawców z gwarancją jakości.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="text-red-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-2">Uczciwe podejście</h3>
                <p className="text-gray-700">
                  Transparentne ceny, brak ukrytych opłat i zawsze uczciwe traktowanie.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-black">Nasza historia</h2>
            
            <div className="prose prose-lg max-w-none">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Galaxy Sklep powstał w 2020 roku z jasną wizją - stworzyć miejsce, gdzie klienci 
                  znajdą wysokiej jakości produkty, uczciwe ceny i przede wszystkim ludzkie podejście. 
                  Zaczynaliśmy jako mały rodzinny biznes z kilkoma produktami i wielkimi marzeniami.
                </p>
                <p>
                  Dzięki zaufaniu naszych klientów i ciężkiej pracy stopniowo rozwinęliśmy się w jeden 
                  z wiodących sklepów internetowych. Dziś oferujemy tysiące produktów i codziennie 
                  realizujemy setki zamówień.
                </p>
                <p>
                  Mimo naszego rozwoju pozostajemy wierni naszym wartościom - każdy klient jest dla nas 
                  ważny, a każde zamówienie realizowane jest z maksymalną starannością.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Dlaczego warto u nas kupować?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <Target className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Szeroki asortyment</h3>
                  <p className="text-gray-700">
                    Stale poszerzamy naszą ofertę o nowe i interesujące produkty.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <TrendingUp className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Konkurencyjne ceny</h3>
                  <p className="text-gray-700">
                    Regularnie monitorujemy rynek i gwarantujemy uczciwe ceny.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <Shield className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Bezpieczne zakupy</h3>
                  <p className="text-gray-700">
                    Zabezpieczona bramka płatnicza i ochrona Twoich danych osobowych.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <Heart className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Dbałość o klientów</h3>
                  <p className="text-gray-700">
                    Nasz zespół jest do Twojej dyspozycji każdego dnia roboczego od 8:00 do 18:00.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}