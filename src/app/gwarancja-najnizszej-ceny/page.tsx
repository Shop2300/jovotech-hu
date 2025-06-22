// src/app/gwarancja-najnizszej-ceny/page.tsx
import { Metadata } from 'next';
import { Check, ShieldCheck, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gwarancja najniższej ceny - Galaxy Sklep',
  description: 'Gwarantujemy najniższe ceny na rynku. Znajdziesz taniej? Zwrócimy różnicę!',
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
            Gwarancja najniższej ceny
          </h1>
          <p className="text-xl text-gray-600">
            Znajdziesz taniej? Zwrócimy Ci różnicę!
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold text-[#131921] mb-0">
              W Galaxy Sklep gwarantujemy najniższe ceny na wszystkie produkty. 
              Jeśli znajdziesz identyczny produkt taniej u konkurencji, natychmiast zwrócimy Ci różnicę!
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#131921] mb-6">Jak działa nasza gwarancja?</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#6da306] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#131921] mb-2">Znajdź niższą cenę</h3>
                <p className="text-gray-600">
                  Jeśli znajdziesz ten sam produkt w innym sklepie internetowym w niższej cenie, 
                  zapisz link do oferty konkurencji.
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
                <h3 className="font-semibold text-[#131921] mb-2">Skontaktuj się z nami</h3>
                <p className="text-gray-600">
                  Wyślij nam e-mail na adres <a href="mailto:support@galaxysklep.pl" className="text-[#6da306] underline">support@galaxysklep.pl</a> z 
                  numerem zamówienia i linkiem do tańszej oferty.
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
                <h3 className="font-semibold text-[#131921] mb-2">Otrzymaj zwrot różnicy</h3>
                <p className="text-gray-600">
                  Po weryfikacji zgłoszenia, w ciągu 24 godzin zwrócimy Ci różnicę w cenie 
                  na konto bankowe lub jako kod rabatowy do wykorzystania przy kolejnych zakupach.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#131921] mb-6">Warunki gwarancji</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Gwarancja obowiązuje przez <strong>14 dni</strong> od daty zakupu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Produkt musi być <strong>identyczny</strong> (ten sam model, kolor, rozmiar, stan)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Oferta konkurencji musi być <strong>aktualnie dostępna</strong> w polskim sklepie internetowym
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Cena konkurencji musi uwzględniać <strong>koszty dostawy</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-[#6da306] flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">
                  Gwarancja nie obejmuje wyprzedaży, promocji typu Black Friday ani ofert limitowanych czasowo
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-[#131921] mb-6">Dlaczego warto?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da306] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#131921] mb-2">Bezpieczeństwo zakupów</h3>
              <p className="text-sm text-gray-600">
                Kupuj z pewnością, że nie przepłacasz
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da306] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#131921] mb-2">Szybka weryfikacja</h3>
              <p className="text-sm text-gray-600">
                Odpowiadamy w ciągu 24 godzin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da306] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#131921] mb-2">Prosta procedura</h3>
              <p className="text-sm text-gray-600">
                Wystarczy jeden e-mail
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-[#6da306] text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Masz pytania?</h3>
            <p className="mb-6">
              Skontaktuj się z nami, a nasz zespół chętnie pomoże!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@galaxysklep.pl" 
                className="inline-flex items-center justify-center gap-2 bg-white text-[#6da306] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Mail size={20} />
                support@galaxysklep.pl
              </a>
              <div className="inline-flex items-center justify-center gap-2 bg-white/20 px-6 py-3 rounded-lg font-semibold">
                <Clock size={20} />
                Pn-Pt: 8:00-18:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}