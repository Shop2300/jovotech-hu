// src/components/Footer.tsx
import Link from 'next/link';
import { MapPin, Check, Mail, Clock, Truck, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-gray-300" style={{ backgroundColor: '#222f3e' }}>
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Column 1 - Informacje */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Informacje</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/regulamin" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/ocena-sklepu" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Ocena sklepu
                </Link>
              </li>
              <li>
                <Link href="/regulamin" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Formularze do pobrania
                </Link>
              </li>
              <li>
                <Link href="/szkoly-i-instytucje-publiczne" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Szkoły i instytucje publiczne
                </Link>
              </li>
              <li>
                <Link href="/gwarancja-najnizszej-ceny" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Gwarancja najniższej ceny
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Obsługa klienta */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Obsługa klienta</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dostawa-i-platnosc" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Dostawa i płatność
                </Link>
              </li>
              <li>
                <Link href="/zwroty-i-reklamacje" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Zwroty i reklamacje
                </Link>
              </li>
              <li>
                <Link href="/informacje-o-dostawie" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Informacje o dostawie
                </Link>
              </li>
              <li>
                <Link href="/order-status" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Śledzenie zamówienia
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Napisz do nas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - O nas */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>O nas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gwarancja-najnizszej-ceny" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Gwarancja najniższej ceny
                </Link>
              </li>
              <li>
                <Link href="/dla-firm" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Dla firm +
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  O firmie
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/ocena-sklepu" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Opinie klientów
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Odwiedź także */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Odwiedź także</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/artyku-y-biurowe" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Artykuły biurowe
                </Link>
              </li>
              <li>
                <Link href="/category/zwierzeta-domowe" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Zwierzęta domowe
                </Link>
              </li>
              <li>
                <Link href="/category/inzynieria-elektryczna" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Inżynieria elektryczna
                </Link>
              </li>
              <li>
                <Link href="/category/ogrod-i-trawnik" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Ogród i trawnik
                </Link>
              </li>
              <li>
                <Link href="/category/sklep-z-narzedziami" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Sklep z narzędziami
                </Link>
              </li>
              <li>
                <Link href="/category/spawalniczy" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Spawalniczy
                </Link>
              </li>
              <li>
                <Link href="/category/bezpieczenstwo" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  Bezpieczeństwo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Dane kontaktowe */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontSize: '16px' }}>Dane kontaktowe</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                <span style={{ fontSize: '14px' }}>
                  Galaxysklep.pl<br />
                  1. máje 535/50<br />
                  46007 Liberec
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span className="font-medium" style={{ fontSize: '14px' }}>Gwarancja najniższej ceny</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:support@galaxysklep.pl" className="hover:text-white transition" style={{ fontSize: '14px' }}>
                  support@galaxysklep.pl
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-blue-400 mt-0.5" />
                <span style={{ fontSize: '14px' }}>
                  Pn-Pt: 8:00 - 18:00<br />
                  Sob-Nd: 9:00 - 15:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Zapisz się do newslettera</h3>
            <p className="text-sm mb-4">Bądź pierwszy i dowiedz się o nowościach i promocjach</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Twój e-mail"
                className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                style={{ backgroundColor: '#131a22' }}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Zapisz się
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Delivery Options */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Media Links */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
                  Dostawa:
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>InPost</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>DPD</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>DHL</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>Poczta Polska</div>
                  <div className="border border-gray-700 rounded px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#131a22' }}>UPS</div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="hidden md:block h-6 w-px bg-gray-700"></div>
              
              {/* Payment Options */}
              <div className="flex items-center gap-3">
                <span className="text-sm flex items-center gap-1">
                  <CreditCard size={16} />
                  Płatność:
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white rounded px-3 py-1 text-gray-900 text-xs font-semibold">VISA</div>
                  <div className="bg-white rounded px-3 py-1 text-gray-900 text-xs font-semibold">Mastercard</div>
                  <div className="bg-blue-600 rounded px-3 py-1 text-white text-xs font-semibold">PayPal</div>
                  <div className="bg-orange-500 rounded px-3 py-1 text-white text-xs font-semibold">P24</div>
                  <div className="bg-purple-600 rounded px-3 py-1 text-white text-xs font-semibold">BLIK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="py-4 relative" style={{ backgroundColor: '#131a22' }}>
        <div className="max-w-screen-2xl mx-auto px-6 text-center text-sm">
          <p>&copy; 2012 Galaxy Sklep. Wszelkie prawa zastrzeżone. | 
            <Link href="/regulamin" className="hover:text-white ml-1">
              Regulamin
            </Link> | 
            <Link href="/polityka-prywatnosci" className="hover:text-white ml-1">
              Ochrona danych
            </Link> | 
            <span className="ml-1">Świętujemy 20 lat 🎉</span>
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