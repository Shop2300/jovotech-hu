// src/app/dostawa-i-platnosc/page.tsx
import Link from 'next/link';
import {
  ArrowLeft,
  Truck,
  CreditCard,
  Package,
  Clock,
  CheckCircle,
  Shield,
  Info,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  RotateCcw,
  AlertCircle,
  Timer
} from 'lucide-react';

export default function DostawaIPlatnoscPage() {
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
            Vissza a főoldalra
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Szállítás és fizetés</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Gyors szállítás és biztonságos fizetési módok. Minden rendelés ingyenes szállítással!
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            <Truck size={20} />
            INGYENES SZÁLLÍTÁS minden rendeléshez
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Shipping Section */}
          <div className="bg-white rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Szállítási lehetőségek</h2>
            </div>

            {/* Free Shipping Banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <Package className="text-white" size={28} />
                <div>
                  <h3 className="font-bold text-xl mb-1">INGYENES SZÁLLÍTÁS</h3>
                  <p className="text-green-100">Minden rendeléshez • Szállítási idő: 1-2 munkanap</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Package className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Csomagautomata</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Kézbesítés az Ön által választott csomagautomatába (20000+ pont országszerte)
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600 line-through mr-2">2999 Ft</span>
                      <span className="font-bold text-xl text-green-700">INGYENES</span>
                      <span className="text-gray-600 ml-auto">1-2 munkanap</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Futárszolgálat (GLS)</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Kézbesítés közvetlenül az Ön címére
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600 line-through mr-2">3999 Ft</span>
                      <span className="font-bold text-xl text-green-700">INGYENES</span>
                      <span className="text-gray-600 ml-auto">1-2 munkanap</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Magyar Posta</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Kézbesítés a legközelebbi postahivatalba vagy címre
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-lg text-green-600 line-through mr-2">3499 Ft</span>
                      <span className="font-bold text-xl text-green-700">INGYENES</span>
                      <span className="text-gray-600 ml-auto">1-2 munkanap</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-2">
                  <Info className="text-blue-600 mt-0.5" size={20} />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Miért kínálunk ingyenes szállítást?</p>
                    <p>Értékeljük vásárlóinkat, és szeretnénk, ha a vásárlás a lehető legegyszerűbb és leggazdaságosabb lenne.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Process */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Timer className="text-blue-600" size={24} />
                Rendelés feldolgozási folyamat
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">1</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Rendelés fogadása</p>
                    <p className="text-sm text-gray-600">Azonnal a rendelés leadása után</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">2</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Csomagolás</p>
                    <p className="text-sm text-gray-600">24 órán belül munkanapokon</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">3</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Feladás</p>
                    <p className="text-sm text-gray-600">Átadás a futárnak még aznap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold text-sm">4</div>
                  <div className="flex-1">
                    <p className="font-medium text-black">Kézbesítés</p>
                    <p className="text-sm text-gray-600">1-2 munkanap a feladástól</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Fizetési módok</h2>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Online bankkártyás fizetés</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Azonnali fizetés fizetési átjárón keresztül. Elfogadunk Visa, Mastercard, American Express kártyákat.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Leggyorsabb fizetési mód</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">SimplePay</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Gyors és biztonságos online fizetés
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Azonnali teljesítés</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Online banki átutalás</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Gyors online átutalás az összes magyar bankból
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Minden magyar bank</span>
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
                      Gyors és biztonságos fizetés PayPal fiókján keresztül
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Shield size={16} />
                      <span>Vevővédelem</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Banki átutalás</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Előre fizetés a számlánkra. Szállítás a befizetés jóváírása után.
                    </p>
                    <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded mt-2">
                      <p><strong>Név:</strong> Jovotech</p>
                      <p><strong>Számlaszám:</strong> 12600016-10426947-95638648</p>
                      <p><strong>IBAN:</strong> HU86 1260 0016 1042 6947 9563 8648</p>
                      <p><strong>BIC/SWIFT:</strong> TRWIBEBBXXX</p>
                      <p><strong>Bank:</strong> WISE EUROPE S.A.</p>
                      <p><strong>Bank címe:</strong> Rue du Trône 100, 1050 Brussels</p>
                      <p className="text-xs text-gray-500 mt-2">Az átutalás közleményébe kérjük írja be a rendelési számot</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <Package className="text-blue-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">Utánvét</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Készpénzes fizetés a csomag átvételekor
                    </p>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertCircle size={16} />
                      <span>Plusz költség: 1200 Ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="text-blue-600 mt-0.5" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Fizetési biztonság</p>
                  <p>Minden tranzakció SSL protokollal titkosított. Az Ön adatai biztonságban vannak.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="max-w-6xl mx-auto mt-12 space-y-8">
          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">További információk a szállításról</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  Csomagolás
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Biztonságos csomagolás kartondobozba és buborékfóliába</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Törékeny termékek extra védelemmel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Környezetbarát csomagolóanyagok</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Csomagkövetés
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Követési szám e-mailben</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>SMS értesítés a szállítás állapotáról</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span>Szállítási időpont módosításának lehetősége</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black flex items-center gap-2">
              <Globe className="text-blue-600" size={24} />
              Nemzetközi szállítás
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Csehország és Szlovákia</h4>
                <p className="text-sm text-gray-600">Szállítás: 2-3 munkanap</p>
                <p className="text-sm font-semibold text-green-600">Költség: 9990 Ft</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Németország és Ausztria</h4>
                <p className="text-sm text-gray-600">Szállítás: 3-4 munkanap</p>
                <p className="text-sm font-semibold text-green-600">Költség: 12990 Ft</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Többi EU ország</h4>
                <p className="text-sm text-gray-600">Szállítás: 4-7 munkanap</p>
                <p className="text-sm font-semibold text-green-600">Költség: 14990 Ft-tól</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              120000 Ft feletti nemzetközi rendeléseknél 50% kedvezmény a szállításból
            </p>
          </div>

          {/* Contact & Returns */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <RotateCcw className="text-blue-600" size={20} />
                Visszaküldés és reklamáció
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>30 nap a termék visszaküldésére</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Ingyenes visszaküldés csomagautomatán keresztül</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5" size={16} />
                  <span>Pénzvisszatérítés 14 napon belül</span>
                </li>
              </ul>
              <Link
                href="/visszaru-es-reklamacio"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4 text-sm font-medium"
              >
                Tudjon meg többet a visszaküldésről
                <ArrowLeft size={16} className="ml-1 rotate-180" />
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Phone className="text-blue-600" size={20} />
                Kapcsolat
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <span>support@jovotech.hu</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Jovotech</p>
                    <p>1. máje 535/50</p>
                    <p>46007 Liberec</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic mt-2">
                  *Céges székhely - levelezést kérjük e-mailben küldeni
                </p>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Fontos információk</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">ÁFA-s számlák</p>
                    <p className="text-gray-600 text-xs">Minden rendeléshez</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Timer className="text-green-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Gyors feladás</p>
                    <p className="text-gray-600 text-xs">24 órán belül</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-purple-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Garancia</p>
                    <p className="text-gray-600 text-xs">Minden termékre</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Package className="text-orange-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-black">Eredeti termékek</p>
                    <p className="text-gray-600 text-xs">100% hiteles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Gyakran ismételt kérdések</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Mennyi ideig tart a rendelés feldolgozása?</h4>
                <p className="text-sm text-gray-600">
                  A 14:00 óráig leadott rendeléseket még aznap, munkanapon feladjuk.
                  A kézbesítés 1-2 munkanapot vesz igénybe egész Magyarországon.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Megváltoztathatom a szállítási címet a rendelés leadása után?</h4>
                <p className="text-sm text-gray-600">
                  Igen, megváltoztathatja a szállítási címet, ha e-mailben felveszi velünk a kapcsolatot a rendelés leadását követő 12 órán belül.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Állítanak ki ÁFA-s számlát?</h4>
                <p className="text-sm text-gray-600">
                  Igen, minden rendeléshez automatikusan kiállítunk ÁFA-s számlát, amelyet elektronikusan küldünk a megadott e-mail címre.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-medium text-black mb-2">Mi a teendő, ha a csomag megsérült?</h4>
                <p className="text-sm text-gray-600">
                  Minden csomag biztosított. Sérülés esetén jegyzőkönyvet kell felvenni a futárral,
                  és kapcsolatba kell lépni velünk - kicseréljük az árut vagy visszatérítjük a pénzt.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black mb-2">Személyesen is átvehető a rendelés?</h4>
                <p className="text-sm text-gray-600">
                  Jelenleg nem kínálunk személyes átvételi lehetőséget. Minden rendelést
                  ingyenes futárszolgálattal teljesítünk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}