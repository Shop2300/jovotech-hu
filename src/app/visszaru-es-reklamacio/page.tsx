// src/app/zwroty-i-reklamacje/page.tsx
import Link from 'next/link';
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package,
  Truck,
  Mail,
  FileText,
  Shield,
  Heart,
  Info,
  Download,
  ChevronRight,
  Calendar,
  CreditCard,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  HelpCircle,
  Star
} from 'lucide-react';

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
            Vissza a főoldalra
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Visszaküldés és reklamáció</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Az Ön elégedettsége a prioritásunk. A visszaküldési és reklamációs folyamat egyszerű és problémamentes.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            <Truck size={20} />
            INGYENES VISSZAKÜLDÉS InPost-tal
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">30 nap</div>
            <div className="text-sm text-gray-600">a termék visszaküldésére</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">0 Ft</div>
            <div className="text-sm text-gray-600">visszaküldési költség</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">14 nap</div>
            <div className="text-sm text-gray-600">pénzvisszatérítés</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">24 óra</div>
            <div className="text-sm text-gray-600">válasz a bejelentésre</div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Return Policy - Expanded */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Termék visszaküldés</h2>
            </div>
            
            <div className="space-y-6">
              {/* Key Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-black mb-3 flex items-center gap-2">
                  <ThumbsUp className="text-green-600" size={20} />
                  Az Ön előnyei
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">30 nap a visszaküldésre (2x hosszabb, mint a törvény előírja)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Ingyenes InPost visszaküldési címke</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Pénzvisszatérítés 14 napon belül</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Lehetőség más termékre cserélni</span>
                  </li>
                </ul>
              </div>

              {/* Return Conditions */}
              <div>
                <h3 className="font-semibold text-black mb-3">A termék visszaküldésének feltételei:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Használatlan termék, változatlan állapotban</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Teljes - minden tartozékkal és dokumentummal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Eredeti csomagolásban (lehet nyitott)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Gyártói címkékkel (ha van)</span>
                  </li>
                </ul>
              </div>

              {/* Products Not Eligible */}
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={20} />
                  Visszaküldésből kizárt termékek
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Egyedi megrendelésre készült termékek</li>
                  <li>• Romlandó áruk vagy rövid lejárati idejű termékek</li>
                  <li>• Kibontott adathordozók (CD, DVD, szoftver)</li>
                  <li>• Higiéniai termékek és fehérnemű</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warranty - Expanded */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-blue-600" size={32} />
              <h2 className="text-2xl font-semibold text-black">Garancia és reklamációk</h2>
            </div>
            
            <div className="space-y-6">
              {/* Warranty Period */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-black mb-3 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Garanciaidőszak
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span><strong>24 hónap</strong> - standard garancia</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span><strong>36 hónap</strong> - kiválasztott prémium termékek</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Info className="text-blue-500" size={16} />
                    <span className="text-sm">Plusz gyártói garancia</span>
                  </p>
                </div>
              </div>

              {/* What's Covered */}
              <div>
                <h3 className="font-semibold text-black mb-3">A garancia kiterjed:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Gyártási és anyaghibákra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Nem a felhasználó hibájából eredő műszaki hibákra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">A leírással vagy specifikációval való összeférhetetlenségre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Alkatrészek idő előtti elhasználódására</span>
                  </li>
                </ul>
              </div>

              {/* What's Not Covered */}
              <div>
                <h3 className="font-semibold text-black mb-3">A garancia nem terjed ki:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Mechanikai sérülésekre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Normál használati kopásra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Helytelen használat következményeire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-red-500 mt-0.5" size={16} />
                    <span className="text-gray-700">Nem engedélyezett szervizben végzett javításokra</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step by Step Process */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold mb-8 text-black text-center">Hogyan küldjem vissza vagy reklamáljam a terméket?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Return Process */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <RefreshCw className="text-green-600" size={24} />
                Visszaküldési folyamat - lépésről lépésre
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Jelentse be a visszaküldést online</h4>
                    <p className="text-sm text-gray-700">Töltse ki a visszaküldési űrlapot weboldalunkon vagy írjon a support@jovotech.hu címre</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Kapja meg a címkét</h4>
                    <p className="text-sm text-gray-700">24 órán belül elküldjük az ingyenes InPost visszaküldési címkét</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Csomagolja be a terméket</h4>
                    <p className="text-sm text-gray-700">Biztonságosan csomagolja be a terméket minden tartozékával</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Adja fel a csomagautomatában</h4>
                    <p className="text-sm text-gray-700">Adja fel a csomagot bármelyik InPost csomagautomatában</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Pénzvisszatérítés</h4>
                    <p className="text-sm text-gray-700">Ellenőrzés után 14 napon belül visszatérítjük a pénzt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Process */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="text-purple-600" size={24} />
                Reklamációs folyamat - lépésről lépésre
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Jelentse be a reklamációt</h4>
                    <p className="text-sm text-gray-700">Írja le a problémát a support@jovotech.hu címen vagy űrlapon keresztül</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Konzultáció</h4>
                    <p className="text-sm text-gray-700">Szakértőnk 24 órán belül felveszi Önnel a kapcsolatot</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Küldés a szervizbe</h4>
                    <p className="text-sm text-gray-700">Ha szükséges, küldje el a terméket (ingyenes címke)</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Diagnózis</h4>
                    <p className="text-sm text-gray-700">A szerviz ellenőrzi a terméket (max. 30 nap)</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Megoldás</h4>
                    <p className="text-sm text-gray-700">Javítás, csere vagy pénzvisszatérítés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Download */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Letölthető űrlapok</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="text-blue-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold mb-2">Visszaküldési űrlap</h4>
                <p className="text-sm text-gray-600 mb-4">Elállási nyilatkozat</p>
                <a 
                  href="/Return_and_Exchange_Form.pdf"
                  download="Visszakuldesi_urlap.pdf"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={18} />
                  PDF letöltése
                </a>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="text-purple-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold mb-2">Reklamációs űrlap</h4>
                <p className="text-sm text-gray-600 mb-4">Garanciális reklamáció bejelentése</p>
                <a 
                  href="/Return_and_Exchange_Form.pdf"
                  download="Reklamacios_urlap.pdf"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download size={18} />
                  PDF letöltése
                </a>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center">
                <FileText className="text-green-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold mb-2">Csere űrlap</h4>
                <p className="text-sm text-gray-600 mb-4">Termékcsere kérelem</p>
                <a 
                  href="/Return_and_Exchange_Form.pdf"
                  download="Csere_urlap.pdf"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={18} />
                  PDF letöltése
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center flex items-center justify-center gap-2">
              <HelpCircle className="text-blue-600" size={28} />
              Gyakran ismételt kérdések
            </h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Visszaküldhetek terméket számla nélkül?</h3>
                <p className="text-gray-700">
                  Igen, elég megadni a rendelési számot vagy a vásárláskor használt e-mail címet. 
                  Minden számla el van mentve a rendszerünkben.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Mennyi ideig tart a pénzvisszatérítési folyamat?</h3>
                <p className="text-gray-700">
                  A visszaküldött termék beérkezése és ellenőrzése után a pénz maximum 14 napon belül 
                  visszakerül az Ön számlájára. Ez általában 3-5 munkanapot vesz igénybe.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Cserélhetem a terméket egy másikra?</h3>
                <p className="text-gray-700">
                  Természetesen! Cserélheti a terméket más modellre vagy méretre. Ha az új termék 
                  drágább, kifizeti a különbséget. Ha olcsóbb - visszatérítjük a túlfizetést.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Ki fedezi a szállítási költségeket visszaküldéskor?</h3>
                <p className="text-gray-700">
                  Mi! Ingyenes InPost visszaküldési címkét küldünk. Csak adja fel a csomagot bármelyik 
                  csomagautomatában.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Mi van, ha a terméket kissé használták?</h3>
                <p className="text-gray-700">
                  Megértjük, hogy néha meg kell vizsgálni a terméket. Ha nincs intenzív használat nyoma 
                  és a termék teljes, elfogadjuk a visszaküldést.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-black mb-2">Hogyan ellenőrizhetem a visszaküldésem/reklamációm állapotát?</h3>
                <p className="text-gray-700">
                  A bejelentés után e-mailt kap az ügy számával. Online ellenőrizheti az állapotot 
                  vagy kapcsolatba léphet velünk megadva ezt a számot.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">Lemondhatom a megrendelést?</h3>
                <p className="text-gray-700">
                  Igen, ha a megrendelést még nem küldték el. Lépjen kapcsolatba velünk a lehető 
                  leghamarabb a support@jovotech.hu címen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Rights */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="font-semibold text-xl mb-6 text-black text-center">Az Ön fogyasztói jogai</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="text-blue-600" size={20} />
                  Elállási jog
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>14 nap törvényes + további 16 nap tőlünk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Indoklás nélkül</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>A termék árának teljes visszatérítése</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  Jótállás és garancia
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>2 év jótállás a Polgári Törvénykönyv szerint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Gyártói garancia (ha van)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Választási jog: javítás, csere vagy visszatérítés</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-6 text-center">
              További információ a fogyasztói jogokról a fogyasztóvédelmi hatóság honlapján: 
              <a href="https://fogyasztovedelem.kormany.hu" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                www.fogyasztovedelem.kormany.hu
              </a>
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
            <h3 className="font-semibold text-2xl mb-6 text-center">Segítségre van szüksége?</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">E-mail</h4>
                <p className="text-sm mb-1">Ügyfélszolgálat:</p>
                <p className="text-sm font-medium">support@jovotech.hu</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Online chat</h4>
                <p className="text-sm">Elérhető minden nap</p>
                <p className="text-sm">8:00 - 20:00</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FileText className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Ügy állapota</h4>
                <p className="text-sm">Kövesse reklamációját</p>
                <p className="text-sm">E-mail értesítések</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm mb-4">Visszaküldési és reklamációs cím:</p>
              <p className="font-semibold">Jovotech.hu, 1. máje 535/50, 46007 Liberec</p>
            </div>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="text-center">
            <h3 className="font-semibold text-xl mb-6 text-black">Miért bízzon bennünk?</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Heart className="text-red-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">15 000+</p>
                <p className="text-sm text-gray-600">Elégedett ügyfél</p>
              </div>
              <div className="text-center">
                <Star className="text-yellow-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">4.9/5</p>
                <p className="text-sm text-gray-600">Átlagos értékelés</p>
              </div>
              <div className="text-center">
                <RefreshCw className="text-green-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">99.2%</p>
                <p className="text-sm text-gray-600">Pozitív visszaküldések</p>
              </div>
              <div className="text-center">
                <Clock className="text-blue-500 mx-auto mb-2" size={32} />
                <p className="font-semibold">&lt; 24 óra</p>
                <p className="text-sm text-gray-600">Válaszidő</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}