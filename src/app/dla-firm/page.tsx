// src/app/dla-firm/page.tsx
import { Metadata } from 'next';
import { Building2, Users, CreditCard, Package, FileCheck, HeadphonesIcon, TrendingUp, Shield } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Dla firm + | Rozwiązania biznesowe - Galaxy Sklep',
  description: 'Specjalne warunki dla firm. Faktury VAT, odroczone płatności, dedykowany opiekun i rabaty dla stałych klientów.',
};

export default function BusinessPage() {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#6da306] rounded-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#131921] mb-4">
            Galaxy Sklep dla Twojego biznesu
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dołącz do tysięcy firm, które zaufały nam jako swojemu dostawcy. 
            Oferujemy specjalne warunki współpracy dostosowane do potrzeb biznesowych.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <CreditCard className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Faktury VAT</h3>
            <p className="text-sm text-gray-600">
              Automatyczne wystawianie faktur VAT dla każdego zamówienia
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Rabaty ilościowe</h3>
            <p className="text-sm text-gray-600">
              Atrakcyjne rabaty przy większych zamówieniach
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Dedykowany opiekun</h3>
            <p className="text-sm text-gray-600">
              Osobisty doradca dla Twojej firmy
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Priorytetowa dostawa</h3>
            <p className="text-sm text-gray-600">
              Szybka realizacja zamówień biznesowych
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#131921] text-center mb-8">
            Zaufali nam
          </h2>
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

        {/* Services Section */}
        <div className="bg-[#6da306] text-white rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Co oferujemy firmom?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileCheck className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Odroczone płatności</h4>
                  <p className="text-white/90 text-sm">
                    Możliwość płatności z odroczonym terminem do 30 dni
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Gwarancja i wsparcie</h4>
                  <p className="text-white/90 text-sm">
                    Rozszerzona gwarancja i priorytetowe wsparcie techniczne
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Darmowa dostawa zawsze</h4>
                  <p className="text-white/90 text-sm">
                    Bezpłatna wysyłka niezależnie od wartości zamówienia
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Program partnerski</h4>
                  <p className="text-white/90 text-sm">
                    Dodatkowe korzyści dla stałych partnerów biznesowych
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <HeadphonesIcon className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Priorytetowe wsparcie</h4>
                  <p className="text-white/90 text-sm">
                    Szybsza obsługa zgłoszeń dla klientów biznesowych
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Raporty zakupowe</h4>
                  <p className="text-white/90 text-sm">
                    Miesięczne zestawienia wydatków dla Twojej księgowości
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#131921] text-center mb-8">
            Obsługujemy firmy z każdej branży
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-[#131921] mb-3">Biura i korporacje</h3>
              <p className="text-gray-600">
                Kompleksowe wyposażenie biur - od artykułów biurowych po sprzęt elektroniczny
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#131921] mb-3">Przemysł i produkcja</h3>
              <p className="text-gray-600">
                Narzędzia, urządzenia elektryczne i wyposażenie warsztatów
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#131921] mb-3">Usługi i handel</h3>
              <p className="text-gray-600">
                Rozwiązania dla sklepów, salonów i punktów usługowych
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-[#131921] mb-4">
            Zacznij oszczędzać już dziś
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Skontaktuj się z nami i dowiedz się więcej o specjalnych warunkach dla firm
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@galaxysklep.pl"
              className="inline-flex items-center gap-2 bg-[#6da306] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#5d8f05] transition-colors"
            >
              <Building2 size={20} />
              Napisz do nas: support@galaxysklep.pl
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Darmowa dostawa przy każdym zamówieniu biznesowym
          </p>
        </div>
      </div>
    </div>
  );
}