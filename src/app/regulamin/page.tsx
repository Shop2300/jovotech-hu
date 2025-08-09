import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Általános Szerződési Feltételek - Jovotech',
  description: 'A Jovotech online áruház általános szerződési feltételei - értékesítési feltételek, visszaküldés, reklamáció',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Általános Szerződési Feltételek</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-center font-bold mb-4">Adatvédelmi szabályzat</p>
        
        <div className="text-center mb-6">
          <p><strong>Cégnév:</strong> Jovotech</p>
          <p><strong>Cím:</strong> 1. máje 535/50, 46007 Liberec III-Jeřáb, Csehország</p>
          <p><strong>Adószám:</strong> 04688465</p>
          <p><strong>Jogi forma:</strong> Vállalkozás</p>
          <p><strong>Email:</strong> <a href="mailto:support@jovotech.hu" className="text-blue-600 hover:underline">support@jovotech.hu</a></p>
          <p className="mt-2 text-sm italic">(Székhely - levelezést kérjük e-mailben)</p>
        </div>

        <p className="text-center mb-6">
          a www.jovotech.hu internetes címen elérhető online áruházon keresztül történő áruértékesítésre vonatkozóan
        </p>

        <ol className="list-decimal space-y-6">
          <li>
            <strong>BEVEZETŐ RENDELKEZÉSEK</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Jelen szabályzat (a továbbiakban: „<strong>szabályzat</strong>") a Jovotech, székhelye: 1. máje 535/50, 46007 Liberec III-Jeřáb, Csehország, adószám: 04688465 (a továbbiakban: „<strong>eladó</strong>") a magyar jogszabályoknak megfelelően szabályozza az eladó és más természetes személy (a továbbiakban: „<strong>vevő</strong>") között az eladó online áruházán keresztül létrejött adásvételi szerződés (a továbbiakban: „<strong>adásvételi szerződés</strong>") alapján vagy azzal kapcsolatban létrejött kölcsönös jogokat és kötelezettségeket. Az online áruházat az eladó a www.jovotech.hu címen elérhető weboldalon (a továbbiakban: „<strong>weboldal</strong>") működteti, a weboldal felületén keresztül (a továbbiakban: „<strong>online áruház felülete</strong>").
              </li>
              <li>
                A szabályzat nem alkalmazandó azokban az esetekben, amikor az eladótól árut vásárolni szándékozó személy jogi személy vagy olyan személy, aki üzleti tevékenysége vagy önálló szakmai tevékenysége keretében rendel.
              </li>
              <li>
                A szabályzattól eltérő rendelkezésekben az adásvételi szerződésben lehet megállapodni. Az adásvételi szerződésben szereplő eltérő megállapodások elsőbbséget élveznek a szabályzat rendelkezéseivel szemben.
              </li>
              <li>
                A szabályzat rendelkezései az adásvételi szerződés szerves részét képezik. Az adásvételi szerződés és a szabályzat magyar nyelven készül. Az adásvételi szerződés magyar nyelven köthető meg.
              </li>
              <li>
                A szabályzat tartalmát az eladó módosíthatja vagy kiegészítheti. Ez a rendelkezés nem érinti a szabályzat korábbi verziójának hatálya alatt keletkezett jogokat és kötelezettségeket.
              </li>
            </ol>
          </li>

          <li>
            <strong>FELHASZNÁLÓI FIÓK</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                A vevő weboldalon történő regisztrációja alapján a vevő hozzáférhet saját felhasználói felületéhez. Felhasználói felületéről a vevő megrendeléseket adhat le árukra (a továbbiakban: „<strong>felhasználói fiók</strong>"). Ha az online áruház felülete lehetővé teszi, a vevő regisztráció nélkül is leadhat megrendeléseket közvetlenül az online áruház felületéről.
              </li>
              <li>
                A weboldalon történő regisztráció és a megrendelés leadása során a vevő köteles minden adatot helyesen és a valóságnak megfelelően megadni. A felhasználói fiókban megadott adatokat a vevő köteles minden változás esetén frissíteni. Az eladó a vevő által a felhasználói fiókban és a megrendelés leadásakor megadott adatokat helyesnek tekinti.
              </li>
              <li>
                A felhasználói fiókhoz való hozzáférés felhasználónévvel és jelszóval védett. A vevő köteles megőrizni a felhasználói fiókjához való hozzáféréshez szükséges információk bizalmasságát.
              </li>
              <li>
                A vevő nem jogosult harmadik személyek számára engedélyezni a felhasználói fiók használatát.
              </li>
              <li>
                Az eladó törölheti a felhasználói fiókot, különösen akkor, ha a vevő több mint egy éve nem használja felhasználói fiókját, vagy ha a vevő megszegi az adásvételi szerződésből (beleértve a szabályzatot) eredő kötelezettségeit.
              </li>
              <li>
                A vevő tudomásul veszi, hogy a felhasználói fiók nem feltétlenül érhető el folyamatosan, különösen az eladó hardverének és szoftverének szükséges karbantartása vagy harmadik felek hardverének és szoftverének szükséges karbantartása miatt.
              </li>
            </ol>
          </li>

          <li>
            <strong>AZ ADÁSVÉTELI SZERZŐDÉS MEGKÖTÉSE</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Az online áruház felületén elhelyezett áruk teljes bemutatása tájékoztató jellegű, és az eladó nem köteles adásvételi szerződést kötni ezen árukra vonatkozóan.
              </li>
              <li>
                Az online áruház felülete információkat tartalmaz az árukról, beleértve az egyes áruk árának feltüntetését és az áru visszaküldésének költségeit, ha az áru természeténél fogva nem küldhető vissza szokásos postai úton. Az áruk árai tartalmazzák az általános forgalmi adót (ÁFA) és minden kapcsolódó díjat. Az áruk árai addig érvényesek, amíg az online áruház felületén megjelennek. Ez a rendelkezés nem korlátozza az eladó lehetőségét arra, hogy egyedileg egyeztetett feltételekkel kössön adásvételi szerződést.
              </li>
              <li>
                Az online áruház felülete az áruk csomagolásával és szállításával kapcsolatos költségekről, valamint az áruk szállítási módjáról és idejéről is tartalmaz információkat. Az áruk csomagolásával és szállításával kapcsolatos költségekre vonatkozó információk csak akkor érvényesek, ha az árut Magyarország területén szállítják.
              </li>
              <li>
                Az áru megrendeléséhez a vevő kitölti a megrendelési űrlapot az online áruház felületén. A megrendelési űrlap különösen a következő információkat tartalmazza:
                <ul className="list-disc ml-6 mt-2">
                  <li>a megrendelt áruról szóló információk (a megrendelt árut a vevő az online áruház felületének elektronikus kosarába „helyezi"),</li>
                  <li>az áru vételárának fizetési módjáról, a megrendelt áru szükséges szállítási módjáról szóló adatok, valamint</li>
                  <li>az áru szállításával kapcsolatos költségekről szóló információk (a továbbiakban együtt: „<strong>megrendelés</strong>").</li>
                </ul>
              </li>
              <li>
                A megrendelés eladónak történő elküldése előtt a vevő ellenőrizheti és módosíthatja a megrendelésbe beírt adatokat, beleértve a megrendelésbe való adatbevitel során keletkezett hibák észlelésének és javításának lehetőségét is. A vevő a „Megrendelés fizetési kötelezettséggel" gombra kattintva küldi el a megrendelést az eladónak. A megrendelésben megadott adatokat az eladó helyesnek tekinti. Az eladó a megrendelés beérkezése után haladéktalanul visszaigazolja annak átvételét a vevőnek elektronikus levélben a vevő felhasználói fiókjában vagy a megrendelésben megadott e-mail címre (a továbbiakban: „<strong>vevő elektronikus címe</strong>").
              </li>
              <li>
                Az eladó mindig jogosult a megrendelés jellegétől függően (áru mennyisége, vételár összege, várható szállítási költségek) további megerősítést kérni a vevőtől a megrendelésről (például írásban vagy telefonon).
              </li>
              <li>
                Az eladó és a vevő közötti szerződéses viszony a megrendelés elfogadásának (visszaigazolásának) kézbesítésével jön létre, amelyet az eladó elektronikus levélben küld a vevő elektronikus címére.
              </li>
              <li>
                A vevő hozzájárul a távközlési eszközök használatához az adásvételi szerződés megkötése során. A vevő által az adásvételi szerződés megkötésével kapcsolatban a távközlési eszközök használata során felmerült költségeket (internetkapcsolat költségei, telefonhívások költségei) maga a vevő viseli, azzal, hogy ezek a költségek nem térnek el az alapdíjtól.
              </li>
            </ol>
          </li>

          <li>
            <strong>AZ ÁRU ÁRA ÉS FIZETÉSI FELTÉTELEK</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Az áru árát és az adásvételi szerződés szerinti áru szállításával kapcsolatos esetleges költségeket a vevő az alábbi módon fizetheti meg az eladónak:
                <ul className="list-disc ml-6 mt-2">
                  <li>készpénzben átvételkor a vevő által a megrendelésben meghatározott helyen;</li>
                  <li>átutalással az eladó számlájára IBAN: HU86126000161042694795638648, BIC/SWIFT: TRWIBEBBXXX, WISE EUROPE S.A., Rue du Trône 100, 1050 Brussels vezetett számlára (a továbbiakban: „<strong>eladó számlája</strong>");</li>
                  <li>készpénz nélkül fizetési rendszeren keresztül;</li>
                  <li>készpénz nélkül bankkártyával;</li>
                  <li>készpénzben vagy bankkártyával személyes átvételkor az átvételi ponton;</li>
                  <li>harmadik fél által nyújtott hitelen keresztül.</li>
                </ul>
              </li>
              <li>
                Utánvétes fizetés választása esetén (számlára történő fizetés) az ügyfél köteles a számlán feltüntetett összeget a fizetési határidőn belül megfizetni, amely általában a számla kiállításától számított <strong>14 nap</strong>, kivéve, ha másképp állapodtak meg. E határidő be nem tartása esetén az eladónak joga van törvényes késedelmi kamatra, valamint a fizetendő összeg 10%-ának megfelelő kötbérre.
              </li>
              <li>
                Az ügyfél továbbá köteles fedezni a fizetendő összeg behajtásával kapcsolatos minden költséget, beleértve a jogi díjakat és a behajtási szolgáltatások díjait. Az eladó fenntartja a jogot, hogy felfüggessze a további áruszállításokat vagy szolgáltatásokat a fizetendő összeg kamatokkal és kötbérrel együtt történő teljes kifizetéséig.
              </li>
              <li>
                A vételárral együtt a vevő köteles az eladónak megfizetni az áru csomagolásával és szállításával kapcsolatos költségeket is a megállapodott összegben. Hacsak kifejezetten másként nem jelezzük, a vételár magában foglalja az áru szállításával kapcsolatos költségeket is.
              </li>
              <li>
                Az eladó nem követel meg a vevőtől előleget vagy más hasonló fizetést. Ez nem érinti a szabályzat 4.6. cikkének rendelkezéseit az áru vételárának előre történő megfizetésének kötelezettségéről.
              </li>
              <li>
                Készpénzes fizetés, utánvét vagy átvételi ponton történő fizetés esetén a vételár az áru átvételekor fizetendő. Készpénz nélküli fizetés esetén a vételár az adásvételi szerződés megkötésétől számított 14 napon belül fizetendő.
              </li>
              <li>
                Készpénz nélküli fizetés esetén a vevő köteles az áru vételárát a változó fizetési szimbólum megadásával együtt megfizetni. Készpénz nélküli fizetés esetén a vevő vételár fizetési kötelezettsége a megfelelő összeg eladó számláján történő jóváírásakor teljesül.
              </li>
              <li>
                Az eladó jogosult, különösen a vevő által a megrendelés további megerősítésének hiánya esetén (3.6. cikk), a teljes vételár megfizetését kérni az áru vevőnek történő elküldése előtt.
              </li>
              <li>
                Az eladó által a vevőnek nyújtott esetleges árengedmények nem kombinálhatók.
              </li>
              <li>
                Ha ez a kereskedelmi forgalomban szokásos, vagy ha az általánosan kötelező érvényű jogszabályok így rendelkeznek, az eladó adóügyi dokumentumot - számlát állít ki a vevőnek az adásvételi szerződés alapján teljesített kifizetésekről. Az eladó ÁFA-fizető. Az adóügyi dokumentumot - számlát az eladó az áru árának kifizetése után állítja ki a vevőnek, és elektronikus formában küldi el a vevő elektronikus címére.
              </li>
            </ol>
          </li>

          <li>
            <strong>ELÁLLÁS AZ ADÁSVÉTELI SZERZŐDÉSTŐL</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                A vevő tudomásul veszi, hogy a jogszabályok szerint többek között nem lehet elállni az adásvételi szerződéstől:
                <ul className="list-disc ml-6 mt-2">
                  <li>a vevő követelményei szerint gyártott vagy személyes igényeihez igazított áru szállításáról,</li>
                  <li>gyorsan romlandó áru vagy rövid eltarthatósági idejű áru szállításáról, valamint olyan áru szállításáról, amely a szállítás után természeténél fogva visszafordíthatatlanul keveredett más áruval,</li>
                  <li>lezárt csomagolásban szállított áru szállításáról, amely egészségvédelmi vagy higiéniai okokból a plomba eltávolítása után nem küldhető vissza,</li>
                  <li>lezárt csomagolásban lévő hang- vagy képfelvételek vagy számítógépes programok szállításáról, ha a vevő eltávolította a plombát.</li>
                </ul>
              </li>
              <li>
                Ha nem a szabályzat 5.1. cikkében említett esetről vagy más olyan esetről van szó, amikor nem lehet elállni az adásvételi szerződéstől, a vevőnek joga van elállni az adásvételi szerződéstől attól a naptól számított tizennégy (14) napon belül, amikor a vevő vagy az általa megjelölt, a fuvarozótól eltérő harmadik személy átveszi az árut.
              </li>
              <li>
                Az adásvételi szerződéstől való elállást a szabályzat 5.2. cikkében meghatározott határidőn belül kell elküldeni az eladónak. Az adásvételi szerződéstől való elálláshoz a vevő használhatja az eladó által biztosított űrlapmintát. Az adásvételi szerződéstől való elállást a vevő többek között az eladó székhelyének címére vagy az eladó support@jovotech.hu e-mail címére küldheti.
              </li>
              <li>
                Az adásvételi szerződéstől való elállás esetén az adásvételi szerződés kezdettől fogva megszűnik. Az árut a vevő indokolatlan késedelem nélkül, legkésőbb az elállástól számított tizennégy (14) napon belül visszaküldi vagy átadja az eladónak, kivéve, ha az eladó felajánlotta, hogy maga veszi át az árut. Az előző mondat szerinti határidő betartottnak minősül, ha a vevő a lejárata előtt elküldi az árut. Ha a vevő eláll az adásvételi szerződéstől, viseli az áru eladónak történő visszaküldésével kapcsolatos költségeket, akkor is, ha az áru természeténél fogva nem küldhető vissza szokásos postai úton.
              </li>
              <li>
                A szabályzat 5.2. cikke szerinti adásvételi szerződéstől való elállás esetén az eladó a vevőtől kapott pénzeszközöket a vevő által az adásvételi szerződéstől való elállástól számított tizennégy (14) napon belül ugyanolyan módon visszatéríti, ahogyan az eladó azokat a vevőtől megkapta. Az eladó jogosult a vevő által nyújtott teljesítményt már az áru vevő általi visszaküldésekor vagy más módon visszatéríteni, ha a vevő ehhez hozzájárul és ez nem jár a vevő számára további költségekkel. Ha a vevő eláll az adásvételi szerződéstől, az eladó nem köteles visszatéríteni a kapott pénzeszközöket a vevőnek korábban, mint amikor az eladó megkapja az árut, vagy amikor a vevő bizonyítja, hogy visszaküldte az árut, attól függően, hogy melyik történik korábban.
              </li>
              <li>
                Az árun keletkezett kár megtérítésére vonatkozó igényt az eladó jogosult egyoldalúan beszámítani a vevő vételár visszatérítésére vonatkozó igényével szemben.
              </li>
              <li>
                Azokban az esetekben, amikor a vevőnek joga van elállni az adásvételi szerződéstől, az eladó is jogosult bármikor elállni az adásvételi szerződéstől, egészen addig, amíg a vevő át nem veszi az árut. Ebben az esetben az eladó indokolatlan késedelem nélkül visszatéríti a vevőnek a vételárat, átutalással a vevő által megadott számlára.
              </li>
              <li>
                Ha a vevő az áruval együtt ajándékot kapott, az eladó és a vevő közötti ajándékozási szerződés bontó feltétellel jön létre, hogy amennyiben a vevő eláll az adásvételi szerződéstől, az ilyen ajándékra vonatkozó ajándékozási szerződés érvényét veszti, és a vevő köteles az áruval együtt a kapott ajándékot is visszaküldeni az eladónak.
              </li>
            </ol>
          </li>

          <li>
            <strong>SZÁLLÍTÁS ÉS AZ ÁRU KÉZBESÍTÉSE</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Abban az esetben, ha a szállítási módot a vevő külön kérése alapján állapították meg, a vevő viseli a kockázatot és az ezzel a szállítási móddal kapcsolatos esetleges többletköltségeket.
              </li>
              <li>
                Ha az eladó az adásvételi szerződés szerint köteles az árut a vevő által a megrendelésben meghatározott helyre szállítani, a vevő köteles az árut kézbesítéskor átvenni.
              </li>
              <li>
                Abban az esetben, ha a vevő miatt szükséges az árut többször vagy a megrendelésben meghatározottól eltérő módon kézbesíteni, a vevő köteles fedezni a többszöri kézbesítéssel vagy a más szállítási móddal kapcsolatos költségeket.
              </li>
              <li>
                Az áru fuvarozótól történő átvételekor a vevő köteles ellenőrizni az áru csomagolásának sértetlenségét, és bármilyen hiba esetén haladéktalanul értesíteni a fuvarozót. A csomagolás megsértésének megállapítása esetén, amely a csomagba való jogosulatlan behatolásra utal, a vevő nem köteles átvenni a csomagot a fuvarozótól. Ez nem érinti a vevő áruhiba miatti felelősségből eredő jogait és a vevő egyéb, az általánosan kötelező érvényű jogszabályokból eredő jogait.
              </li>
              <li>
                A felek további jogait és kötelezettségeit az áru szállítása során az eladó külön szállítási feltételei szabályozhatják, amennyiben azokat az eladó kiadta.
              </li>
            </ol>
          </li>

          <li>
            <strong>HIBÁS TELJESÍTÉSBŐL EREDŐ JOGOK</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                A szerződő felek hibás teljesítésből eredő jogokkal kapcsolatos jogait és kötelezettségeit a vonatkozó általánosan kötelező érvényű jogszabályok szabályozzák (különösen a Polgári Törvénykönyv és a fogyasztói jogokról szóló törvény rendelkezései).
              </li>
              <li>
                Az eladó felel a vevő felé azért, hogy a dolognak az átvételkor nincs hibája. Különösen az eladó felel a vevő felé azért, hogy a dolog:
                <ul className="list-disc ml-6 mt-2">
                  <li>megfelel a megállapodott leírásnak, típusnak és mennyiségnek, valamint minőségnek, funkcionalitásnak, kompatibilitásnak, interoperabilitásnak és egyéb megállapodott tulajdonságoknak,</li>
                  <li>alkalmas arra a célra, amelyre a vevő igényli, és amellyel az eladó egyetértett,</li>
                  <li>a megállapodott tartozékokkal és használati utasításokkal kerül szállításra, beleértve a szerelési vagy telepítési útmutatót is.</li>
                </ul>
              </li>
              <li>
                Az eladó a vevő felé azért is felel, hogy a megállapodott tulajdonságokon túl:
                <ul className="list-disc ml-6 mt-2">
                  <li>a dolog alkalmas arra a célra, amelyre az ilyen típusú dolgot általában használják, figyelembe véve harmadik személyek jogait, jogszabályokat, műszaki szabványokat vagy az adott ágazat magatartási kódexeit, ha nincsenek műszaki szabványok,</li>
                  <li>a dolog mennyiségben, minőségben és egyéb tulajdonságokban, beleértve a tartósságot, funkcionalitást, kompatibilitást és biztonságot, megfelel az azonos típusú dolgok szokásos tulajdonságainak, amelyeket a vevő ésszerűen elvárhat, figyelembe véve az eladó vagy más személy által ugyanabban a szerződési láncban tett nyilvános nyilatkozatokat, különösen a reklámot vagy jelölést,</li>
                  <li>a dolog olyan tartozékokkal kerül szállításra, beleértve a csomagolást, szerelési útmutatót és egyéb használati utasításokat, amelyeket a vevő ésszerűen elvárhat,</li>
                  <li>a dolog minőségben vagy kivitelben megfelel annak a mintának vagy modellnek, amelyet az eladó az adásvételi szerződés megkötése előtt a vevő rendelkezésére bocsátott.</li>
                </ul>
              </li>
              <li>
                Ha a hiba az átvételtől számított két éven belül jelentkezik, úgy tekintendő, hogy a dolog már az átvételkor hibás volt.
              </li>
              <li>
                A vevő bejelentheti a dolgon az átvételtől számított két éven belül megjelenő hibát.
              </li>
              <li>
                Ha a dolognak hibája van, a vevő kérheti annak eltávolítását. Választása szerint kérheti új, hibátlan dolog szállítását vagy a dolog javítását, kivéve, ha a választott hibaelhárítási mód lehetetlen vagy a másikhoz képest aránytalanul költséges. Az eladó megtagadhatja a hiba eltávolítását, ha az lehetetlen vagy aránytalanul költséges, különösen figyelembe véve a hiba jelentőségét és azt az értéket, amellyel a dolog hiba nélkül rendelkezne.
              </li>
              <li>
                Az eladó a hibát a bejelentés után ésszerű időn belül eltávolítja úgy, hogy ne okozzon jelentős nehézséget a vevőnek, figyelembe véve a dolog jellegét és azt a célt, amelyre a vevő a dolgot megvásárolta. A hiba eltávolítása érdekében az eladó saját költségén átveszi a dolgot.
              </li>
              <li>
                A vevő megfelelő árengedményt kérhet vagy elállhat az adásvételi szerződéstől, ha:
                <ul className="list-disc ml-6 mt-2">
                  <li>az eladó megtagadta a hiba eltávolítását vagy nem távolította el,</li>
                  <li>a hiba újra jelentkezik,</li>
                  <li>a hiba az adásvételi szerződés lényeges megszegését jelenti,</li>
                  <li>az eladó nyilatkozatából vagy a körülményekből kitűnik, hogy a hiba nem kerül eltávolításra ésszerű időn belül vagy jelentős nehézség nélkül a vevő számára.</li>
                </ul>
              </li>
              <li>
                Ha a dolog hibája jelentéktelen, a vevő nem állhat el az adásvételi szerződéstől. Ha a vevő eláll az adásvételi szerződéstől, az eladó indokolatlan késedelem nélkül visszatéríti a vevőnek a vételárat a dolog átvétele után, vagy miután a vevő bizonyítja, hogy visszaküldte a dolgot.
              </li>
              <li>
                A hibát be lehet jelenteni az eladónál, akinél a dolgot megvásárolták.
              </li>
              <li>
                A reklamációt a hiba eltávolításával együtt legkésőbb a reklamáció benyújtásától számított harminc (30) napon belül el kell intézni, és a vevőt erről tájékoztatni kell, kivéve, ha az eladó és a vevő hosszabb határidőben állapodik meg.
              </li>
              <li>
                Az áru hibáiért való felelősségből eredő jogokat a vevő különösen a support@jovotech.hu e-mail címen jelentheti be.
              </li>
              <li>
                Az eladó hibákért való felelősségével kapcsolatos felek további jogait és kötelezettségeit az eladó reklamációs szabályzata szabályozhatja.
              </li>
            </ol>
          </li>

          <li>
            <strong>A SZERZŐDŐ FELEK EGYÉB JOGAI ÉS KÖTELEZETTSÉGEI</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                A vevő az áru teljes vételárának megfizetésével szerzi meg az áru tulajdonjogát.
              </li>
              <li>
                Az eladó nem köti semmilyen magatartási kódex a vevővel szemben.
              </li>
              <li>
                A fogyasztói panaszok kezelését az eladó elektronikus levélben biztosítja. A panaszokat az eladó elektronikus címére lehet küldeni. Az eladó a vevő panaszának elintézéséről szóló információt a vevő elektronikus címére küldi.
              </li>
              <li>
                Az adásvételi szerződésből eredő fogyasztói viták peren kívüli rendezésére a Nemzeti Fogyasztóvédelmi Hatóság illetékes. A http://ec.europa.eu/consumers/odr internetes címen található online vitarendezési platform használható az eladó és a vevő közötti adásvételi szerződésből eredő viták rendezésére.
              </li>
              <li>
                A Európai Fogyasztói Központ Magyarország a 2013. május 21-i 524/2013/EU európai parlamenti és tanácsi rendelet szerinti kapcsolattartó pont a fogyasztói jogviták online rendezéséről, valamint a 2006/2004/EK rendelet és a 2009/22/EK irányelv módosításáról.
              </li>
              <li>
                A vevő panasszal fordulhat az állami felügyeleti vagy ellenőrző szervhez. Az eladó üzleti tevékenység engedély alapján jogosult áruk értékesítésére. Az üzleti tevékenység ellenőrzését hatáskörében az illetékes hatóság végzi. A személyes adatok védelmének területén a felügyeletet a Nemzeti Adatvédelmi és Információszabadság Hatóság gyakorolja. A Nemzeti Fogyasztóvédelmi Hatóság meghatározott mértékben többek között felügyeli a fogyasztóvédelmi előírások betartását.
              </li>
              <li>
                A vevő ezennel magára vállalja a körülmények megváltozásának kockázatát.
              </li>
            </ol>
          </li>

          <li>
            <strong>SZEMÉLYES ADATOK VÉDELME</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Az eladó a vevővel szembeni tájékoztatási kötelezettségét az Európai Parlament és a Tanács 2016/679 rendelete 13. cikke értelmében a természetes személyeknek a személyes adatok kezelése tekintetében történő védelméről és az ilyen adatok szabad áramlásáról, valamint a 95/46/EK irányelv hatályon kívül helyezéséről (általános adatvédelmi rendelet) (a továbbiakban: „<strong>GDPR</strong>") a vevő személyes adatainak az adásvételi szerződés teljesítése, az adásvételi szerződéssel kapcsolatos tárgyalások, valamint az eladó közjogi kötelezettségeinek teljesítése céljából történő kezelésével kapcsolatban külön dokumentumban teljesíti.
              </li>
            </ol>
          </li>

          <li>
            <strong>KERESKEDELMI KÖZLEMÉNYEK KÜLDÉSE ÉS COOKIE-K TÁROLÁSA</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                A vevő hozzájárul ahhoz, hogy az eladó kereskedelmi közleményeket küldjön a vevő elektronikus címére vagy telefonszámára. Az eladó a vevővel szembeni tájékoztatási kötelezettségét a GDPR 13. cikke értelmében a vevő személyes adatainak kereskedelmi közlemények küldése céljából történő kezelésével kapcsolatban külön dokumentumban teljesíti.
              </li>
              <li>
                Az eladó a vevő eszközén történő esetleges cookie-k tárolásával kapcsolatos törvényi kötelezettségeit külön dokumentumban teljesíti.
              </li>
            </ol>
          </li>

          <li>
            <strong>KÉZBESÍTÉS</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                A vevőnek a vevő elektronikus címére lehet kézbesíteni.
              </li>
            </ol>
          </li>

          <li>
            <strong>ZÁRÓ RENDELKEZÉSEK</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Ha az adásvételi szerződés által létrehozott jogviszony nemzetközi (külföldi) elemet tartalmaz, a felek megállapodnak, hogy ezt a jogviszonyt a magyar jog szabályozza. Az előző mondat szerinti jogválasztással a fogyasztó vevő nem fosztható meg attól a védelemtől, amelyet számára olyan jogszabályi rendelkezések biztosítanak, amelyektől szerződéssel nem lehet eltérni.
              </li>
              <li>
                Ha a szabályzat bármely rendelkezése érvénytelen vagy hatálytalan, vagy azzá válik, az érvénytelen rendelkezések helyébe olyan rendelkezés lép, amelynek értelme a lehető legközelebb áll az érvénytelen rendelkezéshez. Egy rendelkezés érvénytelensége vagy hatálytalansága nem érinti a többi rendelkezés érvényességét.
              </li>
              <li>
                Az adásvételi szerződést a szabályzattal együtt az eladó elektronikus formában archiválja, és nem hozzáférhető.
              </li>
              <li>
                A szabályzat mellékletét képezi az adásvételi szerződéstől való elállási űrlap mintája.
              </li>
              <li>
                Az eladó elérhetőségei: székhely címe 1. máje 535/50, 46007 Liberec III-Jeřáb, Csehország (székhely - levelezést kérjük e-mailben), e-mail cím support@jovotech.hu. Az eladó nem biztosít más online kommunikációs eszközt.
              </li>
            </ol>
          </li>
        </ol>

        <p className="text-center mt-8">
          Liberecben, {new Date().toLocaleDateString('hu-HU')}
        </p>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Banki adatok</h2>
          <p><strong>Számlaszám:</strong> 12600016-10426947-95638648</p>
          <p><strong>IBAN:</strong> HU86126000161042694795638648</p>
          <p><strong>BIC/SWIFT:</strong> TRWIBEBBXXX</p>
          <p><strong>Bank:</strong> WISE EUROPE S.A.</p>
          <p><strong>Bank címe:</strong> Rue du Trône 100, 1050 Brussels</p>
        </div>
      </div>
    </div>
  )
}