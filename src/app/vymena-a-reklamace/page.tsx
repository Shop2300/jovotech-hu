// src/app/vymena-a-reklamace/page.tsx
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function VymenaAReklamacePage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Výměna a reklamace</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vaše spokojenost je naší prioritou. Zde najdete vše o vrácení a reklamaci zboží.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Return Policy */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Výměna zboží</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">14 dní na vrácení</h3>
                    <p className="text-gray-700 text-sm">
                      Máte právo odstoupit od smlouvy do 14 dnů od převzetí zboží bez udání důvodu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-black">Podmínky pro vrácení zboží:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Zboží musí být nepoškozené a nepoužívané</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">V původním obalu včetně všech součástí</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Se všemi visačkami a etiketami</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">S kopií faktury nebo dodacího listu</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-black mb-3">Postup při vrácení:</h3>
                <ol className="space-y-2 list-decimal list-inside text-gray-700">
                  <li>Vyplňte formulář pro odstoupení od smlouvy</li>
                  <li>Zabalte zboží včetně všech součástí</li>
                  <li>Odešlete na adresu: Václavské náměstí 123, 110 00 Praha 1</li>
                  <li>Po obdržení zboží vám do 14 dnů vrátíme peníze</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Reklamační řád</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">Záruční doba</h3>
                    <p className="text-gray-700 text-sm">
                      Na všechny produkty poskytujeme záruku 24 měsíců od data nákupu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-black">Jak reklamovat zboží:</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  <li className="text-gray-700">
                    <strong>Kontaktujte nás</strong> - napište na info@muj-eshop.cz nebo volejte +420 123 456 789
                  </li>
                  <li className="text-gray-700">
                    <strong>Popište závadu</strong> - co nejpodrobněji popište, v čem spočívá vada výrobku
                  </li>
                  <li className="text-gray-700">
                    <strong>Odešlete zboží</strong> - společně s kopií dokladu o koupi
                  </li>
                  <li className="text-gray-700">
                    <strong>Vyřízení reklamace</strong> - do 30 dnů od přijetí zboží
                  </li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-black mb-3">Záruka se nevztahuje na:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Mechanické poškození způsobené uživatelem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Běžné opotřebení</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Poškození nesprávným používáním</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Zásah neautorizovaným servisem</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Kontakt pro reklamace</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
              <div>
                <strong className="block mb-1">Adresa:</strong>
                <p>Václavské náměstí 123</p>
                <p>110 00 Praha 1</p>
              </div>
              <div>
                <strong className="block mb-1">Email:</strong>
                <p>reklamace@muj-eshop.cz</p>
              </div>
              <div>
                <strong className="block mb-1">Telefon:</strong>
                <p>+420 123 456 789</p>
              </div>
              <div>
                <strong className="block mb-1">Provozní doba:</strong>
                <p>Po-Pá 8:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}