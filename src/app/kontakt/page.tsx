import { Metadata } from 'next'
import { Mail, MapPin, Building2, FileText, CreditCard, Facebook, Instagram, Twitter, Youtube, Clock, Shield, Truck, HelpCircle, Users, Award, Lock, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kapcsolat - Jovotech',
  description: 'Lépjen kapcsolatba a Jovotech csapatával - cím, email, céginformációk, ügyfélszolgálat',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Vissza a főoldalra</span>
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Kapcsolat</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information Box */}
        <div className="bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Kapcsolati információk</h2>
          
          {/* Email */}
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <a href="mailto:support@jovotech.hu" className="text-blue-600 hover:underline">
                support@jovotech.hu
              </a>
              <p className="text-sm text-gray-600 mt-1">24 órán belül válaszolunk</p>
            </div>
          </div>
          
          {/* Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Cég címe</h3>
              <p className="text-gray-600">1. máje 535/50</p>
              <p className="text-gray-600">460 07 Liberec III-Jeřáb</p>
              <p className="text-gray-600">Csehország</p>
              <p className="text-sm text-gray-500 mt-2 italic">
                (Székhelyünk - levelezést kérjük az email címre küldeni)
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Ügyfélszolgálat nyitvatartása</h3>
              <p className="text-gray-600">Hétfő - Péntek: 8:00 - 18:00</p>
              <p className="text-gray-600">Szombat: 9:00 - 14:00</p>
              <p className="text-gray-600">Vasárnap: Zárva</p>
              <p className="text-sm text-gray-500 mt-1">*Közép-európai idő (CET)</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 mt-1" /> {/* Spacer for alignment */}
            <div>
              <h3 className="font-semibold mb-3">Kövessen minket a közösségi médiában</h3>
              <div className="flex space-x-4">
                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors" title="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="/" className="text-gray-600 hover:text-pink-600 transition-colors" title="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="/" className="text-gray-600 hover:text-blue-400 transition-colors" title="Twitter">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="/" className="text-gray-600 hover:text-red-600 transition-colors" title="YouTube">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-2">Kövessen minket a legújabb akciókért!</p>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Céginformációk</h2>
          
          {/* Company Details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold">Jogi információk</h3>
                <p className="text-gray-600"><strong>Név:</strong> Jovotech</p>
                <p className="text-gray-600"><strong>Adószám:</strong> 04688465</p>
                <p className="text-gray-600"><strong>Jogi forma:</strong> Vállalkozás</p>
                <p className="text-gray-600 mt-2 text-sm">A magyar és EU jogszabályok szerint működünk</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold">Banki adatok</h3>
                <p className="text-gray-600"><strong>Számlaszám:</strong> 12600016-10426947-95638648</p>
                <p className="text-gray-600"><strong>IBAN:</strong> HU86126000161042694795638648</p>
                <p className="text-gray-600"><strong>BIC/SWIFT:</strong> TRWIBEBBXXX</p>
                <p className="text-gray-600"><strong>Bank:</strong> WISE EUROPE S.A.</p>
                <p className="text-gray-600"><strong>Bank címe:</strong> Rue du Trône 100, 1050 Brussels</p>
                <p className="text-gray-600"><strong>Pénznem:</strong> HUF, EUR</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold">Dokumentumok és szabályzatok</h3>
                <ul className="space-y-1 mt-2">
                  <li>
                    <a href="/aszf" className="text-blue-600 hover:underline text-sm">
                      Általános szerződési feltételek
                    </a>
                  </li>
                  <li>
                    <a href="/adatvedelem" className="text-blue-600 hover:underline text-sm">
                      Adatvédelmi tájékoztató
                    </a>
                  </li>
                  <li>
                    <a href="/visszaru-es-garancia" className="text-blue-600 hover:underline text-sm">
                      Visszaküldés és garancia
                    </a>
                  </li>
                  <li>
                    <a href="/szallitas-es-fizetes" className="text-blue-600 hover:underline text-sm">
                      Szállítás és fizetés
                    </a>
                  </li>
                  <li>
                    <a href="/rolunk" className="text-blue-600 hover:underline text-sm">
                      Rólunk
                    </a>
                  </li>
                  <li>
                    <a href="/vasarloi-velemenyek" className="text-blue-600 hover:underline text-sm">
                      Vásárlói vélemények
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Service Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Ügyfélszolgálat</h2>
          <p className="text-gray-600 mt-2">Azért vagyunk itt, hogy segítsünk!</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <Phone className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email kapcsolat</h3>
            <p className="text-sm text-gray-600">
              Az email kapcsolatot részesítjük előnyben a gyorsabb és hatékonyabb kiszolgálás érdekében. 
              Minden megkeresés regisztrálva és számozva van.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <Clock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Válaszidő</h3>
            <p className="text-sm text-gray-600">
              Általános válaszidő: 24 óra<br/>
              Reklamációk: 48 órán belül<br/>
              Hétvégék: 72 órán belül
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <Award className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Kiszolgálás minősége</h3>
            <p className="text-sm text-gray-600">
              Csapatunk rendszeres képzéseken vesz részt. 
              Vásárlóink 98%-a kiválónak értékeli szolgáltatásunkat!
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {/* Customer Service */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Vásárlás előtt</h3>
          <p className="text-gray-600 text-sm">
            Kérdése van a termékekkel kapcsolatban? Tanácsra van szüksége? 
            Írjon nekünk, és szakértőink szívesen segítenek a megfelelő termék kiválasztásában.
          </p>
        </div>

        {/* Complaints */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Reklamáció és visszaküldés</h3>
          <p className="text-gray-600 text-sm">
            A reklamációs folyamat egyszerű és átlátható. 
            14 napos elállási jog indoklás nélkül. 
            2 év garancia minden termékre.
          </p>
        </div>

        {/* Legal Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Vásárlás után</h3>
          <p className="text-gray-600 text-sm">
            Minden megrendelést nyomon követünk. Értesítéseket kap a csomag státuszáról. 
            Szállítási problémák esetén azonnal lépjen kapcsolatba velünk.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
          <HelpCircle className="w-8 h-8 mr-2 text-blue-600" />
          Gyakran ismételt kérdések
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Hogyan követhetem nyomon megrendelésemet?</h4>
            <p className="text-gray-600 text-sm">
              A megrendelés elküldése után emailt kap a csomag nyomkövetési számával. 
              A státuszt a "Megrendeléseim" menüpontban is ellenőrizheti bejelentkezés után.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Módosíthatom vagy törölhetem a megrendelésemet?</h4>
            <p className="text-gray-600 text-sm">
              Igen, módosíthatja vagy törölheti megrendelését a feladásig. 
              Lépjen kapcsolatba velünk mielőbb a support@jovotech.hu címen.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Mik a szállítási költségek?</h4>
            <p className="text-gray-600 text-sm">
              A szállítási költség a megrendelés értékétől és a választott futárszolgálattól függ. 
              Ingyenes szállítás 20.000 Ft feletti megrendelésnél.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Adnak számlát?</h4>
            <p className="text-gray-600 text-sm">
              Igen, számlát állítunk ki. A megrendeléskor jelölje be a megfelelő opciót 
              és töltse ki a cégadatokat.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Partners */}
      <div className="mt-12 bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
          <Truck className="w-8 h-8 mr-2 text-green-600" />
          Logisztikai partnereink
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <h4 className="font-semibold mb-2">Foxpost</h4>
            <p className="text-sm text-gray-600">Csomagautomaták 24/7<br/>Kézbesítés 1-2 nap</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">GLS</h4>
            <p className="text-sm text-gray-600">Futárszolgálat<br/>Valós idejű nyomkövetés</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Magyar Posta</h4>
            <p className="text-sm text-gray-600">Hagyományos kézbesítés<br/>Legszélesebb lefedettség</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">DPD</h4>
            <p className="text-sm text-gray-600">Expressz kézbesítés<br/>Nemzetközi szállítmányok</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Elhelyezkedésünk</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.834721087594!2d15.036897!3d50.768889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470937305f5f5f5f%3A0x0!2s1.%20m%C3%A1je%20535%2F50%2C%20460%2007%20Liberec%2C%20Czechy!5e0!3m2!1shu!2shu!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          ></iframe>
        </div>
      </div>

      {/* Security and Trust */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
          <Shield className="w-8 h-8 mr-2 text-green-600" />
          Biztonság és bizalom
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Lock className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Biztonságos fizetés</h4>
            <p className="text-sm text-gray-600">
              SSL titkosítás, biztonsági tanúsítványok, 
              csak megbízható fizetési szolgáltatókkal dolgozunk.
            </p>
          </div>
          <div className="text-center">
            <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Adatvédelem</h4>
            <p className="text-sm text-gray-600">
              GDPR megfelelőség, személyes adatok jogszerű kezelése, 
              adatok törlése kérésre.
            </p>
          </div>
          <div className="text-center">
            <Award className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Minőségi garancia</h4>
            <p className="text-sm text-gray-600">
              Csak eredeti termékek, hivatalos forgalmazókkal való együttműködés, 
              teljes gyártói garancia.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Elfogadott fizetési módok</h2>
        <div className="bg-white rounded-lg p-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">SimplePay</h4>
              <p className="text-sm text-gray-600 mt-1">Gyors online fizetés</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">Bankkártya</h4>
              <p className="text-sm text-gray-600 mt-1">Visa, Mastercard</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">PayPal</h4>
              <p className="text-sm text-gray-600 mt-1">Nemzetközi fizetés</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">Banki átutalás</h4>
              <p className="text-sm text-gray-600 mt-1">Hagyományos utalás</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Legal Information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Fontos jogi információk</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Felügyeleti szerv:</strong> Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH) - 
            <a href="https://naih.hu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              naih.hu
            </a>
          </p>
          <p>
            <strong>Fogyasztóvédelem:</strong> Nemzeti Fogyasztóvédelmi Hatóság - 
            <a href="https://fogyasztovedelem.kormany.hu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              fogyasztovedelem.kormany.hu
            </a>
          </p>
          <p>
            <strong>Békéltető testület:</strong> Budapesti Békéltető Testület - 
            <a href="https://bekeltet.bkik.hu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              bekeltet.bkik.hu
            </a>
          </p>
          <p>
            <strong>ODR platform:</strong> Online vitarendezés - 
            <a href="http://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              ec.europa.eu/consumers/odr
            </a>
          </p>
          <p className="mt-4 font-semibold">
            A Jovotech betartja a tisztességes kereskedelem szabályait és a fogyasztóvédelmi előírásokat.
          </p>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Maradjon naprakész!</h3>
        <p className="text-gray-600 mb-6">
          Iratkozzon fel hírlevelünkre és kapjon értesítést újdonságainkról, 
          akcióinkról és csak előfizetőknek szóló különleges ajánlatainkról.
        </p>
        <p className="text-sm text-gray-500">
          Küldjön emailt a <a href="mailto:support@jovotech.hu" className="text-blue-600 hover:underline">support@jovotech.hu</a> címre "Hírlevél" tárggyal a feliratkozáshoz.
        </p>
      </div>
    </div>
  )
}