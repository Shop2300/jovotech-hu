// src/app/szkoly-i-instytucje-publiczne/page.tsx
'use client';

import { Metadata } from 'next';
import { FileCheck, Clock, Package, Building2, School, Heart, Trophy, Check, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function PublicInstitutionsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    message: ''
  });

  const companyLogos = [
    '/images/trust_us/company_logo1.webp',
    '/images/trust_us/company_logo2.webp',
    '/images/trust_us/company_logo3.webp',
    '/images/trust_us/company_logo4.webp',
    '/images/trust_us/company_logo5.webp',
    '/images/trust_us/company_logo6.webp',
    '/images/trust_us/company_logo7.webp',
    '/images/trust_us/company_logo8.webp',
    '/images/trust_us/company_logo9.webp',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#131921] mb-6">
            Oferta dla szkół i instytucji publicznych
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Witamy na stronie przeznaczonej dla <strong>instytucji publicznych, szkół, urzędów, organizacji pozarządowych</strong> 
            i innych podmiotów publicznych. Jako dostawca wysokiej jakości produktów rozumiemy specyficzne potrzeby 
            i wymagania instytucji publicznych przy zakupach online. Na tej stronie znajdą Państwo informacje 
            o tym, jak możemy ułatwić proces zakupowy i jakie korzyści oferujemy.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Korzyści współpracy z Galaxy Sklep dla instytucji publicznych
          </h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Płatność na fakturę</strong> z terminem płatności 14 do 30 dni, bez konieczności płatności z góry.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Szybka dostawa</strong> - większość produktów na magazynie z wysyłką tego samego dnia przy zamówieniu do godz. 14:00.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Indywidualne oferty cenowe</strong> dla większych zamówień i możliwość rabatów ilościowych.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Fachowe doradztwo</strong> i wsparcie techniczne przy wyborze produktów.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Możliwość zawarcia umowy ramowej</strong> dla długoterminowej współpracy.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Standardowa gwarancja 24 miesiące</strong> również dla organizacji z NIP.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Certyfikowane produkty</strong> z polską dokumentacją.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Serwis i wsparcie</strong> w języku polskim, w tym rozpatrywanie reklamacji.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Jak przebiega proces zakupowy dla instytucji publicznych
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Zapytanie i oferta cenowa</h3>
              </div>
              <p className="text-gray-600">
                Wyślij nam niewiążące zapytanie e-mailem lub za pomocą formularza na stronie. 
                Chętnie przygotujemy indywidualną ofertę cenową dostosowaną do Państwa wymagań, 
                którą można wykorzystać w wewnętrznym procesie zatwierdzania w Państwa instytucji.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Zamówienie</h3>
              </div>
              <p className="text-gray-600">
                Po zatwierdzeniu oferty prosimy o przesłanie oficjalnego zamówienia z numerem, 
                pieczątką i podpisem osoby odpowiedzialnej e-mailem. Potwierdzimy zamówienie 
                i zapewnimy wysyłkę towaru.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Dostawa i fakturowanie</h3>
              </div>
              <p className="text-gray-600">
                Towar dostarczymy pod wskazany przez Państwa adres. Po dostawie wystawimy 
                fakturę z terminem płatności 14 dni (na życzenie do 30 dni) z podaniem 
                numeru Państwa zamówienia dla łatwego dopasowania w księgowości.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Serwis i wsparcie</h3>
              </div>
              <p className="text-gray-600">
                Również po zakupie zapewniamy pełne wsparcie, instrukcje w języku polskim 
                i w razie potrzeby priorytetowo rozpatrujemy reklamacje. Na wszystkie 
                produkty udzielamy standardowej gwarancji 24 miesięcy.
              </p>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Proces zamówienia i fakturowania dla instytucji publicznych
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <FileCheck className="text-[#6da306]" size={24} />
                Sposoby zamówienia
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bezpośrednie zamówienie przez e-sklep (z uwagą o płatności na fakturę)</li>
                <li>• E-mailem z oficjalnym zamówieniem Państwa instytucji</li>
                <li>• Telefonicznie z późniejszym potwierdzeniem e-mailem</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <Package className="text-[#6da306]" size={24} />
                Warunki płatności
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Płatność na fakturę z terminem płatności 14 dni (standardowo)</li>
                <li>• Możliwość wydłużonego terminu płatności do 30 dni (na życzenie)</li>
                <li>• Bez wymogu zaliczki z góry dla standardowych produktów</li>
                <li>• Możliwość indywidualnych warunków płatności dla stałych klientów</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <FileCheck className="text-[#6da306]" size={24} />
                Wymagania fakturowania
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Faktura zawiera numer Państwa zamówienia dla łatwiejszego parowania</li>
                <li>• Prawidłowo podane dane fakturowe instytucji (NIP, adres)</li>
                <li>• Możliwość różnych danych dostawy i fakturowania</li>
                <li>• Wszystkie wymagania dokumentu podatkowego</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <Clock className="text-[#6da306]" size={24} />
                Transport i dostawa
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Wysyłka towaru z magazynu tego samego dnia (przy zamówieniu do 14:00)</li>
                <li>• Dostawa w całej Polsce w 1-2 dni robocze</li>
                <li>• Informacje o wysyłce i śledzenie przesyłki e-mailem</li>
                <li>• Możliwość specyficznych wymagań dostawy (termin, czas)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Public Procurement Section */}
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#131921] mb-6">
            Zamówienia publiczne i zakupy powyżej 130 000 zł
          </h2>
          <p className="text-gray-700 mb-6">
            Rozumiemy wymagania instytucji publicznych przy realizacji zamówień publicznych 
            o małej wartości oraz większych zamówień. Dla zamówień powyżej 130 000 zł netto oferujemy:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>Dostarczenie wszystkich niezbędnych dokumentów do postępowania przetargowego (dokumenty kwalifikacyjne, certyfikaty produktów)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>Możliwość zawarcia pisemnej umowy kupna zgodnie z Państwa wewnętrznymi przepisami</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>Przygotowanie szczegółowej oferty cenowej spełniającej warunki przetargu</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>Indywidualne podejście do dużych projektów, w tym możliwość osobistej konsultacji</span>
            </li>
          </ul>
        </div>

        {/* Products for Institutions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Produkty odpowiednie dla instytucji publicznych
          </h2>
          <p className="text-gray-700 mb-8">
            Oferujemy szeroką gamę wysokiej jakości produktów odpowiednich dla różnych typów instytucji publicznych:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <School className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Dla szkół i placówek edukacyjnych
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Wyposażenie warsztatowe i narzędzia</li>
                <li>• Sprzęt laboratoryjny</li>
                <li>• Wyposażenie gastronomiczne dla stołówek szkolnych</li>
                <li>• Pomoce techniczne do nauki</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Building2 className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Dla urzędów i budynków administracyjnych
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Wyposażenie biurowe i magazynowe</li>
                <li>• Sprzęt techniczny do konserwacji</li>
                <li>• Systemy klimatyzacji i ogrzewania</li>
                <li>• Meble i wyposażenie</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Trophy className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Dla obiektów sportowych i kulturalnych
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sprzęt sportowy i akcesoria</li>
                <li>• Zaplecze techniczne do wydarzeń</li>
                <li>• Meble i wyposażenie pomieszczeń</li>
                <li>• Systemy nagłośnienia</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Heart className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Dla placówek socjalnych i medycznych
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Wyposażenie gastronomiczne i akcesoria</li>
                <li>• Pomoce techniczne do obsługi</li>
                <li>• Wyposażenie specjalistyczne</li>
                <li>• Meble i wyposażenie</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Zaufali nam
          </h2>
          <p className="text-gray-700 mb-8">
            Współpracujemy z wieloma zadowolonymi firmami i organizacjami z różnych branż.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 items-center">
            {companyLogos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Image
                  src={logo}
                  alt={`Logo firmy ${index + 1}`}
                  width={100}
                  height={60}
                  className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Często zadawane pytania
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Czy można otrzymać próbki produktów przed większym zakupem?
              </h3>
              <p className="text-gray-700">
                Tak, dla wybranych produktów oferujemy możliwość prezentacji lub wypożyczenia próbek. 
                Skontaktuj się z nami pod adresem support@galaxysklep.pl po więcej informacji.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Jakie dokumenty są potrzebne do zamówienia na fakturę?
              </h3>
              <p className="text-gray-700">
                Przy pierwszym zamówieniu na fakturę potrzebujemy oficjalne zamówienie z NIP, 
                adresem do faktury, adresem dostawy, osobą kontaktową i podpisem osoby odpowiedzialnej.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Czy można wydłużyć termin płatności faktury ponad 14 dni?
              </h3>
              <p className="text-gray-700">
                Tak, na życzenie możemy zapewnić termin płatności do 30 dni, szczególnie 
                w przypadku większych zamówień lub stałych klientów.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Czy produkty spełniają europejskie normy i certyfikaty?
              </h3>
              <p className="text-gray-700">
                Tak, wszystkie produkty posiadają certyfikat CE i spełniają odpowiednie normy europejskie. 
                Na życzenie dostarczamy niezbędne certyfikaty i dokumentację techniczną.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Co jeśli potrzebujemy produktów, których obecnie nie ma na stronie?
              </h3>
              <p className="text-gray-700">
                Mamy dostęp do szerokiego portfolio produktów. Skontaktuj się z nami z zapytaniem 
                pod adresem support@galaxysklep.pl, a sprawdzimy dostępność również produktów, 
                których aktualnie nie ma w ofercie e-sklepu.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-green-50 border-l-4 border-[#6da306] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#131921] mb-6">
            Skontaktuj się z nami po indywidualną ofertę
          </h2>
          <p className="text-gray-700 mb-6">
            Jeśli są Państwo zainteresowani indywidualną ofertą cenową dla swojej instytucji 
            lub mają jakiekolwiek pytania dotyczące produktów, prosimy o kontakt. Nasz zespół 
            jest gotowy zapewnić kompleksowe wsparcie i doradztwo.
          </p>
          
          <div className="mb-8">
            <p className="font-semibold text-[#131921] flex items-center gap-2">
              <Mail className="text-[#6da306]" size={20} />
              E-mail: <a href="mailto:support@galaxysklep.pl" className="text-[#6da306] underline">support@galaxysklep.pl</a>
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6da306]"
                  style={{ '--field-index': 0 } as React.CSSProperties}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6da306]"
                  style={{ '--field-index': 1 } as React.CSSProperties}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6da306]"
                  style={{ '--field-index': 2 } as React.CSSProperties}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa instytucji *
                </label>
                <input
                  type="text"
                  name="institution"
                  required
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6da306]"
                  style={{ '--field-index': 3 } as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wiadomość *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6da306]"
                placeholder="Proszę opisać swoje potrzeby..."
                style={{ '--field-index': 4 } as React.CSSProperties}
              />
            </div>

            <button
              type="submit"
              className="bg-[#6da306] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#5d8f05] transition-colors"
            >
              Wyślij zapytanie
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}