// src/app/dla-firm/page.tsx
import { Metadata } from 'next';
import { Building2, Users, CreditCard, Package, FileCheck, HeadphonesIcon, TrendingUp, Shield } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Cégeknek | Üzleti megoldások - Jovotech',
  description: 'Különleges feltételek cégek számára. ÁFA-s számlák, halasztott fizetés, dedikált ügyfélmenedzser és kedvezmények állandó ügyfeleknek.',
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
            Jovotech az Ön vállalkozásáért
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Csatlakozzon a több ezer céghez, amelyek beszállítóként bíznak bennünk. 
            Az üzleti igényekhez igazított különleges együttműködési feltételeket kínálunk.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <CreditCard className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">ÁFA-s számlák</h3>
            <p className="text-sm text-gray-600">
              Automatikus ÁFA-s számla kiállítás minden rendeléshez
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Mennyiségi kedvezmények</h3>
            <p className="text-sm text-gray-600">
              Vonzó kedvezmények nagyobb rendelések esetén
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Dedikált ügyfélmenedzser</h3>
            <p className="text-sm text-gray-600">
              Személyes tanácsadó az Ön cége számára
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 text-[#6da306] mx-auto mb-4" />
            <h3 className="font-semibold text-[#131921] mb-2">Elsőbbségi szállítás</h3>
            <p className="text-sm text-gray-600">
              Üzleti megrendelések gyors teljesítése
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#131921] text-center mb-8">
            Akik megbíztak bennünk
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 items-center">
            {companyLogos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Image
                  src={logo}
                  alt={`Cég logó ${index + 1}`}
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
            Mit kínálunk cégeknek?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileCheck className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Halasztott fizetés</h4>
                  <p className="text-white/90 text-sm">
                    Fizetési lehetőség 30 napos halasztott határidővel
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Garancia és támogatás</h4>
                  <p className="text-white/90 text-sm">
                    Kiterjesztett garancia és elsőbbségi technikai támogatás
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Mindig ingyenes szállítás</h4>
                  <p className="text-white/90 text-sm">
                    Díjmentes kiszállítás a rendelés értékétől függetlenül
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Partner program</h4>
                  <p className="text-white/90 text-sm">
                    További előnyök állandó üzleti partnereink számára
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <HeadphonesIcon className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Elsőbbségi támogatás</h4>
                  <p className="text-white/90 text-sm">
                    Gyorsabb megkeresés-kezelés üzleti ügyfelek számára
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Vásárlási jelentések</h4>
                  <p className="text-white/90 text-sm">
                    Havi költségkimutatások az Ön könyvelése számára
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#131921] text-center mb-8">
            Minden iparágból szolgálunk ki cégeket
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-[#131921] mb-3">Irodák és vállalatok</h3>
              <p className="text-gray-600">
                Teljes körű irodai felszerelés - irodaszerektől az elektronikai eszközökig
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#131921] mb-3">Ipar és gyártás</h3>
              <p className="text-gray-600">
                Szerszámok, elektromos berendezések és műhelyfelszerelések
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#131921] mb-3">Szolgáltatások és kereskedelem</h3>
              <p className="text-gray-600">
                Megoldások üzletek, szalonok és szolgáltató pontok számára
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-[#131921] mb-4">
            Kezdje el a megtakarítást még ma
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Lépjen kapcsolatba velünk, és tudjon meg többet a cégek számára kínált különleges feltételekről
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@jovotech.hu"
              className="inline-flex items-center gap-2 bg-[#6da306] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#5d8f05] transition-colors"
            >
              <Building2 size={20} />
              Írjon nekünk: support@jovotech.hu
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Ingyenes szállítás minden üzleti megrendeléshez
          </p>
        </div>
      </div>
    </div>
  );
}