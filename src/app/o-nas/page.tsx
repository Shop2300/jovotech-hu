// src/app/o-nas/page.tsx
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Award, 
  Heart, 
  Target, 
  TrendingUp, 
  Shield,
  Star,
  Globe,
  Truck,
  CheckCircle,
  Package,
  Sparkles,
  Lightbulb,
  HandshakeIcon,
  Clock,
  Building,
  Leaf,
  Trophy,
  ChevronRight,
  Quote
} from 'lucide-react';

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
            Poznaj Galaxy Sklep - Twojego zaufanego partnera w zakupach online od 2020 roku
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-4 text-black">Witamy w Galaxy Sklep</h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
                Jesteśmy więcej niż tylko sklepem internetowym - jesteśmy Twoim partnerem w odkrywaniu 
                najlepszych produktów w najlepszych cenach.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="font-medium">100% Oryginalne produkty</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                  <Truck className="text-blue-500" size={18} />
                  <span className="font-medium">Darmowa dostawa</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                  <Shield className="text-purple-500" size={18} />
                  <span className="font-medium">Bezpieczne zakupy</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">15 000+</div>
                <div className="text-gray-600">Zadowolonych klientów</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">75 000+</div>
                <div className="text-gray-600">Zrealizowanych zamówień</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Średnia ocena</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Poleca nas dalej</div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-blue-600" size={32} />
                <h2 className="text-2xl font-semibold text-black">Nasza misja</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Dostarczamy najwyższej jakości produkty w przystępnych cenach, budując długotrwałe 
                relacje oparte na zaufaniu i uczciwości. Każdego dnia staramy się przekraczać 
                oczekiwania naszych klientów, oferując nie tylko produkty, ale kompletne rozwiązania 
                i wyjątkowe doświadczenia zakupowe.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-purple-600" size={32} />
                <h2 className="text-2xl font-semibold text-black">Nasza wizja</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Dążymy do bycia pierwszym wyborem klientów szukających jakości, uczciwości i 
                profesjonalizmu. Chcemy tworzyć przestrzeń, gdzie zakupy online są nie tylko 
                wygodne, ale także przyjemne i bezpieczne. Naszą ambicją jest ciągły rozwój 
                i wprowadzanie innowacji, które ułatwią życie naszym klientom.
              </p>
            </div>
          </div>

          {/* Our Values - Expanded */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Wartości, którymi się kierujemy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Klient na pierwszym miejscu</h3>
                <p className="text-gray-700 text-center">
                  Twoje zadowolenie jest naszym priorytetem. Zapewniamy indywidualne podejście, 
                  szybką reakcję na pytania i profesjonalną obsługę na każdym etapie zakupów.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Jakość i oryginalność</h3>
                <p className="text-gray-700 text-center">
                  Współpracujemy wyłącznie z oficjalnymi dystrybutorami. Każdy produkt jest 
                  sprawdzany i posiada gwarancję producenta oraz nasze wsparcie posprzedażowe.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="text-red-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Uczciwe podejście</h3>
                <p className="text-gray-700 text-center">
                  Transparentne ceny bez ukrytych kosztów, jasne warunki współpracy i zawsze 
                  szczere, partnerskie relacje z każdym klientem.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6">
                <div className="bg-purple-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="text-purple-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Innowacyjność</h3>
                <p className="text-gray-700 text-center">
                  Stale ulepszamy nasz sklep, wprowadzamy nowe funkcje i śledzimy trendy, 
                  aby oferować najnowocześniejsze rozwiązania zakupowe.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-orange-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <HandshakeIcon className="text-orange-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Partnerstwo</h3>
                <p className="text-gray-700 text-center">
                  Budujemy długotrwałe relacje oparte na wzajemnym szacunku i zaufaniu, 
                  zarówno z klientami, jak i dostawcami.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-teal-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="text-teal-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Odpowiedzialność</h3>
                <p className="text-gray-700 text-center">
                  Dbamy o środowisko używając ekologicznych opakowań i minimalizując ślad 
                  węglowy poprzez optymalizację dostaw.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Nasza droga do sukcesu</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2020
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Powstanie Galaxy Sklep</h3>
                  <p className="text-gray-700">
                    Rozpoczęliśmy działalność jako mały sklep internetowy z wizją dostarczania 
                    wysokiej jakości produktów. Pierwsze zamówienia realizowaliśmy z domowego biura.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    2021
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Pierwsze 1000 klientów</h3>
                  <p className="text-gray-700">
                    Przekroczyliśmy magiczną barierę 1000 zadowolonych klientów. Otworzyliśmy 
                    własny magazyn i zatrudniliśmy pierwszych pracowników.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2022
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Rozszerzenie asortymentu</h3>
                  <p className="text-gray-700">
                    Znacząco poszerzyliśmy ofertę produktową i nawiązaliśmy współpracę z nowymi, 
                    renomowanymi dostawcami. Wprowadziliśmy program lojalnościowy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    2023
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Nowy magazyn i automatyzacja</h3>
                  <p className="text-gray-700">
                    Przenieśliśmy się do większego magazynu w Libercu. Zautomatyzowaliśmy proces 
                    pakowania i wprowadziliśmy system zarządzania magazynem.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    2024
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Ekspansja międzynarodowa</h3>
                  <p className="text-gray-700">
                    Rozpoczęliśmy dostawy do Czech, Słowacji i Niemiec. Otrzymaliśmy certyfikat 
                    "Zaufany Sklep Online" i nagrodę za najlepszą obsługę klienta.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    2025
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Darmowa dostawa dla wszystkich</h3>
                  <p className="text-gray-700">
                    Wprowadziliśmy darmową dostawę dla wszystkich zamówień. Planujemy dalszą 
                    ekspansję i wprowadzenie własnej aplikacji mobilnej.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Nasz zespół</h2>
            
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Za sukcesem Galaxy Sklep stoi zespół pasjonatów e-commerce, którzy każdego dnia 
                pracują nad tym, aby Twoje zakupy były jeszcze lepsze.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Package className="text-blue-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">Dział Zakupów</h4>
                  <p className="text-sm text-gray-600">Wybierają najlepsze produkty</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Users className="text-green-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">Obsługa Klienta</h4>
                  <p className="text-sm text-gray-600">Zawsze pomocni i uśmiechnięci</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Truck className="text-purple-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">Magazyn i Logistyka</h4>
                  <p className="text-sm text-gray-600">Szybka i bezpieczna wysyłka</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Globe className="text-orange-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">IT i Marketing</h4>
                  <p className="text-sm text-gray-600">Nowoczesne rozwiązania</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Testimonial */}
          <div className="bg-white rounded-lg p-8 mb-8 text-center">
            <Quote className="text-gray-300 mx-auto mb-4" size={48} />
            <blockquote className="text-xl text-gray-700 italic mb-4 max-w-3xl mx-auto">
              "Galaxy Sklep to więcej niż sklep - to partner, któremu mogę zaufać. 
              Zawsze otrzymuję produkty najwyższej jakości, a obsługa klienta jest na 
              najwyższym poziomie. Polecam każdemu!"
            </blockquote>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={20} />
              ))}
            </div>
            <p className="text-gray-600">- Anna K., stała klientka od 2021 roku</p>
          </div>

          {/* Certifications & Awards */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Certyfikaty i nagrody</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <Trophy className="text-gold-500 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">Najlepszy E-sklep 2024</h4>
                <p className="text-xs text-gray-600 mt-1">Kategoria: Obsługa Klienta</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <Shield className="text-blue-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">Zaufany Sklep Online</h4>
                <p className="text-xs text-gray-600 mt-1">Certyfikat bezpieczeństwa</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <Award className="text-green-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">ISO 9001:2015</h4>
                <p className="text-xs text-gray-600 mt-1">System zarządzania jakością</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <Star className="text-purple-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">Top 100 E-commerce</h4>
                <p className="text-xs text-gray-600 mt-1">Ranking Forbes 2024</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us - Expanded */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Co nas wyróżnia?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Package className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Szeroki asortyment</h3>
                  <p className="text-gray-700">
                    Ponad 10 000 produktów w stałej ofercie. Od elektroniki przez dom i ogród 
                    po artykuły sportowe - znajdziesz u nas wszystko czego potrzebujesz.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <TrendingUp className="text-green-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Najlepsze ceny</h3>
                  <p className="text-gray-700">
                    Codziennie monitorujemy rynek i negocjujemy z dostawcami, aby oferować 
                    Ci najkorzystniejsze ceny. Dodatkowo regularne promocje i rabaty.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Clock className="text-purple-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Ekspresowa realizacja</h3>
                  <p className="text-gray-700">
                    Zamówienia złożone do 14:00 wysyłamy tego samego dnia. Średni czas 
                    przygotowania paczki to tylko 2 godziny.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Heart className="text-red-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Wsparcie 7 dni w tygodniu</h3>
                  <p className="text-gray-700">
                    Nasz zespół obsługi klienta jest dostępny codziennie. Odpowiadamy na 
                    e-maile w ciągu maksymalnie 2 godzin.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Shield className="text-orange-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Gwarancja satysfakcji</h3>
                  <p className="text-gray-700">
                    30 dni na zwrot bez podania przyczyny. Dodatkowo oferujemy rozszerzoną 
                    gwarancję na wszystkie produkty elektroniczne.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Truck className="text-teal-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Darmowa dostawa</h3>
                  <p className="text-gray-700">
                    Wszystkie zamówienia wysyłamy za darmo. Bez minimalnej kwoty zamówienia, 
                    bez ukrytych kosztów - zawsze 0 zł za dostawę.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Responsibility */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-black text-center">Społeczna odpowiedzialność</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6">
                <Leaf className="text-green-600 mx-auto mb-3" size={40} />
                <h3 className="font-semibold text-center mb-2">Ekologia</h3>
                <p className="text-gray-700 text-sm text-center">
                  Używamy tylko biodegradowalnych materiałów opakowaniowych. W 2024 roku 
                  zredukowaliśmy emisję CO2 o 40%.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <Heart className="text-red-600 mx-auto mb-3" size={40} />
                <h3 className="font-semibold text-center mb-2">Działalność charytatywna</h3>
                <p className="text-gray-700 text-sm text-center">
                  Co roku wspieramy lokalne organizacje charytatywne. W 2024 przekazaliśmy 
                  ponad 50 000 zł na cele społeczne.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <Users className="text-blue-600 mx-auto mb-3" size={40} />
                <h3 className="font-semibold text-center mb-2">Lokalna społeczność</h3>
                <p className="text-gray-700 text-sm text-center">
                  Współpracujemy z lokalnymi dostawcami i zatrudniamy mieszkańców regionu, 
                  wspierając lokalną gospodarkę.
                </p>
              </div>
            </div>
          </div>

          {/* Future Plans */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-black text-center">Nasze plany na przyszłość</h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Aplikacja mobilna</h4>
                  <p className="text-gray-700 text-sm">
                    Już wkrótce uruchomimy aplikację mobilną z ekskluzywymi ofertami dla użytkowników.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Własna marka produktów</h4>
                  <p className="text-gray-700 text-sm">
                    Pracujemy nad linią produktów pod własną marką Galaxy, łączących jakość z przystępną ceną.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Punkty odbioru</h4>
                  <p className="text-gray-700 text-sm">
                    Planujemy otworzyć własne punkty odbioru w największych miastach Polski.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Program partnerski</h4>
                  <p className="text-gray-700 text-sm">
                    Wprowadzamy program afiliacyjny dla blogerów i influencerów.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">Masz pytania? Chcesz nawiązać współpracę?</h2>
            <p className="text-lg mb-6 text-blue-100">
              Jesteśmy otwarci na nowe możliwości i zawsze chętnie odpowiadamy na pytania.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Skontaktuj się z nami
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Przejdź do sklepu
                <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}