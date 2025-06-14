// src/app/dostawa-i-platnosc/page.tsx
import Link from 'next/link';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  Package, 
  Clock, 
  CheckCircle, 
  Shield, 
  Info, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  FileText,
  RotateCcw,
  AlertCircle,
  Timer
} from 'lucide-react';

export default function DostawaIPlatnoscPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Dostawa i płatność</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Szybka dostawa i bezpieczne płatności. Wszystkie zamówienia z darmową dostawą!
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            <Truck size={20} />
            DARMOWA DOSTAWA dla wszystkich zamówień
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Shipping Section */}
          <div className="bg-white rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Opcje dostawy</h2>
            </div>
            
            {/* Free Shipping Banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <Package className="text-white" size={28} />
                <div>
                  <h3 className="font-bold text-xl mb-1">DARMOWA DOSTAWA</h3>
                  <p className="text-green-100">Dla wszystkich zamówień • Czas dostawy: 1-2 dni robocze</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Package className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">InPost Paczkomaty</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Dostawa do paczkomatu według Twojego wyboru (20000+ punktów w całej Polsce)
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600 line-through mr-2">12,99 zł</span>
                      <span className="font-bold text-xl text-green-700">GRATIS</span>
                      <span className="text-gray-600 ml-auto">1-2 dni robocze</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Kurier DPD</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Dostawa bezpośrednio pod Twój adres
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600 line-through mr-2">16,99 zł</span>
                      <span className="font-bold text-xl text-green-700">GRATIS</span>
                      <span className="text-gray-600 ml-auto">1-2 dni robocze</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Poczta Polska</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Dostawa do najbliższej placówki pocztowej lub pod adres
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600 line-through mr-2">14,99 zł</span>
                      <span className="font-bold text-xl text-green-700">GRATIS</span>
                      <span className="text-gray-600 ml-auto">1-2 dni robocze</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-2">
                  <Info className="text-blue-600 mt-0.5" size={20} />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Dlaczego oferujemy darmową dostawę?</p>
                    <p>Cenimy naszych klientów i chcemy, aby zakupy były jak najprostsze i najbardziej opłacalne.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Process */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Timer className="text-blue-600" size={24} />
                Proces realizacji zamówienia
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">1</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Przyjęcie zamówienia</p>
                    <p className="text-sm text-gray-600">Natychmiast po złożeniu zamówienia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">2</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Pakowanie</p>
                    <p className="text-sm text-gray-600">W ciągu 24 godzin w dni robocze</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">3</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Wysyłka</p>
                    <p className="text-sm text-gray-600">Przekazanie do kuriera tego samego dnia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold text-sm">4</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Dostawa</p>
                    <p className="text-sm text-gray-600">1-2 dni robocze od wysyłki</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Metody płatności</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Płatność online kartą</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Natychmiastowa płatność przez bramkę płatności. Akceptujemy Visa, Mastercard, American Express.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Najszybszy sposób płatności</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">BLIK</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Szybka i bezpieczna płatność kodem BLIK
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Natychmiastowa realizacja</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Przelewy24</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Szybkie przelewy online ze wszystkich polskich banków
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Wszystkie polskie banki</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">PayPal</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Szybka i bezpieczna płatność przez Twoje konto PayPal
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Shield size={16} />
                      <span>Ochrona kupującego</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Przelew bankowy</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Płatność z góry na nasze konto. Wysyłka po zaksięgowaniu wpłaty.
                    </p>
                    <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded mt-2">
                      <p><strong>Nazwa:</strong> Galaxy Sklep</p>
                      <p><strong>IBAN:</strong> CZ79 2010 0000 0023 0203 4483</p>
                      <p><strong>BIC/SWIFT:</strong> FIOBCZPPXXX</p>
                      <p><strong>Bank:</strong> Fio banka</p>
                      <p className="text-xs text-gray-500 mt-2">W tytule przelewu proszę podać numer zamówienia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Package className="text-blue-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Płatność przy odbiorze</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Płatność gotówką przy odbiorze przesyłki
                    </p>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertCircle size={16} />
                      <span>Dodatkowa opłata: 5 zł</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="text-blue-600 mt-0.5" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Bezpieczeństwo płatności</p>
                  <p>Wszystkie transakcje są szyfrowane protokołem SSL. Twoje dane są bezpieczne.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="max-w-6xl mx-auto mt-12 space-y-8">
          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Dodatkowe informacje o dostawie</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  Pakowanie przesyłek
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Bezpieczne pakowanie w kartony i folie bąbelkową</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Produkty delikatne dodatkowo zabezpieczane</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Ekologiczne materiały opakowaniowe</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Śledzenie przesyłki
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Numer śledzenia wysyłany e-mailem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Powiadomienia SMS o statusie dostawy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Możliwość zmiany terminu dostawy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black flex items-center gap-2">
              <Globe className="text-blue-600" size={24} />
              Dostawa międzynarodowa
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Czechy i Słowacja</h4>
                <p className="text-sm text-gray-600">Dostawa: 2-3 dni robocze</p>
                <p className="text-sm font-semibold text-green-600">Koszt: 39 zł</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Niemcy i Austria</h4>
                <p className="text-sm text-gray-600">Dostawa: 3-4 dni robocze</p>
                <p className="text-sm font-semibold text-green-600">Koszt: 49 zł</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pozostałe kraje UE</h4>
                <p className="text-sm text-gray-600">Dostawa: 4-7 dni roboczych</p>
                <p className="text-sm font-semibold text-green-600">Koszt: od 59 zł</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-4 text-center">
              Przy zamówieniach międzynarodowych powyżej 500 zł - rabat 50% na dostawę
            </p>
          </div>

          {/* Contact & Returns */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <RotateCcw className="text-blue-600" size={20} />
                Zwroty i reklamacje
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>30 dni na zwrot towaru</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Darmowy zwrot przez InPost</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Zwrot pieniędzy w ciągu 14 dni</span>
                </li>
              </ul>
              <Link 
                href="/zwroty-i-reklamacje" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4 text-sm font-medium"
              >
                Dowiedz się więcej o zwrotach
                <ArrowLeft size={16} className="ml-1 rotate-180" />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Phone className="text-blue-600" size={20} />
                Kontakt
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <span>support@galaxysklep.pl</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Galaxy Sklep</p>
                    <p>1. máje 535/50</p>
                    <p>46007 Liberec</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic mt-2">
                  *Siedziba firmy - korespondencję prosimy wysyłać na e-mail
                </p>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Ważne informacje</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Faktury VAT</p>
                    <p className="text-gray-600 text-xs">Do każdego zamówienia</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Timer className="text-green-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Szybka wysyłka</p>
                    <p className="text-gray-600 text-xs">W ciągu 24h</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-purple-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Gwarancja</p>
                    <p className="text-gray-600 text-xs">Na wszystkie produkty</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Package className="text-orange-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Oryginalne produkty</p>
                    <p className="text-gray-600 text-xs">100% autentyczne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Najczęściej zadawane pytania</h3>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Jak długo trwa realizacja zamówienia?</h4>
                <p className="text-sm text-gray-600">
                  Zamówienia złożone do godziny 14:00 wysyłamy tego samego dnia roboczego. 
                  Dostawa zajmuje 1-2 dni robocze dla całej Polski.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Czy mogę zmienić adres dostawy po złożeniu zamówienia?</h4>
                <p className="text-sm text-gray-600">
                  Tak, możesz zmienić adres dostawy kontaktując się z nami mailowo w ciągu 12 godzin od złożenia zamówienia.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Czy wystawiacie faktury VAT?</h4>
                <p className="text-sm text-gray-600">
                  Tak, do każdego zamówienia automatycznie wystawiamy fakturę VAT, którą przesyłamy elektronicznie na podany adres e-mail.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Co w przypadku uszkodzenia przesyłki?</h4>
                <p className="text-sm text-gray-600">
                  Wszystkie przesyłki są ubezpieczone. W przypadku uszkodzenia należy sporządzić protokół szkody z kurierem 
                  i skontaktować się z nami - wymienimy towar lub zwrócimy pieniądze.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-black mb-2">Czy można odebrać zamówienie osobiście?</h4>
                <p className="text-sm text-gray-600">
                  Obecnie nie oferujemy możliwości odbioru osobistego. Wszystkie zamówienia realizujemy 
                  poprzez wysyłkę kurierską z darmową dostawą.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}