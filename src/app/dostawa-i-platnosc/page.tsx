// src/app/dostawa-i-platnosc/page.tsx
import Link from 'next/link';
import { ArrowLeft, Truck, CreditCard, Package, Clock, CheckCircle } from 'lucide-react';

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
            Wybierz z naszych szybkich i niezawodnych opcji dostawy i płatności
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Shipping Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Opcje dostawy</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Package className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">InPost Paczkomaty</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Dostawa do paczkomatu według Twojego wyboru (20000+ punktów w całej Polsce)
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg">12,99 zł</span>
                      <span className="text-gray-600">1-2 dni robocze</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Kurier DPD</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Dostawa bezpośrednio pod Twój adres
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg">16,99 zł</span>
                      <span className="text-gray-600">1-2 dni robocze</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Poczta Polska</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Dostawa do najbliższej placówki pocztowej lub pod adres
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg">14,99 zł</span>
                      <span className="text-gray-600">2-3 dni robocze</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Odbiór osobisty</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Odbiór w naszym magazynie: 1. máje 535/50, Liberec (Czechy)
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600">Bezpłatnie</span>
                      <span className="text-gray-600">Po uzgodnieniu</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900 font-medium">
                  <strong>Darmowa dostawa</strong> przy zamówieniach powyżej 200 zł
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
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
                      Natychmiastowa płatność przez bramkę płatności. Akceptujemy Visa, Mastercard.
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
                  <Package className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Płatność przy odbiorze</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Płatność przy odbiorze przesyłki. Dodatkowa opłata 5 zł.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>Płatność przy dostawie</span>
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
                    <div className="text-sm text-gray-600">
                      <p>Numer konta: PL12 3456 7890 1234 5678 9012 3456</p>
                      <p>Tytuł: numer zamówienia</p>
                      <p>Nazwa: Galaxy Sklep</p>
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
                      Szybka i bezpieczna płatność kodem BLIK.
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
                    <h3 className="font-semibold text-black mb-1">PayPal</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Szybka i bezpieczna płatność przez Twoje konto PayPal.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Ochrona kupującego</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-4 text-black text-center">Ważne informacje</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Wszystkie ceny zawierają VAT</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Wysyłka w ciągu 24 godzin od wpłaty</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Informujemy e-mailem o statusie zamówienia</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Do każdego zamówienia wystawiamy fakturę</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}