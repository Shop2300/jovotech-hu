// src/app/zwroty-i-reklamacje/page.tsx
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

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
            Twoja satysfakcja jest naszym priorytetem. Tutaj znajdziesz wszystko o zwrotach i reklamacjach.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Return Policy */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Zwrot towaru</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">14 dni na zwrot</h3>
                    <p className="text-gray-700 text-sm">
                      Masz prawo odstąpić od umowy w ciągu 14 dni od otrzymania towaru bez podania przyczyny.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-black">Warunki zwrotu towaru:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Towar musi być nieuszkodzony i nieużywany</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">W oryginalnym opakowaniu wraz ze wszystkimi elementami</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Ze wszystkimi metkami i etykietami</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Z kopią faktury lub dokumentu dostawy</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-black mb-3">Procedura zwrotu:</h3>
                <ol className="space-y-2 list-decimal list-inside text-gray-700">
                  <li>Wypełnij formularz odstąpienia od umowy</li>
                  <li>Zapakuj towar wraz ze wszystkimi elementami</li>
                  <li>Wyślij na adres: 1. máje 535/50, 46007 Liberec</li>
                  <li>Po otrzymaniu towaru zwrócimy pieniądze w ciągu 14 dni</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Regulamin reklamacji</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">Okres gwarancji</h3>
                    <p className="text-gray-700 text-sm">
                      Na wszystkie produkty udzielamy 24-miesięcznej gwarancji od daty zakupu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-black">Jak reklamować towar:</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  <li className="text-gray-700">
                    <strong>Skontaktuj się z nami</strong> - napisz na support@galaxysklep.pl lub zadzwoń +420 123 456 789
                  </li>
                  <li className="text-gray-700">
                    <strong>Opisz wadę</strong> - jak najdokładniej opisz, na czym polega wada produktu
                  </li>
                  <li className="text-gray-700">
                    <strong>Wyślij towar</strong> - wraz z kopią dowodu zakupu
                  </li>
                  <li className="text-gray-700">
                    <strong>Rozpatrzenie reklamacji</strong> - do 30 dni od otrzymania towaru
                  </li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-black mb-3">Gwarancja nie obejmuje:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Uszkodzeń mechanicznych spowodowanych przez użytkownika</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Normalnego zużycia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Uszkodzeń wynikających z niewłaściwego użytkowania</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Ingerencji nieautoryzowanego serwisu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Kontakt do reklamacji</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
              <div>
                <strong className="block mb-1">Adres:</strong>
                <p>1. máje 535/50</p>
                <p>46007 Liberec</p>
                <p>Czechy</p>
              </div>
              <div>
                <strong className="block mb-1">Email:</strong>
                <p>reklamacje@galaxysklep.pl</p>
              </div>
              <div>
                <strong className="block mb-1">Telefon:</strong>
                <p>+420 123 456 789</p>
              </div>
              <div>
                <strong className="block mb-1">Godziny pracy:</strong>
                <p>Pon-Pt 8:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}