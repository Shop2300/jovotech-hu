// src/app/zwroty-i-reklamacje/page.tsx
import Link from 'next/link';
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package,
  Truck,
  Mail,
  FileText,
  Shield,
  Heart,
  Info,
  Download,
  ChevronRight,
  Calendar,
  CreditCard,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  HelpCircle,
  Star
} from 'lucide-react';

export default function ZwrotyIReklamacjePage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Zwroty i reklamacje</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Twoja satysfakcja jest naszym priorytetem. Proces zwrotu i reklamacji jest prosty i bezproblemowy.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            <Truck size={20} />
            DARMOWY ZWROT przez InPost
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">30 dni</div>
            <div className="text-sm text-gray-600">na zwrot towaru</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">0 zł</div>
            <div className="text-sm text-gray-600">koszt zwrotu</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">14 dni</div>
            <div className="text-sm text-gray-600">zwrot pieniędzy</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">24h</div>
            <div className="text-sm text-gray-600">odpowiedź na zgłoszenie</div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Return Policy - Expanded */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Zwrot towaru</h2>
            </div>
            
            <div className="space-y-6">
              {/* Key Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-black mb-3 flex items-center gap-2">
                  <ThumbsUp className="text-green-600" size={20} />
                  Twoje korzyści
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">30 dni na zwrot (2x dłużej niż wymaga prawo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Darmowa etykieta zwrotna InPost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Zwrot pieniędzy w 14 dni</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Możliwość wymiany na inny produkt</span>
                  </li>
                </ul>
              </div>

              {/* Return Conditions */}
              <div>
                <h3 className="font-semibold text-black mb-3">Warunki zwrotu towaru:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Produkt nieużywany, w stanie niezmienionym</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Kompletny - ze wszystkimi akcesoriami i dokumentami</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">W oryginalnym opakowaniu (może być otwarte)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Z metkami producenta (jeśli dotyczy)</span>
                  </li>
                </ul>
              </div>

              {/* Products Not Eligible */}
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={20} />
                  Produkty wyłączone ze zwrotu
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Produkty wykonane na zamówienie</li>
                  <li>• Towary łatwo psujące się lub z krótkim terminem ważności</li>
                  <li>• Rozpakowane nośniki danych (CD, DVD, oprogramowanie)</li>
                  <li>• Produkty higieniczne i bielizna</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warranty - Expanded */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Gwarancja i reklamacje</h2>
            </div>
            
            <div className="space-y-6">
              {/* Warranty Period */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-black mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Okres gwarancji
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span><strong>24 miesiące</strong> - standardowa gwarancja</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span><strong>36 miesięcy</strong> - wybrane produkty premium</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Info className="text-blue-500" size={16} />
                    <span className="text-sm">Dodatkowo gwarancja producenta</span>
                  </p>
                </div>
              </div>

              {/* What's Covered */}
              <div>
                <h3 className="font-semibold text-black mb-3">Gwarancja obejmuje:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Wady fabryczne i materiałowe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Usterki techniczne nie wynikające z winy użytkownika</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Niezgodność z opisem lub specyfikacją</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Przedwczesne zużycie elementów</span>
                  </li>
                </ul>
              </div>

              {/* What's Not Covered */}
              <div>
                <h3 className="font-semibold text-black mb-3">Gwarancja nie obejmuje:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Uszkodzeń mechanicznych</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Normalnego zużycia eksploatacyjnego</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Skutków niewłaściwego użytkowania</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Napraw przez nieautoryzowany serwis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step by Step Process */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold mb-8 text-black text-center">Jak zwrócić lub zareklamować produkt?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Return Process */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <RefreshCw className="text-green-600" size={24} />
                Proces zwrotu - krok po kroku
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Zgłoś zwrot online</h4>
                    <p className="text-sm text-gray-700">Wypełnij formularz zwrotu na naszej stronie lub napisz na support@galaxysklep.pl</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Otrzymaj etykietę</h4>
                    <p className="text-sm text-gray-700">W ciągu 24h wyślemy Ci darmową etykietę zwrotną InPost</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Zapakuj produkt</h4>
                    <p className="text-sm text-gray-700">Bezpiecznie zapakuj produkt ze wszystkimi elementami</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Nadaj w paczkomacie</h4>
                    <p className="text-sm text-gray-700">Nadaj paczkę w dowolnym paczkomacie InPost</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Zwrot pieniędzy</h4>
                    <p className="text-sm text-gray-700">Po weryfikacji zwrócimy pieniądze w ciągu 14 dni</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Process */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="text-purple-600" size={24} />
                Proces reklamacji - krok po kroku
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Zgłoś reklamację</h4>
                    <p className="text-sm text-gray-700">Opisz problem na support@galaxysklep.pl lub przez formularz</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Konsultacja</h4>
                    <p className="text-sm text-gray-700">Nasz ekspert skontaktuje się w ciągu 24h</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Wysyłka do serwisu</h4>
                    <p className="text-sm text-gray-700">Jeśli konieczne, wyślij produkt (darmowa etykieta)</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Diagnoza</h4>
                    <p className="text-sm text-gray-700">Serwis sprawdza produkt (max 30 dni)</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Rozwiązanie</h4>
                    <p className="text-sm text-gray-700">Naprawa, wymiana lub zwrot pieniędzy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Download */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Formularze do pobrania</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="text-blue-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold mb-2">Formularz zwrotu</h4>
                <p className="text-sm text-gray-600 mb-4">Oświadczenie o odstąpieniu od umowy</p>
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Download size={18} />
                  Pobierz PDF
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="text-purple-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold mb-2">Formularz reklamacji</h4>
                <p className="text-sm text-gray-600 mb-4">Zgłoszenie reklamacji gwarancyjnej</p>
                <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Download size={18} />
                  Pobierz PDF
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="text-green-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold mb-2">Formularz wymiany</h4>
                <p className="text-sm text-gray-600 mb-4">Wniosek o wymianę produktu</p>
                <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Download size={18} />
                  Pobierz PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center flex items-center justify-center gap-2">
              <HelpCircle className="text-blue-600" size={28} />
              Najczęściej zadawane pytania
            </h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Czy mogę zwrócić produkt bez paragonu?</h3>
                <p className="text-gray-700">
                  Tak, wystarczy podać numer zamówienia lub adres e-mail użyty przy zakupie. 
                  Wszystkie faktury są zapisane w naszym systemie.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Jak długo trwa proces zwrotu pieniędzy?</h3>
                <p className="text-gray-700">
                  Po otrzymaniu i weryfikacji zwróconego produktu, pieniądze wracają na Twoje konto 
                  w ciągu maksymalnie 14 dni. Zwykle trwa to 3-5 dni roboczych.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Czy mogę wymienić produkt na inny?</h3>
                <p className="text-gray-700">
                  Oczywiście! Możesz wymienić produkt na inny model lub rozmiar. Jeśli nowy produkt 
                  jest droższy, dopłacasz różnicę. Jeśli tańszy - zwrócimy nadpłatę.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Kto pokrywa koszty przesyłki przy zwrocie?</h3>
                <p className="text-gray-700">
                  My! Wysyłamy darmową etykietę zwrotną InPost. Wystarczy nadać paczkę w dowolnym 
                  paczkomacie.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Co jeśli produkt został lekko użyty?</h3>
                <p className="text-gray-700">
                  Rozumiemy, że czasem trzeba sprawdzić produkt. Jeśli nie ma śladów intensywnego 
                  użytkowania i produkt jest kompletny, przyjmiemy zwrot.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Jak sprawdzić status mojego zwrotu/reklamacji?</h3>
                <p className="text-gray-700">
                  Po zgłoszeniu otrzymasz e-mail z numerem sprawy. Możesz sprawdzić status online 
                  lub kontaktując się z nami podając ten numer.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">Czy mogę anulować zamówienie?</h3>
                <p className="text-gray-700">
                  Tak, jeśli zamówienie nie zostało jeszcze wysłane. Skontaktuj się z nami jak 
                  najszybciej na support@galaxysklep.pl.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Rights */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Twoje prawa jako konsumenta</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="text-blue-600" size={20} />
                  Prawo odstąpienia od umowy
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>14 dni ustawowych + dodatkowe 16 dni od nas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Bez podania przyczyny</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Pełny zwrot kosztów produktu</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  Rękojmia i gwarancja
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>2 lata rękojmi zgodnie z Kodeksem Cywilnym</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Gwarancja producenta (jeśli jest udzielona)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Prawo wyboru: naprawa, wymiana lub zwrot</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-6 text-center">
              Więcej informacji o prawach konsumenta znajdziesz na stronie UOKiK: 
              <a href="https://uokik.gov.pl" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                www.uokik.gov.pl
              </a>
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
            <h3 className="font-semibold text-2xl mb-6 text-center">Potrzebujesz pomocy?</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-sm mb-1">Obsługa klienta:</p>
                <p className="text-sm font-medium">support@galaxysklep.pl</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Czat online</h4>
                <p className="text-sm">Dostępny codziennie</p>
                <p className="text-sm">8:00 - 20:00</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FileText className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Status sprawy</h4>
                <p className="text-sm">Śledź swoją reklamację</p>
                <p className="text-sm">Powiadomienia email</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm mb-4">Adres do zwrotów i reklamacji:</p>
              <p className="font-semibold">Galaxy Sklep, 1. máje 535/50, 46007 Liberec</p>
            </div>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="text-center">
            <h3 className="font-semibold text-xl mb-6 text-black">Dlaczego warto nam zaufać?</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Heart className="text-red-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">15 000+</p>
                <p className="text-sm text-gray-600">Zadowolonych klientów</p>
              </div>
              <div className="text-center">
                <Star className="text-yellow-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">4.9/5</p>
                <p className="text-sm text-gray-600">Średnia ocena</p>
              </div>
              <div className="text-center">
                <RefreshCw className="text-green-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">99.2%</p>
                <p className="text-sm text-gray-600">Pozytywnych zwrotów</p>
              </div>
              <div className="text-center">
                <Clock className="text-blue-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">&lt; 24h</p>
                <p className="text-sm text-gray-600">Czas odpowiedzi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}