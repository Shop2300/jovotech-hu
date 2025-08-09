// src/app/rolunk/page.tsx
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Award, 
  Heart, 
  Target, 
  TrendingUp, 
  Shield,
  Star,
  Globe,
  Truck,
  CheckCircle,
  Package,
  Sparkles,
  Lightbulb,
  HandshakeIcon,
  Clock,
  Building,
  Leaf,
  Trophy,
  ChevronRight,
  Quote
} from 'lucide-react';

export default function RolunkPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Rólunk</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ismerje meg a Jovotech-et - Megbízható online vásárlási partnere 2020 óta
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-4 text-black">Üdvözöljük a Jovotech-nél</h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
                Több vagyunk, mint egy online áruház - partnerünk vagyunk a legjobb termékek 
                legjobb áron történő felfedezésében.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="font-medium">100% Eredeti termékek</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                  <Truck className="text-blue-500" size={18} />
                  <span className="font-medium">Ingyenes szállítás</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                  <Shield className="text-purple-500" size={18} />
                  <span className="font-medium">Biztonságos vásárlás</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">15 000+</div>
                <div className="text-gray-600">Elégedett vásárló</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">75 000+</div>
                <div className="text-gray-600">Teljesített megrendelés</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Átlagos értékelés</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Ajánlja tovább</div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-blue-600" size={32} />
                <h2 className="text-2xl font-semibold text-black">Küldetésünk</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Legmagasabb minőségű termékeket szállítunk megfizethető áron, hosszú távú, 
                bizalmon és tisztességen alapuló kapcsolatokat építve. Minden nap arra törekszünk, 
                hogy túlszárnyaljuk ügyfeleink elvárásait, nem csak termékeket, hanem teljes 
                megoldásokat és kivételes vásárlási élményt kínálva.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-purple-600" size={32} />
                <h2 className="text-2xl font-semibold text-black">Jövőképünk</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Arra törekszünk, hogy az első választás legyünk a minőséget, tisztességet és 
                professzionalizmust kereső vásárlók számára. Olyan teret szeretnénk teremteni, 
                ahol az online vásárlás nemcsak kényelmes, hanem kellemes és biztonságos is. 
                Célunk a folyamatos fejlődés és olyan innovációk bevezetése, amelyek megkönnyítik 
                ügyfeleink életét.
              </p>
            </div>
          </div>

          {/* Our Values - Expanded */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Értékeink</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Az ügyfél az első</h3>
                <p className="text-gray-700 text-center">
                  Az Ön elégedettsége a prioritásunk. Egyéni megközelítést, gyors válaszokat 
                  és professzionális szolgáltatást biztosítunk a vásárlás minden szakaszában.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Minőség és eredetiség</h3>
                <p className="text-gray-700 text-center">
                  Kizárólag hivatalos forgalmazókkal működünk együtt. Minden termék ellenőrzött, 
                  gyártói garanciával és értékesítés utáni támogatásunkkal rendelkezik.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="text-red-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Tisztességes megközelítés</h3>
                <p className="text-gray-700 text-center">
                  Átlátható árak rejtett költségek nélkül, világos együttműködési feltételek 
                  és mindig őszinte, partneri kapcsolatok minden ügyféllel.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6">
                <div className="bg-purple-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="text-purple-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Innováció</h3>
                <p className="text-gray-700 text-center">
                  Folyamatosan fejlesztjük áruházunkat, új funkciókat vezetünk be és követjük 
                  a trendeket, hogy a legmodernebb vásárlási megoldásokat kínáljuk.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-orange-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <HandshakeIcon className="text-orange-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Partnerség</h3>
                <p className="text-gray-700 text-center">
                  Kölcsönös tiszteleten és bizalmon alapuló hosszú távú kapcsolatokat építünk 
                  ügyfeleinkkel és beszállítóinkkal egyaránt.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="bg-teal-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="text-teal-600" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-black mb-3 text-center">Felelősség</h3>
                <p className="text-gray-700 text-center">
                  Környezetbarát csomagolást használunk és minimalizáljuk szénlábnyomunkat 
                  a szállítások optimalizálásával.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Utunk a sikerhez</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2020
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">A Jovotech megalapítása</h3>
                  <p className="text-gray-700">
                    Kis online áruházként kezdtük működésünket azzal a vízióval, hogy magas 
                    minőségű termékeket szállítsunk. Az első megrendeléseket otthoni irodából teljesítettük.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    2021
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Az első 1000 vásárló</h3>
                  <p className="text-gray-700">
                    Átléptük az 1000 elégedett vásárló mágikus határát. Megnyitottuk saját 
                    raktárunkat és felvettük első alkalmazottainkat.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2022
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Választék bővítése</h3>
                  <p className="text-gray-700">
                    Jelentősen bővítettük termékkínálatunkat és együttműködést kezdtünk új, 
                    neves beszállítókkal. Bevezettük a hűségprogramot.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    2023
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Új raktár és automatizálás</h3>
                  <p className="text-gray-700">
                    Nagyobb raktárba költöztünk Liberecben. Automatizáltuk a csomagolási 
                    folyamatot és bevezettük a raktárkezelő rendszert.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    2024
                  </div>
                  <div className="w-0.5 h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-lg mb-2">Nemzetközi terjeszkedés</h3>
                  <p className="text-gray-700">
                    Megkezdtük a szállítást Csehországba, Szlovákiába és Németországba. 
                    Megkaptuk a "Megbízható Online Áruház" tanúsítványt és díjat a legjobb ügyfélszolgálatért.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    2025
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Ingyenes szállítás mindenkinek</h3>
                  <p className="text-gray-700">
                    Bevezettük az ingyenes szállítást minden megrendeléshez. További terjeszkedést 
                    és saját mobilalkalmazás bevezetését tervezzük.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Csapatunk</h2>
            
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                A Jovotech sikere mögött az e-kereskedelem rajongóinak csapata áll, akik 
                minden nap azon dolgoznak, hogy vásárlásai még jobbak legyenek.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Package className="text-blue-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">Beszerzési osztály</h4>
                  <p className="text-sm text-gray-600">A legjobb termékeket választják ki</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Users className="text-green-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">Ügyfélszolgálat</h4>
                  <p className="text-sm text-gray-600">Mindig segítőkészek és mosolygósak</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Truck className="text-purple-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">Raktár és logisztika</h4>
                  <p className="text-sm text-gray-600">Gyors és biztonságos szállítás</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4">
                  <Globe className="text-orange-600 mx-auto mb-2" size={40} />
                  <h4 className="font-semibold">IT és marketing</h4>
                  <p className="text-sm text-gray-600">Modern megoldások</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Testimonial */}
          <div className="bg-white rounded-lg p-8 mb-8 text-center">
            <Quote className="text-gray-300 mx-auto mb-4" size={48} />
            <blockquote className="text-xl text-gray-700 italic mb-4 max-w-3xl mx-auto">
              "A Jovotech több mint áruház - olyan partner, akiben megbízhatok. 
              Mindig a legmagasabb minőségű termékeket kapom, és az ügyfélszolgálat 
              a legmagasabb szinten működik. Mindenkinek ajánlom!"
            </blockquote>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={20} />
              ))}
            </div>
            <p className="text-gray-600">- Kovács Anna, állandó vásárló 2021 óta</p>
          </div>

          {/* Certifications & Awards */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Tanúsítványok és díjak</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <Trophy className="text-gold-500 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">Legjobb E-kereskedő 2024</h4>
                <p className="text-xs text-gray-600 mt-1">Kategória: Ügyfélszolgálat</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <Shield className="text-blue-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">Megbízható Online Áruház</h4>
                <p className="text-xs text-gray-600 mt-1">Biztonsági tanúsítvány</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <Award className="text-green-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">ISO 9001:2015</h4>
                <p className="text-xs text-gray-600 mt-1">Minőségirányítási rendszer</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <Star className="text-purple-600 mx-auto mb-3" size={40} />
                <h4 className="font-semibold text-sm">Top 100 E-kereskedelem</h4>
                <p className="text-xs text-gray-600 mt-1">Forbes rangsor 2024</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us - Expanded */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Mi különböztet meg minket?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Package className="text-blue-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Széles választék</h3>
                  <p className="text-gray-700">
                    Több mint 10 000 termék állandó kínálatunkban. Az elektronikától az otthon 
                    és kerten át a sportcikkekig - mindent megtalál nálunk, amire szüksége van.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <TrendingUp className="text-green-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Legjobb árak</h3>
                  <p className="text-gray-700">
                    Naponta figyeljük a piacot és tárgyalunk a beszállítókkal, hogy a 
                    legkedvezőbb árakat kínálhassuk. Továbbá rendszeres akciók és kedvezmények.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Clock className="text-purple-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Expressz teljesítés</h3>
                  <p className="text-gray-700">
                    A 14:00 előtt leadott rendeléseket még aznap feladjuk. Az átlagos 
                    csomagkészítési idő mindössze 2 óra.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Heart className="text-red-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Támogatás hét napon át</h3>
                  <p className="text-gray-700">
                    Ügyfélszolgálati csapatunk minden nap elérhető. Az e-mailekre maximum 
                    2 órán belül válaszolunk.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Shield className="text-orange-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Elégedettségi garancia</h3>
                  <p className="text-gray-700">
                    30 napos elállási jog indoklás nélkül. Továbbá kiterjesztett garanciát 
                    kínálunk minden elektronikai termékre.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                <Truck className="text-teal-600 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg text-black mb-2">Ingyenes szállítás</h3>
                  <p className="text-gray-700">
                    Minden megrendelést ingyen szállítunk. Nincs minimális rendelési összeg, 
                    nincsenek rejtett költségek - mindig 0 Ft a szállítás.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Responsibility */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-black text-center">Társadalmi felelősségvállalás</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6">
                <Leaf className="text-green-600 mx-auto mb-3" size={40} />
                <h3 className="font-semibold text-center mb-2">Ökológia</h3>
                <p className="text-gray-700 text-sm text-center">
                  Csak lebomló csomagolóanyagokat használunk. 2024-ben 40%-kal csökkentettük 
                  CO2 kibocsátásunkat.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <Heart className="text-red-600 mx-auto mb-3" size={40} />
                <h3 className="font-semibold text-center mb-2">Jótékonysági tevékenység</h3>
                <p className="text-gray-700 text-sm text-center">
                  Évente támogatjuk a helyi jótékonysági szervezeteket. 2024-ben több mint 
                  2 millió Ft-ot adományoztunk társadalmi célokra.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <Users className="text-blue-600 mx-auto mb-3" size={40} />
                <h3 className="font-semibold text-center mb-2">Helyi közösség</h3>
                <p className="text-gray-700 text-sm text-center">
                  Helyi beszállítókkal működünk együtt és a régió lakosait foglalkoztatjuk, 
                  támogatva a helyi gazdaságot.
                </p>
              </div>
            </div>
          </div>

          {/* Future Plans */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-black text-center">Jövőbeli terveink</h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Mobilalkalmazás</h4>
                  <p className="text-gray-700 text-sm">
                    Hamarosan elindítjuk mobilalkalmazásunkat exkluzív ajánlatokkal a felhasználóknak.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Saját márka termékek</h4>
                  <p className="text-gray-700 text-sm">
                    Dolgozunk a Jovotech saját márkás termékcsaládon, amely ötvözi a minőséget a megfizethető árral.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Átvételi pontok</h4>
                  <p className="text-gray-700 text-sm">
                    Saját átvételi pontok nyitását tervezzük Magyarország legnagyobb városaiban.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <ChevronRight className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold mb-1">Partner program</h4>
                  <p className="text-gray-700 text-sm">
                    Affiliate programot vezetünk be bloggerek és influencerek számára.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">Kérdése van? Együttműködne velünk?</h2>
            <p className="text-lg mb-6 text-blue-100">
              Nyitottak vagyunk az új lehetőségekre és mindig szívesen válaszolunk a kérdésekre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kapcsolat" 
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Kapcsolatfelvétel
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Tovább az áruházba
                <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}