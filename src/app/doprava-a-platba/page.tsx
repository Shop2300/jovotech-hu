// src/app/doprava-a-platba/page.tsx
import Link from 'next/link';
import { ArrowLeft, Truck, CreditCard, Package, Clock, CheckCircle } from 'lucide-react';

export default function DopravaAPlatbaPage() {
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
            Zpět na hlavní stránku
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Doprava a platba</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vyberte si z našich rychlých a spolehlivých možností dopravy a platby
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Shipping Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Možnosti dopravy</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Package className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Zásilkovna</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Doručení na výdejní místo dle vašeho výběru (7000+ míst po celé ČR)
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg">89 Kč</span>
                      <span className="text-gray-600">2-3 pracovní dny</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Osobní odběr</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Vyzvednutí na naší prodejně: Václavské náměstí 123, Praha 1
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600">Zdarma</span>
                      <span className="text-gray-600">Ihned k dispozici</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Česká pošta - balík do ruky</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Doručení přímo na vaši adresu
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg">119 Kč</span>
                      <span className="text-gray-600">2-3 pracovní dny</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900 font-medium">
                  <strong>Doprava zdarma</strong> při nákupu nad 1 000 Kč
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Platební metody</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Platba kartou online</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Okamžitá platba prostřednictvím platební brány. Akceptujeme Visa, Mastercard.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Nejrychlejší způsob platby</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Package className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Platba na dobírku</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Platba při převzetí zboží. Příplatek 30 Kč.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>Platba při doručení</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Bankovní převod</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Platba předem na náš účet. Zboží odesíláme po připsání platby.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>Číslo účtu: 123456789/0100</p>
                      <p>Variabilní symbol: číslo objednávky</p>
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
                      Rychlá a bezpečná platba přes váš PayPal účet.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Ochrana kupujícího</span>
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
            <h3 className="font-semibold text-xl mb-4 text-black text-center">Důležité informace</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Všechny ceny jsou uvedeny včetně DPH</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Zboží expedujeme do 24 hodin od přijetí platby</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>O stavu objednávky vás informujeme e-mailem</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={16} />
                <span>Ke každé objednávce vystavujeme daňový doklad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}