// src/app/szallitasi-informaciok/page.tsx
'use client';

import { Metadata } from 'next';
import { Package, MapPin, Clock, Truck, Info } from 'lucide-react';
import { useState } from 'react';

export default function DeliveryInfoPage() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const trackingLinks = [
    { name: 'GLS', url: 'https://gls-group.com/HU/hu/csomagkovetes' },
    { name: 'DPD', url: 'https://www.dpd.com/hu/hu/csomagkovetes/' },
    { name: 'DHL', url: 'https://www.dhl.com/hu-hu/home/tracking.html' },
    { name: 'Magyar Posta', url: 'https://www.posta.hu/nyomkovetes' },
    { name: 'UPS', url: 'https://www.ups.com/track?loc=hu_HU' },
    { name: 'FedEx', url: 'https://www.fedex.com/hu-hu/tracking.html' },
    { name: 'Foxpost', url: 'https://www.foxpost.hu/csomagkovetes' },
    { name: 'Packeta', url: 'https://tracking.packeta.com/hu/' },
    { name: 'TNT', url: 'https://www.tnt.com/express/hu_hu/site/shipping-tools/tracking.html' },
  ];

  const faqs = [
    {
      question: 'Hogyan követhetem nyomon a csomagomat?',
      answer: `A csomag nyomon követéséhez szüksége van egy egyedi nyomkövetési számra, amelyet általában e-mailben küldünk a support@jovotech.hu címről. 
      
Miután megkapta a számot, lépjen a futárszolgálat weboldalára (pl. GLS, DPD vagy Magyar Posta), és írja be ezt a számot a csomagkövetési mezőbe. A rendszer megmutatja a csomag aktuális státuszát – hol található és mikor várható a kézbesítés.

Ha az információk nem elérhetők, ellenőrizze a szám helyességét, vagy próbálja meg később újra. Probléma esetén írjon nekünk a support@jovotech.hu címre - segítünk megtalálni a csomagját.`
    },
    {
      question: 'Mit tegyek, ha a csomagom késik?',
      answer: `Ha a csomagja késik, először ellenőrizze a státuszát a nyomkövetési számmal a futárszolgálat weboldalán. Az aktuális információk jelezhetik a késés okát, pl. kedvezőtlen időjárási körülmények vagy megnövekedett csomagmennyiség.

Ha a státusz több mint 24 órán keresztül nem változik, vegye fel a kapcsolatot a futárszolgálat ügyfélszolgálatával. Készítse elő a nyomkövetési számot és a csomag részleteit.

Írhat nekünk is a support@jovotech.hu címre - feladóként további lépéseket tehetünk a kézbesítés felgyorsítása vagy a probléma megoldása érdekében. A legtöbb késés ideiglenes tényezők miatt következik be és gyorsan megoldódik.`
    },
    {
      question: 'Megváltoztathatom a kézbesítési címet?',
      answer: `Igen, a kézbesítési cím megváltoztatása általában lehetséges, de ez függ a csomag aktuális státuszától és a futárszolgálat szabályzatától. 

Először jelentkezzen be a futárszolgálat weboldalán a nyomkövetési szám használatával. Ha a címváltoztatási opció elérhető, megtalálja a csomag részleteinél. Sok futárszolgálat (pl. DPD, UPS) lehetővé teszi a cím online vagy mobilalkalmazáson keresztüli megváltoztatását.

Ha nem tudja önállóan megváltoztatni a címet, írjon nekünk a support@jovotech.hu címre a lehető leghamarabb. Segítünk a futárszolgálattal való kapcsolatfelvételben és a kézbesítési cím megváltoztatásában. Ne feledje, hogy a változtatás nehezebb lehet, ha a csomag már a futárnál van.`
    },
    {
      question: 'Hogyan változtathatom meg a kézbesítés időpontját?',
      answer: `A kézbesítési időpont megváltoztatása a legtöbb futárszolgálatnál lehetséges. Ellenőrizze a csomag státuszát a futárszolgálat weboldalán a nyomkövetési szám használatával.

Sok futárszolgálat (DPD, UPS, GLS) online eszközöket vagy mobilalkalmazásokat kínál, ahol kiválaszthatja a megfelelő kézbesítési időpontot. Ez az opció gyakran "Kézbesítési időpont módosítása" vagy "Rugalmas kézbesítés" néven található.

Ha nem tudja online megváltoztatni az időpontot, vegye fel a kapcsolatot a futárszolgálat ügyfélszolgálatával vagy írjon nekünk a support@jovotech.hu címre. Egyes változtatások díjkötelesek lehetnek, különösen ha konkrét időintervallumot igényel.

Javasoljuk, hogy a lehető leghamarabb cselekedjen, mivel egyes rendszerek csak a kézbesítés előtt meghatározott időpontig engedélyezik a változtatásokat.`
    },
    {
      question: 'Követhetek egyszerre több csomagot?',
      answer: `Igen, több csomag nyomon követése lehetséges, bár ez függ a futárszolgálat lehetőségeitől. Néhányan (pl. UPS, DPD) lehetővé teszik több nyomkövetési szám egyidejű megadását online eszközeikben.

Ha rendszeresen rendel tőlünk, javasoljuk, hogy hozzon létre fiókot weboldalunkon - minden megrendelése és nyomkövetési száma egy helyen lesz elérhető a "Megrendeléseim" részben.

Létrehozhat fiókot a futárszolgálatoknál is, ahol bejelentkezés után hozzáadhatja a csomagokat a követési listához és központi áttekintést kaphat.

A kényelem érdekében mentse el a nyomkövetési számokat az e-mailjeinkből. Ha kérdése van konkrét csomagokkal kapcsolatban, írjon a support@jovotech.hu címre - szívesen segítünk.`
    },
    {
      question: 'Hogyan ellenőrizhetem, melyik futárszolgálat szállítja a csomagomat?',
      answer: `A futárszolgálatról szóló információt megtalálja a feladást visszaigazoló e-mailben, amelyet az Ön e-mail címére küldünk a csomag feladása után. Az e-mail tartalmazza a futárszolgálat nevét és a nyomkövetési számot.

Ezeket az információkat a weboldalunkon is ellenőrizheti, bejelentkezve fiókjába a "Megrendeléseim" részben - minden megrendelésnél látható a futárszolgálat és a nyomkövetési szám.

Főleg a következőkkel dolgozunk: GLS, DPD, DHL, Magyar Posta és UPS. A futárszolgálat kiválasztása a megrendelés során választott szállítási módtól függ.

Ha nem kapta meg a feladásról szóló e-mailt, ellenőrizze a SPAM mappát, vagy írjon nekünk a support@jovotech.hu címre - azonnal elküldjük az összes szükséges információt.`
    },
    {
      question: 'Mit tegyek, ha a csomag státusza napok óta nem változik?',
      answer: `Ha a csomag státusza több napig nem változik, először győződjön meg róla, hogy a helyes nyomkövetési számot adta meg. Ne feledje, hogy ünnepi időszakokban vagy nagy forgalom esetén a rendszerek késedelmet mutathatnak a frissítésekben.

Nemzetközi szállítmányoknál vagy logisztikai csúcsidőszakokban hosszabb késedelem léphet fel a válogatóközpontok közötti szállítás során. Ha a státusz 3-5 napnál hosszabb ideig nem változik, vegye fel a kapcsolatot a futárszolgálat ügyfélszolgálatával.

Írjon nekünk is a support@jovotech.hu címre - feladóként további lehetőségeink vannak a státusz ellenőrzésére és hivatalos megkeresést nyújthatunk be a futárszolgálathoz.

A legtöbb esetben ideiglenes logisztikai késésről van szó, nem a csomag elvesztéséről. A kulcs a türelem és a kommunikáció.`
    },
    {
      question: 'Mit jelentenek az egyes csomag státuszok?',
      answer: `Íme a leggyakoribb csomagstátuszok és jelentésük:

**"Átvéve szállításra"** - a csomag regisztrálva van a futárszolgálat rendszerében és átvételre vár.

**"Válogatóközpontban"** - a csomag megérkezett a válogatóközpontba, ahol a célállomás szerint válogatják.

**"Úton"** - a csomag elküldve a válogatóközpontból és úton van a következő pontra.

**"Célállomási részlegben"** - a csomag megérkezett az Ön környékének legközelebbi elosztóközpontjába.

**"Átadva a futárnak"** - a csomag a futárnál van és még aznap kézbesítésre kerül.

**"Kézbesítve"** - a csomag sikeresen kézbesítve lett.

**"Sikertelen kézbesítési kísérlet"** - a futár megpróbálta kézbesíteni a csomagot, de senkit sem talált. A csomag átvételi pontra kerülhet.

**"Átvételre vár"** - a csomag az átvételi ponton várakozik (pl. Foxpost automata).

Ha nem érti egy konkrét státusz jelentését, írjon nekünk a support@jovotech.hu címre - elmagyarázzuk, hogy pontosan mit jelent.`
    },
    {
      question: 'A nyomkövetés mutatja a pontos kézbesítési időt?',
      answer: `A nyomkövetési rendszer a várható kézbesítési időt mutatja, amely változhat a következőktől függően:

• **Közlekedési helyzet** - dugók vagy balesetek késedelmet okozhatnak
• **Időjárás** - kedvezőtlen időjárási körülmények befolyásolják a szállítást
• **Futár leterheltsége** - az adott napon kézbesítendő csomagok száma

Egyes futárszolgálatok (pl. DPD) "élő követést" kínálnak pontosabb kézbesítési idővel, amikor a futár már úton van Önhöz.

A kézbesítés napján gyakran kap SMS-t vagy e-mailt egy időintervallummal (pl. 10:00-12:00), amikor várhatja a futárt.

Ha konkrét időpontban van szüksége a kézbesítésre, írjon nekünk a support@jovotech.hu címre a megrendelés előtt - tanácsot adunk a legjobb szállítási opcióról az Ön igényeihez.`
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#6da306] rounded-full flex items-center justify-center">
              <Truck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#131921] mb-4">
            Szállítási információk
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ha ellenőrizni szeretné csomagja információit vagy nyomon követni aktuális helyzetét, 
            jó helyen jár! Ezen az oldalon megtalálja a legnépszerűbb futárszolgálatok linkjeinek 
            áttekintését, amelyek lehetővé teszik csomagjai egyszerű és gyors nyomon követését.
          </p>
        </div>

        {/* Tracking Links Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] text-center mb-8">
            <span className="border-b-2 border-[#6da306] pb-2">Kövesse nyomon csomagját</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trackingLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#222f3f] text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-[#1b2433] hover:scale-105 hover:rotate-2 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] text-center mb-8">
            <span className="border-b-2 border-[#6da306] pb-2">Gyakran ismételt kérdések</span>
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3
                  className="text-lg font-bold text-[#131921] cursor-pointer flex items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="flex items-center gap-3">
                    <Package className="text-[#6da306]" size={20} />
                    {faq.question}
                  </span>
                  <span className={`transform transition-transform ${activeFaqIndex === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </h3>
                {activeFaqIndex === index && (
                  <div className="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* General Delivery Information */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-[#131921] text-center mb-8">
            <span className="border-b-2 border-[#6da306] pb-2">Kézbesítési információk</span>
          </h2>
          <div className="space-y-6 text-gray-700 max-w-4xl mx-auto">
            <p>
              A csomag kézbesítése több szakaszban történik, mindegyiknek megvan a maga sajátossága és szabálya. 
              Általánosságban elmondható, hogy a szállítási időt különböző tényezők befolyásolják, mint például 
              a szállítási szolgáltatás típusa, a feladó és a címzett közötti távolság, a futárszolgálat aktuális 
              terheltsége és egyéb logisztikai körülmények.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-semibold text-[#131921] mb-3 flex items-center gap-2">
                  <Clock className="text-[#6da306]" size={20} />
                  Szokásos szállítási idők
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Foxpost/Packeta automaták:</strong> 1-2 munkanap</li>
                  <li>• <strong>GLS/DPD/DHL futár:</strong> 1-3 munkanap</li>
                  <li>• <strong>Magyar Posta:</strong> 2-5 munkanap</li>
                  <li>• <strong>Expressz szállítás:</strong> következő munkanap</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-semibold text-[#131921] mb-3 flex items-center gap-2">
                  <Info className="text-[#6da306]" size={20} />
                  Fontos információk
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Minden csomag biztosított</li>
                  <li>• Ingyenes szállítás minden megrendelésnél</li>
                  <li>• Online csomagkövetési lehetőség</li>
                  <li>• SMS/e-mail értesítések a státuszról</li>
                </ul>
              </div>
            </div>
            
            <p>
              Ha kézbesítésre vár, javasoljuk a csomag státuszának követését a nyomkövetési szám segítségével, 
              amely lehetővé teszi a csomag aktuális helyzetének és a várható kézbesítési időnek az ellenőrzését. 
              A kézbesítés során fontos, hogy valaki legyen a címen, aki átveheti a csomagot.
            </p>
            
            <p>
              Késés, szállítási cím megváltoztatása vagy egyéb problémák esetén a lehető leghamarabb lépjen 
              kapcsolatba velünk a <a href="mailto:support@jovotech.hu" className="text-[#6da306] underline font-semibold">support@jovotech.hu</a> címen. 
              Minden futárszolgálatnak megvannak a saját szabályai és eljárásai az ilyen helyzetek kezelésére, 
              ezért érdemes előre megismerkedni velük.
            </p>
            
            <div className="bg-[#6da306] text-white rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Segítségre van szüksége?</h3>
              <p className="mb-4">
                Ügyfélszolgálati csapatunk az Ön rendelkezésére áll
              </p>
              <a
                href="mailto:support@jovotech.hu"
                className="inline-flex items-center gap-2 bg-white text-[#6da306] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <MapPin size={20} />
                support@jovotech.hu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}