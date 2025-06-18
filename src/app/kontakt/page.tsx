import { Metadata } from 'next'
import { Mail, MapPin, Building2, FileText, CreditCard, Facebook, Instagram, Twitter, Youtube, Clock, Shield, Truck, HelpCircle, Users, Award, Lock, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kontakt - Galaxy Sklep',
  description: 'Skontaktuj się z Galaxy Sklep - adres, email, dane firmy, obsługa klienta',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Powrót do strony głównej</span>
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Kontakt</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information Box */}
        <div className="bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Informacje kontaktowe</h2>
          
          {/* Email */}
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <a href="mailto:support@galaxysklep.pl" className="text-blue-600 hover:underline">
                support@galaxysklep.pl
              </a>
              <p className="text-sm text-gray-600 mt-1">Odpowiadamy w ciągu 24 godzin</p>
            </div>
          </div>
          
          {/* Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Adres firmy</h3>
              <p className="text-gray-600">1. máje 535/50</p>
              <p className="text-gray-600">460 07 Liberec</p>
              <p className="text-gray-600">Czechy</p>
              <p className="text-sm text-gray-500 mt-2 italic">
                (Siedziba firmy - korespondencję prosimy kierować na adres email)
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Godziny obsługi klienta</h3>
              <p className="text-gray-600">Poniedziałek - Piątek: 8:00 - 18:00</p>
              <p className="text-gray-600">Sobota: 9:00 - 14:00</p>
              <p className="text-gray-600">Niedziela: Zamknięte</p>
              <p className="text-sm text-gray-500 mt-1">*Czas środkowoeuropejski (CET)</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 mt-1" /> {/* Spacer for alignment */}
            <div>
              <h3 className="font-semibold mb-3">Znajdź nas w social media</h3>
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
              <p className="text-sm text-gray-500 mt-2">Śledź nas dla najnowszych promocji!</p>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Dane firmy</h2>
          
          {/* Company Details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold">Informacje prawne</h3>
                <p className="text-gray-600"><strong>Nazwa:</strong> Galaxy Sklep</p>
                <p className="text-gray-600"><strong>NIP:</strong> 04688465</p>
                <p className="text-gray-600"><strong>Forma prawna:</strong> Działalność gospodarcza</p>
                <p className="text-gray-600 mt-2 text-sm">Działamy zgodnie z prawem polskim i unijnym</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold">Dane bankowe</h3>
                <p className="text-gray-600"><strong>Numer konta:</strong> 21291000062469800208837403</p>
                <p className="text-gray-600"><strong>IBAN:</strong> PL21 2910 0006 2469 8002 0883 7403</p>
                <p className="text-gray-600"><strong>BIC/SWIFT:</strong> BMPBPLPP</p>
                <p className="text-gray-600"><strong>Bank:</strong> Aion S.A. Spolka Akcyjna Oddzial w Polsce</p>
                <p className="text-gray-600"><strong>Adres banku:</strong> Dobra 40, 00-344, Warszawa, Poland</p>
                <p className="text-gray-600"><strong>Waluta:</strong> PLN, EUR</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold">Dokumenty i regulaminy</h3>
                <ul className="space-y-1 mt-2">
                  <li>
                    <a href="/regulamin" className="text-blue-600 hover:underline text-sm">
                      Regulamin sklepu
                    </a>
                  </li>
                  <li>
                    <a href="/polityka-prywatnosci" className="text-blue-600 hover:underline text-sm">
                      Polityka prywatności
                    </a>
                  </li>
                  <li>
                    <a href="/zwroty-i-reklamacje" className="text-blue-600 hover:underline text-sm">
                      Zwroty i reklamacje
                    </a>
                  </li>
                  <li>
                    <a href="/dostawa-i-platnosc" className="text-blue-600 hover:underline text-sm">
                      Dostawa i płatność
                    </a>
                  </li>
                  <li>
                    <a href="/o-nas" className="text-blue-600 hover:underline text-sm">
                      O nas
                    </a>
                  </li>
                  <li>
                    <a href="/ocena-sklepu" className="text-blue-600 hover:underline text-sm">
                      Opinie klientów
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
          <h2 className="text-2xl font-semibold">Obsługa klienta</h2>
          <p className="text-gray-600 mt-2">Jesteśmy tu, aby Ci pomóc!</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <Phone className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Kontakt email</h3>
            <p className="text-sm text-gray-600">
              Preferujemy kontakt emailowy dla szybszej i bardziej efektywnej obsługi. 
              Wszystkie zapytania są rejestrowane i numerowane.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <Clock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Czas odpowiedzi</h3>
            <p className="text-sm text-gray-600">
              Standardowy czas odpowiedzi: 24h<br/>
              Reklamacje: do 48h<br/>
              Weekendy: do 72h
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <Award className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Jakość obsługi</h3>
            <p className="text-sm text-gray-600">
              Nasz zespół przechodzi regularne szkolenia. 
              98% klientów ocenia naszą obsługę jako doskonałą!
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {/* Customer Service */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Przed zakupem</h3>
          <p className="text-gray-600 text-sm">
            Masz pytania dotyczące produktów? Potrzebujesz porady? 
            Napisz do nas, a nasi specjaliści chętnie pomogą w wyborze odpowiedniego produktu.
          </p>
        </div>

        {/* Complaints */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Reklamacje i zwroty</h3>
          <p className="text-gray-600 text-sm">
            Proces reklamacji jest prosty i przejrzysty. 
            14 dni na zwrot bez podania przyczyny. 
            2 lata gwarancji na wszystkie produkty.
          </p>
        </div>

        {/* Legal Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Po zakupie</h3>
          <p className="text-gray-600 text-sm">
            Śledzimy każde zamówienie. Otrzymasz powiadomienia o statusie przesyłki. 
            W razie problemów z dostawą - natychmiast się z nami skontaktuj.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
          <HelpCircle className="w-8 h-8 mr-2 text-blue-600" />
          Najczęściej zadawane pytania
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Jak mogę śledzić moje zamówienie?</h4>
            <p className="text-gray-600 text-sm">
              Po wysłaniu zamówienia otrzymasz email z numerem śledzenia przesyłki. 
              Możesz również sprawdzić status w sekcji "Moje zamówienia" po zalogowaniu.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Czy mogę zmienić lub anulować zamówienie?</h4>
            <p className="text-gray-600 text-sm">
              Tak, możesz zmienić lub anulować zamówienie do momentu jego wysłania. 
              Skontaktuj się z nami jak najszybciej na support@galaxysklep.pl.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Jakie są koszty dostawy?</h4>
            <p className="text-gray-600 text-sm">
              Koszty dostawy zależą od wartości zamówienia i wybranego przewoźnika. 
              Darmowa dostawa przy zamówieniach powyżej 200 zł.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">Czy oferujecie faktury VAT?</h4>
            <p className="text-gray-600 text-sm">
              Tak, wystawiamy faktury VAT. Przy składaniu zamówienia zaznacz odpowiednią opcję 
              i wypełnij dane firmy.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Partners */}
      <div className="mt-12 bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
          <Truck className="w-8 h-8 mr-2 text-green-600" />
          Nasi partnerzy logistyczni
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <h4 className="font-semibold mb-2">InPost</h4>
            <p className="text-sm text-gray-600">Paczkomaty 24/7<br/>Dostawa 1-2 dni</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">DPD</h4>
            <p className="text-sm text-gray-600">Dostawa kurierska<br/>Śledzenie w czasie rzeczywistym</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Poczta Polska</h4>
            <p className="text-sm text-gray-600">Tradycyjna dostawa<br/>Najszerszy zasięg</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">DHL</h4>
            <p className="text-sm text-gray-600">Ekspresowa dostawa<br/>Międzynarodowe przesyłki</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Nasza lokalizacja</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.834721087594!2d15.036897!3d50.768889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470937305f5f5f5f%3A0x0!2s1.%20m%C3%A1je%20535%2F50%2C%20460%2007%20Liberec%2C%20Czechy!5e0!3m2!1spl!2spl!4v1"
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
          Bezpieczeństwo i zaufanie
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Lock className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Bezpieczne płatności</h4>
            <p className="text-sm text-gray-600">
              Szyfrowanie SSL, certyfikaty bezpieczeństwa, 
              współpraca tylko ze sprawdzonymi operatorami płatności.
            </p>
          </div>
          <div className="text-center">
            <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Ochrona danych</h4>
            <p className="text-sm text-gray-600">
              Zgodność z RODO, dane osobowe przetwarzane zgodnie z prawem, 
              możliwość usunięcia danych na żądanie.
            </p>
          </div>
          <div className="text-center">
            <Award className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Gwarancja jakości</h4>
            <p className="text-sm text-gray-600">
              Tylko oryginalne produkty, współpraca z oficjalnymi dystrybutorami, 
              pełna gwarancja producenta.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Akceptowane metody płatności</h2>
        <div className="bg-white rounded-lg p-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">Przelewy24</h4>
              <p className="text-sm text-gray-600 mt-1">Szybkie płatności online</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">BLIK</h4>
              <p className="text-sm text-gray-600 mt-1">Płatność kodem</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">Karty płatnicze</h4>
              <p className="text-sm text-gray-600 mt-1">Visa, Mastercard</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold">Przelew tradycyjny</h4>
              <p className="text-sm text-gray-600 mt-1">Na konto bankowe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Legal Information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Ważne informacje prawne</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Organ nadzoru:</strong> Prezes Urzędu Ochrony Danych Osobowych (PUODO) - 
            <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              uodo.gov.pl
            </a>
          </p>
          <p>
            <strong>Inspekcja Handlowa:</strong> Wojewódzki Inspektorat Inspekcji Handlowej - 
            <a href="https://wiih.org.pl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              wiih.org.pl
            </a>
          </p>
          <p>
            <strong>Rzecznik Praw Konsumenta:</strong> Pomoc w sporach konsumenckich - 
            <a href="https://www.gov.pl/web/konsument" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              gov.pl/web/konsument
            </a>
          </p>
          <p>
            <strong>Platforma ODR:</strong> Rozstrzyganie sporów online - 
            <a href="http://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              ec.europa.eu/consumers/odr
            </a>
          </p>
          <p className="mt-4 font-semibold">
            Galaxy Sklep przestrzega kodeksu dobrych praktyk i działa zgodnie z zasadami uczciwej konkurencji.
          </p>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Bądź na bieżąco!</h3>
        <p className="text-gray-600 mb-6">
          Zapisz się do naszego newslettera i otrzymuj informacje o nowościach, 
          promocjach i specjalnych ofertach tylko dla subskrybentów.
        </p>
        <p className="text-sm text-gray-500">
          Wyślij email na <a href="mailto:support@galaxysklep.pl" className="text-blue-600 hover:underline">support@galaxysklep.pl</a> z tematem "Newsletter" aby się zapisać.
        </p>
      </div>
    </div>
  )
}