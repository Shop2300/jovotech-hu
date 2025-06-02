// src/app/ochrana-osobnich-udaju/page.tsx
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, UserCheck, Database, AlertCircle, Mail } from 'lucide-react';

export default function OchranaOsobnichUdajuPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Ochrana osobních údajů</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vaše soukromí je pro nás prioritou. Zde najdete informace o zpracování vašich osobních údajů.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* Controller */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">1. Správce osobních údajů</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Správcem osobních údajů je společnost <strong>Můj E-shop s.r.o.</strong><br />
                  IČO: 12345678<br />
                  Sídlo: Václavské náměstí 123, 110 00 Praha 1<br />
                  Email: gdpr@muj-eshop.cz<br />
                  Telefon: +420 123 456 789
                </p>
              </div>
            </section>

            {/* Scope */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">2. Rozsah zpracování osobních údajů</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Zpracováváme pouze údaje, které nám poskytnete v souvislosti s nákupem:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Základní údaje</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Jméno a příjmení</li>
                    <li>• E-mailová adresa</li>
                    <li>• Telefonní číslo</li>
                    <li>• Dodací adresa</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Údaje o nákupu</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Historie objednávek</li>
                    <li>• Platební údaje</li>
                    <li>• Komunikace se zákaznickou podporou</li>
                    <li>• Preference doručení</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Purpose */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">3. Účel zpracování osobních údajů</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Vyřízení objednávky</h3>
                  <p className="text-gray-700 text-sm">
                    Vaše údaje potřebujeme k doručení zboží a komunikaci o stavu objednávky.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Zákaznická podpora</h3>
                  <p className="text-gray-700 text-sm">
                    Pro vyřízení reklamací, dotazů a poskytnutí podpory.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Účetnictví</h3>
                  <p className="text-gray-700 text-sm">
                    Vedení účetnictví podle platných právních předpisů.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-black mb-1">Marketing (pouze se souhlasem)</h3>
                  <p className="text-gray-700 text-sm">
                    Zasílání obchodních sdělení pouze pokud jste udělili souhlas.
                  </p>
                </div>
              </div>
            </section>

            {/* Duration */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">4. Doba uchovávání údajů</h2>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Osobní údaje uchováváme pouze po dobu nezbytně nutnou:
                    </p>
                    <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                      <li>• <strong>Údaje pro vyřízení objednávky:</strong> po dobu plnění smlouvy</li>
                      <li>• <strong>Účetní doklady:</strong> 5 let od konce účetního období</li>
                      <li>• <strong>Marketingové účely:</strong> do odvolání souhlasu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Rights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">5. Vaše práva</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                V souvislosti se zpracováním osobních údajů máte následující práva:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Přístup a oprava</h3>
                  <p className="text-gray-700 text-sm">
                    Právo na přístup k vašim údajům a jejich opravu v případě nepřesností.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Výmaz</h3>
                  <p className="text-gray-700 text-sm">
                    Právo na vymazání údajů, pokud již nejsou potřebné pro původní účely.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Omezení zpracování</h3>
                  <p className="text-gray-700 text-sm">
                    Právo požádat o omezení zpracování vašich údajů.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black mb-2">Přenositelnost</h3>
                  <p className="text-gray-700 text-sm">
                    Právo získat vaše údaje ve strukturovaném formátu.
                  </p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">6. Zabezpečení osobních údajů</h2>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-3">
                  Přijali jsme veškerá vhodná technická a organizační opatření k zabezpečení vašich údajů:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Šifrování komunikace pomocí SSL certifikátu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Pravidelné bezpečnostní audity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Omezený přístup k údajům pouze pro oprávněné osoby</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="text-green-600 mt-0.5" size={16} />
                    <span>Školení zaměstnanců v oblasti ochrany údajů</span>
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
                Pro uplatnění svých práv nebo v případě dotazů nás kontaktujte:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> gdpr@muj-eshop.cz<br />
                  <strong>Telefon:</strong> +420 123 456 789<br />
                  <strong>Adresa:</strong> Václavské náměstí 123, 110 00 Praha 1
                </p>
              </div>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 text-center">
                Poslední aktualizace: 1. ledna 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}