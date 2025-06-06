// src/app/polityka-prywatnosci/page.tsx
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, UserCheck, Database, AlertCircle, Mail } from 'lucide-react';

export default function PolitykaRywatnosciPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Polityka prywatności</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Twoja prywatność jest dla nas priorytetem. Tutaj znajdziesz informacje o przetwarzaniu Twoich danych osobowych.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* Controller */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">1. Administrator danych osobowych</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Administratorem danych osobowych jest <strong>Galaxy Sklep</strong><br />
                  NIP: 04688465<br />
                  Siedziba: 1. máje 535/50, 46007 Liberec, Czechy<br />
                  Email: rodo@galaxysklep.pl<br />
                  Telefon: +420 123 456 789
                </p>
              </div>
            </section>

            {/* Scope */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">2. Zakres przetwarzania danych osobowych</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Przetwarzamy tylko dane, które przekażesz nam w związku z zakupami:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Dane podstawowe</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Imię i nazwisko</li>
                    <li>• Adres e-mail</li>
                    <li>• Numer telefonu</li>
                    <li>• Adres dostawy</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Dane zakupowe</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Historia zamówień</li>
                    <li>• Dane płatnicze</li>
                    <li>• Komunikacja z obsługą klienta</li>
                    <li>• Preferencje dostawy</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Purpose */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">3. Cel przetwarzania danych osobowych</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Realizacja zamówienia</h3>
                  <p className="text-gray-700 text-sm">
                    Twoje dane są niezbędne do dostarczenia towaru i komunikacji o statusie zamówienia.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Obsługa klienta</h3>
                  <p className="text-gray-700 text-sm">
                    Do rozpatrywania reklamacji, pytań i udzielania wsparcia.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Księgowość</h3>
                  <p className="text-gray-700 text-sm">
                    Prowadzenie księgowości zgodnie z obowiązującymi przepisami prawa.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Marketing (tylko za zgodą)</h3>
                  <p className="text-gray-700 text-sm">
                    Wysyłanie informacji handlowych tylko jeśli wyraziłeś zgodę.
                  </p>
                </div>
              </div>
            </section>

            {/* Duration */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">4. Okres przechowywania danych</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Dane osobowe przechowujemy tylko przez okres niezbędny:
                    </p>
                    <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                      <li>• <strong>Dane do realizacji zamówienia:</strong> przez okres wykonywania umowy</li>
                      <li>• <strong>Dokumenty księgowe:</strong> 5 lat od końca roku obrachunkowego</li>
                      <li>• <strong>Cele marketingowe:</strong> do wycofania zgody</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Rights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">5. Twoje prawa</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                W związku z przetwarzaniem danych osobowych przysługują Ci następujące prawa:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Dostęp i sprostowanie</h3>
                  <p className="text-gray-700 text-sm">
                    Prawo dostępu do swoich danych oraz ich poprawienia w przypadku nieścisłości.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Usunięcie</h3>
                  <p className="text-gray-700 text-sm">
                    Prawo do usunięcia danych, jeśli nie są już potrzebne do pierwotnych celów.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Ograniczenie przetwarzania</h3>
                  <p className="text-gray-700 text-sm">
                    Prawo żądania ograniczenia przetwarzania Twoich danych.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Przenoszenie danych</h3>
                  <p className="text-gray-700 text-sm">
                    Prawo otrzymania swoich danych w ustrukturyzowanym formacie.
                  </p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">6. Bezpieczeństwo danych osobowych</h2>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Podjęliśmy wszelkie odpowiednie środki techniczne i organizacyjne w celu zabezpieczenia Twoich danych:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Szyfrowanie komunikacji za pomocą certyfikatu SSL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Regularne audyty bezpieczeństwa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Ograniczony dostęp do danych tylko dla upoważnionych osób</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Szkolenia pracowników w zakresie ochrony danych</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">7. Kontakt</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                W celu realizacji swoich praw lub w przypadku pytań skontaktuj się z nami:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> rodo@galaxysklep.pl<br />
                  <strong>Telefon:</strong> +420 123 456 789<br />
                  <strong>Adres:</strong> 1. máje 535/50, 46007 Liberec, Czechy
                </p>
              </div>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 text-center">
                Ostatnia aktualizacja: 1 stycznia 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}