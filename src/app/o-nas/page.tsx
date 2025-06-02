// src/app/o-nas/page.tsx
import Link from 'next/link';
import { ArrowLeft, Users, Award, Heart, Target, TrendingUp, Shield } from 'lucide-react';

export default function ONasPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">O nás</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Poznáte příběh našeho e-shopu a hodnoty, které nás vedou
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Vítejte v Můj E-shop</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Jsme moderní český e-shop s tradicí od roku 2020. Specializujeme se na prodej 
                kvalitního zboží za férové ceny s důrazem na spokojenost zákazníků.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">10 000+</div>
                <div className="text-gray-600">Spokojených zákazníků</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">50 000+</div>
                <div className="text-gray-600">Vyřízených objednávek</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
                <div className="text-gray-600">Hodnocení zákazníků</div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Naše hodnoty</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-2">Zákazník na prvním místě</h3>
                <p className="text-gray-700">
                  Vaše spokojenost je naší prioritou. Poskytujeme osobní přístup a profesionální servis.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-2">Kvalita a originalita</h3>
                <p className="text-gray-700">
                  Prodáváme pouze originální zboží od prověřených dodavatelů s garancí kvality.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="text-red-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-2">Férové jednání</h3>
                <p className="text-gray-700">
                  Transparentní ceny, žádné skryté poplatky a vždy čestné jednání.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-black">Náš příběh</h2>
            
            <div className="prose prose-lg max-w-none">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Můj E-shop vznikl v roce 2020 s jasnou vizí - vytvořit místo, kde zákazníci 
                  najdou kvalitní produkty, férové ceny a především lidský přístup. Začínali jsme 
                  jako malý rodinný podnik s několika produkty a velkými sny.
                </p>
                <p>
                  Díky důvěře našich zákazníků a tvrdé práci jsme se postupně rozrostli na jeden 
                  z předních českých e-shopů. Dnes nabízíme tisíce produktů a denně vyřizujeme 
                  stovky objednávek.
                </p>
                <p>
                  I přes náš růst zůstáváme věrni našim hodnotám - každý zákazník je pro nás 
                  důležitý a každá objednávka je vyřízena s maximální péčí.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Proč nakupovat u nás?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <Target className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Široký sortiment</h3>
                  <p className="text-gray-700">
                    Neustále rozšiřujeme naši nabídku o nové a zajímavé produkty.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <TrendingUp className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Konkurenční ceny</h3>
                  <p className="text-gray-700">
                    Pravidelně sledujeme trh a garantujeme férové ceny.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <Shield className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Bezpečný nákup</h3>
                  <p className="text-gray-700">
                    Zabezpečená platební brána a ochrana vašich osobních údajů.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                <Heart className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Péče o zákazníky</h3>
                  <p className="text-gray-700">
                    Náš tým je tu pro vás každý všední den od 8:00 do 18:00.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}