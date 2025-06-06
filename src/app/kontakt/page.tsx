// src/app/kontakt/page.tsx
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function KontaktPage() {
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
            Powrót do strony głównej
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Kontakt</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jesteśmy tu dla Ciebie. Skontaktuj się z nami w przypadku jakichkolwiek pytań.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-black mb-6">Dane kontaktowe</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Adres</h3>
                      <p className="text-gray-700">
                        1. máje 535/50<br />
                        46007 Liberec<br />
                        Czechy
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        IČO: 04688465
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <Phone className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Telefon</h3>
                      <p className="text-gray-700">
                        +48 123 456 789<br />
                        <span className="text-sm text-gray-600">Pn-Pt 8:00-18:00</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      <Mail className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Email</h3>
                      <p className="text-gray-700">
                        info@galaxysklep.pl<br />
                        <span className="text-sm text-gray-600">Odpowiadamy w ciągu 24 godzin</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Opening Hours */}
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-blue-600" size={24} />
                  <h3 className="text-xl font-semibold text-black">Godziny otwarcia</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Poniedziałek - Piątek</span>
                    <span className="font-semibold">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sobota</span>
                    <span className="font-semibold">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Niedziela</span>
                    <span className="font-semibold text-red-600">Zamknięte</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">Napisz do nas</h2>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jan Kowalski"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jan.kowalski@email.pl"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon (opcjonalnie)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+48 123 456 789"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Temat
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pytanie o zamówienie"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Wiadomość
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Napisz swoją wiadomość..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Wyślij wiadomość
                </button>
              </form>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-12">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">Tutaj będzie mapa z naszą lokalizacją</p>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-black mb-2">Obsługa klienta</h3>
              <p className="text-gray-700 text-sm">
                Nasz zespół jest gotowy pomóc Ci w każdej sprawie
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-black mb-2">Szybka odpowiedź</h3>
              <p className="text-gray-700 text-sm">
                Na e-maile odpowiadamy w ciągu 24 godzin w dni robocze
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-black mb-2">Indywidualne podejście</h3>
              <p className="text-gray-700 text-sm">
                Każdy klient jest dla nas ważny
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}