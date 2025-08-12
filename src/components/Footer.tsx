// src/components/Footer.tsx
import Link from 'next/link';
import { MapPin, Check, Mail, Clock, Truck, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-gray-300" style={{ backgroundColor: '#222f3e' }}>
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Column 1 - Információk */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Információk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/aszf" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Általános Szerződési Feltételek
                </Link>
              </li>
              <li>
                <Link href="/adatvedelmi-szabalyzat" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Adatvédelmi irányelvek
                </Link>
              </li>
              <li>
                <Link href="/bolt-ertekeles" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Üzlet értékelése
                </Link>
              </li>
              <li>
                <Link href="/aszf" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Letölthető űrlapok
                </Link>
              </li>
              <li>
                <Link href="/iskolak-es-kozintezmenyek" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Iskolák és közintézmények
                </Link>
              </li>
              <li>
                <Link href="/legalacsonyabb-ar-garancia" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Legalacsonyabb ár garancia
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Ügyfélszolgálat */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Ügyfélszolgálat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/szallitas-es-fizetes" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Szállítás és fizetés
                </Link>
              </li>
              <li>
                <Link href="/visszaru-es-reklamacio" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Visszaküldés és reklamáció
                </Link>
              </li>
              <li>
                <Link href="/szallitasi-informaciok" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Szállítási információk
                </Link>
              </li>
              <li>
                <Link href="/order-status" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Rendelés követése
                </Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Írjon nekünk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Rólunk */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Rólunk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legalacsonyabb-ar-garancia" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Legalacsonyabb ár garancia
                </Link>
              </li>
              <li>
                <Link href="/cegeknek" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Cégeknek +
                </Link>
              </li>
              <li>
                <Link href="/rolunk" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  A cégről
                </Link>
              </li>
              <li>
                <Link href="/kapcsolat" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Kapcsolat
                </Link>
              </li>
              <li>
                <Link href="/bolt-ertekeles" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Vásárlói vélemények
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Látogasson el */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Látogasson el</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/irodaszerek" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Irodaszerek
                </Link>
              </li>
              <li>
                <Link href="/category/haziallatok" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Háziállatok
                </Link>
              </li>
              <li>
                <Link href="/category/elektromos-szerszamok" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Elektrotechnika
                </Link>
              </li>
              <li>
                <Link href="/category/kert-es-gyep" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Kert és gyep
                </Link>
              </li>
              <li>
                <Link href="/category/barkacsbolt" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Szerszámáruház
                </Link>
              </li>
              <li>
                <Link href="/category/hegesztes" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Hegesztés
                </Link>
              </li>
              <li>
                <Link href="/category/biztonsag" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Biztonság
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Kapcsolati adatok */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Kapcsolati adatok</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                <span style={{ fontSize: '14px' }}>
                  Jovotech.hu<br />
                  1. máje 535/50<br />
                  46007 Liberec
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span className="font-medium" style={{ fontSize: '14px' }}>Legalacsonyabb ár garancia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:support@jovotech.hu" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  support@jovotech.hu
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-blue-400 mt-0.5" />
                <span style={{ fontSize: '14px' }}>
                  H-P: 8:00 - 18:00<br />
                  Szo-V: 9:00 - 15:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Iratkozzon fel hírlevelünkre</h3>
            <p className="text-sm mb-4">Értesüljön elsőként az újdonságokról és akciókról</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Az Ön e-mail címe"
                className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                style={{ backgroundColor: '#131a22' }}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Feliratkozás
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Delivery Options */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Media Links */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="hover:text-white transition"
                aria-label="Látogasson el Facebook oldalunkra"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="hover:text-white transition"
                aria-label="Látogasson el Instagram oldalunkra"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
            </div>

            {/* Delivery & Payment Options */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Delivery Options */}
              <div className="flex items-center gap-3">
                <span className="text-sm flex items-center gap-1">
                  <Truck size={16} />
                  Szállítás:
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>GLS</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>DPD</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>MPL</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>FoxPost</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>UPS</div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="hidden md:block h-6 w-px bg-gray-700"></div>
              
              {/* Payment Options */}
              <div className="flex items-center gap-3">
                <span className="text-sm flex items-center gap-1">
                  <CreditCard size={16} />
                  Fizetés:
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white rounded px-3 py-1 text-gray-900 text-xs font-semibold">VISA</div>
                  <div className="bg-white rounded px-3 py-1 text-gray-900 text-xs font-semibold">Mastercard</div>
                  <div className="bg-blue-600 rounded px-3 py-1 text-white text-xs font-semibold">PayPal</div>
                  <div className="bg-green-600 rounded px-3 py-1 text-white text-xs font-semibold">OTP</div>
                  <div className="bg-purple-600 rounded px-3 py-1 text-white text-xs font-semibold">Wise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="py-4 relative" style={{ backgroundColor: '#131a22' }}>
        <div className="max-w-screen-2xl mx-auto px-6 text-center text-sm">
          <p>&copy; 2012 Jovotech. Minden jog fenntartva. | 
            <Link href="/aszf" className="hover:text-white ml-1">
              ÁSZF
            </Link> | 
            <Link href="/adatvedelmi-szabalyzat" className="hover:text-white ml-1">
              Adatvédelem
            </Link> | 
            <span className="ml-1">20 éves évfordulónkat ünnepeljük 🎉</span>
          </p>
        </div>
        {/* Rainbow Line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[8px]"
          style={{
            background: 'linear-gradient(to right, #420C09, #6B1818, #8B2635, #A0522D, #BF6B04, #B8860B, #7B7922, #556B2F, #2F5233, #1B5E3F, #006B6B, #1B4F72, #2E3B85, #3B2F7D, #4B0082, #5B2C6F, #702963, #85144B, #922B3E, #420C09)'
          }}
        />
      </div>
    </footer>
  );
}