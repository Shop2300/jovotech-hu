// src/app/obchodni-podminky/page.tsx
import Link from 'next/link';
import { ArrowLeft, FileText, ShoppingCart, Package, Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function ObchodniPodminkyPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Obchodní podmínky</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Platné od 1. ledna 2024
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">1. Úvodní ustanovení</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Tyto obchodní podmínky (dále jen „obchodní podmínky") společnosti Můj E-shop s.r.o., 
                  IČO: 12345678, se sídlem Václavské náměstí 123, 110 00 Praha 1, zapsané v obchodním 
                  rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 12345 (dále jen „prodávající"), 
                  upravují v souladu s ustanovením § 1751 odst. 1 zákona č. 89/2012 Sb., občanský zákoník, 
                  vzájemná práva a povinnosti smluvních stran vzniklé v souvislosti nebo na základě kupní 
                  smlouvy uzavírané mezi prodávajícím a jinou fyzickou osobou prostřednictvím internetového 
                  obchodu prodávajícího.
                </p>
              </div>
            </section>

            {/* Order Process */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">2. Objednávka a uzavření kupní smlouvy</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Veškerá prezentace zboží umístěná v internetovém obchodě je informativního charakteru 
                  a prodávající není povinen uzavřít kupní smlouvu ohledně tohoto zboží.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kupující vyplní objednávkový formulář v internetovém obchodě</li>
                  <li>Objednávka obsahuje údaje o objednávaném zboží, způsobu platby a dopravy</li>
                  <li>Před odesláním objednávky je kupujícímu umožněno zkontrolovat a měnit vstupní údaje</li>
                  <li>Objednávku odešle kupující prodávajícímu kliknutím na tlačítko „Objednat"</li>
                  <li>Prodávající neprodleně potvrdí objednávku elektronickou poštou</li>
                </ul>
              </div>
            </section>

            {/* Price and Payment */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">3. Cena zboží a platební podmínky</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Ceny zboží jsou uvedeny včetně daně z přidané hodnoty (DPH) a všech souvisejících poplatků. 
                  Ceny zboží zůstávají v platnosti po dobu, kdy jsou zobrazovány v internetovém obchodě.
                </p>
                <p className="font-semibold">Zboží lze uhradit následujícími způsoby:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bezhotovostně platební kartou online</li>
                  <li>Bezhotovostně převodem na účet prodávajícího</li>
                  <li>V hotovosti na dobírku v místě určeném kupujícím</li>
                  <li>Prostřednictvím platební brány PayPal</li>
                </ul>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">4. Dodání zboží</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Způsob doručení zboží určuje kupující z možností nabízených prodávajícím. 
                  Zboží je doručováno prostřednictvím:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Zásilkovna - doručení na výdejní místo</li>
                  <li>Česká pošta - doručení na adresu kupujícího</li>
                  <li>Osobní odběr na prodejně</li>
                </ul>
                <p>
                  Dodací lhůta činí 2-5 pracovních dnů od potvrzení objednávky, není-li u zboží 
                  uvedeno jinak. V případě platby předem je zboží odesláno po připsání platby na účet.
                </p>
              </div>
            </section>

            {/* Withdrawal */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">5. Odstoupení od kupní smlouvy</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Kupující má v souladu s ustanovením § 1829 odst. 1 občanského zákoníku právo 
                  od kupní smlouvy odstoupit do 14 dnů od převzetí zboží.
                </p>
                <p>
                  Pro odstoupení od kupní smlouvy může kupující využít vzorový formulář poskytovaný 
                  prodávajícím. Odstoupení od kupní smlouvy zašle kupující na emailovou adresu 
                  prodávajícího: info@muj-eshop.cz.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                    <p className="text-sm">
                      Kupující nemůže odstoupit od kupní smlouvy o dodávce zboží, které bylo upraveno 
                      podle přání kupujícího nebo pro jeho osobu, od kupní smlouvy o dodávce zboží, 
                      které podléhá rychlé zkáze, nebo zboží, které bylo po dodání nenávratně smíseno 
                      s jiným zbožím.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Rights and Defects */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">6. Práva z vadného plnění</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Práva a povinnosti smluvních stran ohledně práv z vadného plnění se řídí příslušnými 
                  obecně závaznými právními předpisy (zejména ustanoveními § 1914 až 1925, § 2099 až 2117 
                  a § 2161 až 2174 občanského zákoníku a zákonem č. 634/1992 Sb., o ochraně spotřebitele).
                </p>
                <p>
                  Prodávající odpovídá kupujícímu, že zboží při převzetí nemá vady. Zejména prodávající 
                  odpovídá kupujícímu, že v době, kdy kupující zboží převzal:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>má zboží vlastnosti, které si strany ujednaly</li>
                  <li>se zboží hodí k účelu, který pro jeho použití prodávající uvádí</li>
                  <li>zboží odpovídá jakostí nebo provedením smluvenému vzorku</li>
                  <li>je zboží v odpovídajícím množství, míře nebo hmotnosti</li>
                  <li>zboží vyhovuje požadavkům právních předpisů</li>
                </ul>
              </div>
            </section>

            {/* Final Provisions */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">7. Závěrečná ustanovení</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Kupující bere na vědomí, že programové vybavení a další součásti tvořící internetový 
                  obchod jsou chráněny autorským právem. Kupující se zavazuje, že nebude vykonávat žádnou 
                  činnost, která by mohla jemu nebo třetím osobám umožnit neoprávněně zasahovat či 
                  neoprávněně užít programové vybavení nebo další součásti tvořící internetový obchod.
                </p>
                <p>
                  Tyto obchodní podmínky jsou platné a účinné od 1. ledna 2024.
                </p>
              </div>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 text-center">
                V případě dotazů nás kontaktujte na info@muj-eshop.cz nebo +420 123 456 789
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}