// src/app/gwarancja-najnizszej-ceny/page.tsx
import { Metadata } from 'next';
import { Check, ShieldCheck, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legalacsonyabb ár garancia - Jovotech',
  description: 'Garantáljuk a legalacsonyabb árakat a piacon. Olcsóbban találta? Visszatérítjük a különbözetet!',
};

export default function PriceGuaranteePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#6da306] rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#131921] mb-4">
            Legalacsonyabb ár garancia
          </h1>
          <p className="text-xl text-gray-600">
            Olcsóbban találta? Visszatérítjük a különbözetet!
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold text-[#131921] mb-0">
              A Jovotech-nél garantáljuk a legalacsonyabb árakat minden termékre. 
              Ha ugyanazt a terméket olcsóbban találja a versenytársnál, azonnal visszatérítjük a különbözetet!
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#131921] mb-6">Hogyan működik a garanciánk?</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#6da306] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#131921] mb-2">Találjon alacsonyabb árat</h3>
                <p className="text-gray-600">
                  Ha ugyanazt a terméket más webáruházban alacsonyabb áron találja, 
                  mentse el a versenytárs ajánlatának linkjét.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#6da306] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#131921] mb-2">Lépjen kapcsolatba velünk</h3>
                <p className="text-gray-600">
                  Küldjön e-mailt a <a href="mailto:support@jovotech.hu" className="text-[#6da306] underline">support@jovotech.hu</a> címre 
                  a rendelési számmal és az olcsóbb ajánlat linkjével.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#6da306] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#131921] mb-2">Kapja meg a különbözetet</h3>
                <p className="text-gray-600">
                  A bejelentés ellenőrzése után 24 órán belül visszatérítjük az árkülönbözetet 
                  bankszámlájára vagy kedvezménykódként a következő vásárlásához.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#131921] mb-6">A garancia feltételei</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  A garancia a vásárlás dátumától számított <strong>14 napig</strong> érvényes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  A terméknek <strong>azonosnak</strong> kell lennie (ugyanaz a modell, szín, méret, állapot)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  A versenytárs ajánlatának <strong>jelenleg elérhetőnek</strong> kell lennie magyar webáruházban
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  A versenytárs árának tartalmaznia kell a <strong>szállítási költséget</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  A garancia nem vonatkozik kiárusításokra, Black Friday típusú akciókra vagy időkorlátos ajánlatokra
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-[#131921] mb-6">Miért érdemes?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da306] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#131921] mb-2">Biztonságos vásárlás</h3>
              <p className="text-sm text-gray-600">
                Vásároljon azzal a biztonságérzettel, hogy nem fizet túl sokat
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da306] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#131921] mb-2">Gyors ellenőrzés</h3>
              <p className="text-sm text-gray-600">
                24 órán belül válaszolunk
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da306] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#131921] mb-2">Egyszerű eljárás</h3>
              <p className="text-sm text-gray-600">
                Elég egyetlen e-mail
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-[#6da306] text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Kérdése van?</h3>
            <p className="mb-6">
              Lépjen kapcsolatba velünk, és csapatunk szívesen segít!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@jovotech.hu" 
                className="inline-flex items-center justify-center gap-2 bg-white text-[#6da306] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Mail size={20} />
                support@jovotech.hu
              </a>
              <div className="inline-flex items-center justify-center gap-2 bg-white/20 px-6 py-3 rounded-lg font-semibold">
                <Clock size={20} />
                H-P: 8:00-18:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}