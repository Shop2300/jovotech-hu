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
            Zpět na hlavní stránku
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Kontakt</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jsme tu pro vás. Neváhejte nás kontaktovat s jakýmkoliv dotazem.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-black mb-6">Kontaktní údaje</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Adresa</h3>
                      <p className="text-gray-700">
                        Václavské náměstí 123<br />
                        110 00 Praha 1<br />
                        Česká republika
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
                        +420 123 456 789<br />
                        <span className="text-sm text-gray-600">Po-Pá 8:00-18:00</span>
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
                        info@muj-eshop.cz<br />
                        <span className="text-sm text-gray-600">Odpovíme do 24 hodin</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Opening Hours */}
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-blue-600" size={24} />
                  <h3 className="text-xl font-semibold text-black">Provozní doba</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Pondělí - Pátek</span>
                    <span className="font-semibold">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sobota</span>
                    <span className="font-semibold">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neděle</span>
                    <span className="font-semibold text-red-600">Zavřeno</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">Napište nám</h2>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Jméno a příjmení
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jan Novák"
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
                    placeholder="jan.novak@email.cz"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon (nepovinné)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+420 123 456 789"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Předmět
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dotaz k objednávce"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Zpráva
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Napište nám svůj dotaz..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Odeslat zprávu
                </button>
              </form>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-12">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">Zde by byla mapa s naší polohou</p>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-black mb-2">Zákaznická podpora</h3>
              <p className="text-gray-700 text-sm">
                Náš tým je připraven vám pomoci s jakýmkoliv dotazem
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-black mb-2">Rychlá odpověď</h3>
              <p className="text-gray-700 text-sm">
                Na emaily odpovídáme do 24 hodin v pracovní dny
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-black mb-2">Osobní přístup</h3>
              <p className="text-gray-700 text-sm">
                Každý zákazník je pro nás důležitý
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}