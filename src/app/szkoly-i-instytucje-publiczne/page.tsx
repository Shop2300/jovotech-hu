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
            Ajánlat iskolák és közintézmények számára
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Üdvözöljük a <strong>közintézmények, iskolák, hivatalok, civil szervezetek</strong> 
            és más állami szervek számára készült oldalunkon. Mint minőségi termékek szállítója, megértjük 
            a közintézmények speciális igényeit és követelményeit az online vásárlás során. Ezen az oldalon 
            információkat talál arról, hogyan könnyíthetjük meg a beszerzési folyamatot és milyen előnyöket kínálunk.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            A Jovotech.hu-val való együttműködés előnyei közintézmények számára
          </h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Számlás fizetés</strong> 14-30 napos fizetési határidővel, előzetes fizetés nélkül.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Gyors szállítás</strong> - a legtöbb termék raktáron, aznapi kiszállítással 14:00 óráig leadott rendelés esetén.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Egyedi árajánlatok</strong> nagyobb megrendelésekhez és mennyiségi kedvezmények lehetősége.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Szakértői tanácsadás</strong> és technikai támogatás a termékválasztáshoz.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Keretszerződés kötésének lehetősége</strong> hosszú távú együttműködéshez.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Standard 24 hónapos garancia</strong> adószámos szervezetek számára is.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Tanúsítvánnyal rendelkező termékek</strong> magyar dokumentációval.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span><strong>Szerviz és támogatás</strong> magyar nyelven, beleértve a reklamációk kezelését is.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Hogyan zajlik a beszerzési folyamat közintézmények számára
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Ajánlatkérés és árajánlat</h3>
              </div>
              <p className="text-gray-600">
                Küldjön nekünk kötelezettség nélküli ajánlatkérést e-mailben vagy az oldalon található űrlapon keresztül. 
                Szívesen készítünk egyedi árajánlatot az Önök igényeinek megfelelően, 
                amelyet felhasználhatnak intézményük belső jóváhagyási folyamatában.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Megrendelés</h3>
              </div>
              <p className="text-gray-600">
                Az ajánlat jóváhagyása után kérjük, küldje el a hivatalos megrendelést számmal, 
                bélyegzővel és a felelős személy aláírásával e-mailben. Visszaigazoljuk a megrendelést 
                és gondoskodunk az áru kiszállításáról.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Szállítás és számlázás</h3>
              </div>
              <p className="text-gray-600">
                Az árut az Önök által megadott címre szállítjuk. A kiszállítás után számlát állítunk ki 
                14 napos fizetési határidővel (kérésre 30 napig), feltüntetve 
                az Önök megrendelési számát a könnyű könyvelési egyeztetés érdekében.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#6da306] text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-[#131921]">Szerviz és támogatás</h3>
              </div>
              <p className="text-gray-600">
                A vásárlás után is teljes támogatást nyújtunk, magyar nyelvű útmutatókat biztosítunk 
                és szükség esetén prioritással kezeljük a reklamációkat. Minden 
                termékre standard 24 hónapos garanciát vállalunk.
              </p>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Megrendelési és számlázási folyamat közintézmények számára
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <FileCheck className="text-[#6da306]" size={24} />
                Megrendelési módok
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Közvetlen megrendelés a webáruházon keresztül (számlás fizetés megjegyzéssel)</li>
                <li>• E-mailben az intézmény hivatalos megrendelésével</li>
                <li>• Telefonon, későbbi e-mailes megerősítéssel</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <Package className="text-[#6da306]" size={24} />
                Fizetési feltételek
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Számlás fizetés 14 napos fizetési határidővel (alapértelmezett)</li>
                <li>• Meghosszabbított fizetési határidő lehetősége 30 napig (kérésre)</li>
                <li>• Nincs előleg követelmény standard termékek esetén</li>
                <li>• Egyedi fizetési feltételek lehetősége állandó ügyfelek számára</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <FileCheck className="text-[#6da306]" size={24} />
                Számlázási követelmények
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• A számla tartalmazza az Önök megrendelési számát a könnyebb párosításhoz</li>
                <li>• Helyesen megadott intézményi számlázási adatok (adószám, cím)</li>
                <li>• Különböző szállítási és számlázási adatok lehetősége</li>
                <li>• Minden adóügyi dokumentum követelménye</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#131921] mb-4 flex items-center gap-2">
                <Clock className="text-[#6da306]" size={24} />
                Szállítás és kézbesítés
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Aznapi kiszállítás raktárról (14:00 óráig leadott rendelés esetén)</li>
                <li>• Kézbesítés egész Magyarországon 1-2 munkanapon belül</li>
                <li>• Szállítási információk és csomagkövetés e-mailben</li>
                <li>• Speciális szállítási igények lehetősége (dátum, időpont)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Public Procurement Section */}
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#131921] mb-6">
            Közbeszerzések és 18 millió Ft feletti beszerzések
          </h2>
          <p className="text-gray-700 mb-6">
            Megértjük a közintézmények követelményeit a kis értékű közbeszerzések 
            és nagyobb beszerzések megvalósítása során. A nettó 18 millió Ft feletti beszerzésekhez kínálunk:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>A pályázati eljáráshoz szükséges összes dokumentum biztosítása (minősítési dokumentumok, terméktanúsítványok)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>Írásos adásvételi szerződés megkötésének lehetősége az Önök belső szabályozásának megfelelően</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>A pályázati feltételeknek megfelelő részletes árajánlat elkészítése</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
              <span>Egyedi megközelítés nagy projektekhez, beleértve a személyes konzultáció lehetőségét</span>
            </li>
          </ul>
        </div>

        {/* Products for Institutions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Közintézmények számára megfelelő termékek
          </h2>
          <p className="text-gray-700 mb-8">
            Különböző típusú közintézmények számára megfelelő, kiváló minőségű termékek széles választékát kínáljuk:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <School className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Iskolák és oktatási intézmények számára
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Műhelyfelszerelés és szerszámok</li>
                <li>• Laboratóriumi eszközök</li>
                <li>• Konyhai felszerelés iskolai menzák számára</li>
                <li>• Oktatástechnikai eszközök</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Building2 className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Hivatalok és közigazgatási épületek számára
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Irodai és raktári felszerelés</li>
                <li>• Karbantartási műszaki eszközök</li>
                <li>• Légkondicionáló és fűtési rendszerek</li>
                <li>• Bútorok és berendezések</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Trophy className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Sport- és kulturális létesítmények számára
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sporteszközök és kiegészítők</li>
                <li>• Rendezvények műszaki háttere</li>
                <li>• Helyiségek bútorai és felszerelése</li>
                <li>• Hangosítási rendszerek</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Heart className="text-[#6da306] mb-4" size={32} />
              <h3 className="text-lg font-semibold text-[#131921] mb-3">
                Szociális és egészségügyi intézmények számára
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Konyhai felszerelés és kiegészítők</li>
                <li>• Ápolási technikai segédeszközök</li>
                <li>• Speciális felszerelések</li>
                <li>• Bútorok és berendezések</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Akik már megbíznak bennünk
          </h2>
          <p className="text-gray-700 mb-8">
            Számos elégedett vállalattal és szervezettel működünk együtt különböző iparágakból.
          </p>
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

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] mb-8">
            Gyakran ismételt kérdések
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Kaphatunk-e termékmintákat nagyobb vásárlás előtt?
              </h3>
              <p className="text-gray-700">
                Igen, kiválasztott termékekhez kínálunk bemutatási vagy mintakölcsönzési lehetőséget. 
                További információkért vegye fel velünk a kapcsolatot a support@jovotech.hu címen.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Milyen dokumentumok szükségesek a számlás rendeléshez?
              </h3>
              <p className="text-gray-700">
                Az első számlás rendeléshez szükségünk van hivatalos megrendelésre adószámmal, 
                számlázási címmel, szállítási címmel, kapcsolattartó személlyel és a felelős személy aláírásával.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Meghosszabbítható-e a számla fizetési határideje 14 napon túl?
              </h3>
              <p className="text-gray-700">
                Igen, kérésre akár 30 napos fizetési határidőt is biztosíthatunk, különösen 
                nagyobb megrendelések vagy állandó ügyfelek esetében.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                A termékek megfelelnek-e az európai szabványoknak és tanúsítványoknak?
              </h3>
              <p className="text-gray-700">
                Igen, minden termék CE tanúsítvánnyal rendelkezik és megfelel a vonatkozó európai szabványoknak. 
                Kérésre biztosítjuk a szükséges tanúsítványokat és műszaki dokumentációt.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131921] mb-2">
                Mi a teendő, ha olyan termékekre van szükségünk, amelyek jelenleg nincsenek az oldalon?
              </h3>
              <p className="text-gray-700">
                Széles termékportfólióhoz van hozzáférésünk. Vegye fel velünk a kapcsolatot ajánlatkéréssel 
                a support@jovotech.hu címen, és ellenőrizzük olyan termékek elérhetőségét is, 
                amelyek jelenleg nem szerepelnek a webáruház kínálatában.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-green-50 border-l-4 border-[#6da306] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#131921] mb-6">
            Vegye fel velünk a kapcsolatot egyedi ajánlatért
          </h2>
          <p className="text-gray-700 mb-6">
            Ha érdekli intézményük számára egy egyedi árajánlat 
            vagy bármilyen kérdése van a termékekkel kapcsolatban, kérjük, vegye fel velünk a kapcsolatot. Csapatunk 
            készen áll a teljes körű támogatásra és tanácsadásra.
          </p>
          
          <div className="mb-8">
            <p className="font-semibold text-[#131921] flex items-center gap-2">
              <Mail className="text-[#6da306]" size={20} />
              E-mail: <a href="mailto:support@jovotech.hu" className="text-[#6da306] underline">support@jovotech.hu</a>
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Név *
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
                  Intézmény neve *
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
                Üzenet *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6da306]"
                placeholder="Kérjük, írja le igényeit..."
                style={{ '--field-index': 4 } as React.CSSProperties}
              />
            </div>

            <button
              type="submit"
              className="bg-[#6da306] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#5d8f05] transition-colors"
            >
              Ajánlatkérés küldése
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}