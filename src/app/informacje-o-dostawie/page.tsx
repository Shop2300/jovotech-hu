// src/app/informacje-o-dostawie/page.tsx
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
    { name: 'InPost', url: 'https://inpost.pl/sledzenie-przesylek' },
    { name: 'DPD', url: 'https://www.dpd.com.pl/Sledzenie-przesylek' },
    { name: 'DHL', url: 'https://www.dhl.com/pl-pl/home/sledzenie.html' },
    { name: 'Poczta Polska', url: 'https://emonitoring.poczta-polska.pl/' },
    { name: 'UPS', url: 'https://www.ups.com/track?loc=pl_PL' },
    { name: 'FedEx', url: 'https://www.fedex.com/pl-pl/tracking.html' },
    { name: 'GLS', url: 'https://gls-group.com/PL/pl/sledzenie-paczek' },
    { name: 'Orlen Paczka', url: 'https://orlenpaczka.pl/sledzenie/' },
    { name: 'Pocztex', url: 'https://www.pocztex.pl/sledzenie-przesylek/' },
  ];

  const faqs = [
    {
      question: 'Jak mogę śledzić moją przesyłkę?',
      answer: `Aby śledzić przesyłkę, potrzebujesz unikalnego numeru śledzenia, który zazwyczaj otrzymujesz e-mailem od nas na adres support@galaxysklep.pl. 
      
Po otrzymaniu numeru, przejdź na stronę internetową przewoźnika (np. InPost, DPD lub Poczta Polska) i wprowadź ten numer w polu do śledzenia przesyłki. System pokaże aktualny status przesyłki – gdzie się znajduje i kiedy spodziewane jest doręczenie.

Jeśli informacje nie są dostępne, sprawdź poprawność numeru lub spróbuj ponownie później. W przypadku problemów skontaktuj się z nami pod adresem support@galaxysklep.pl - pomożemy Ci zlokalizować Twoją przesyłkę.`
    },
    {
      question: 'Co robić, jeśli moja przesyłka ma opóźnienie?',
      answer: `Jeśli Twoja przesyłka ma opóźnienie, najpierw sprawdź jej status za pomocą numeru śledzenia na stronie przewoźnika. Aktualne informacje mogą wskazywać przyczynę opóźnienia, np. niekorzystne warunki pogodowe lub zwiększoną liczbę przesyłek.

Jeśli status nie zmienia się przez więcej niż 24 godziny, skontaktuj się z obsługą klienta przewoźnika. Przygotuj numer śledzenia i szczegóły przesyłki.

Możesz również skontaktować się z nami pod adresem support@galaxysklep.pl - jako nadawca możemy podjąć dodatkowe kroki w celu przyspieszenia dostawy lub rozwiązania problemu. Większość opóźnień jest spowodowana czynnikami tymczasowymi i szybko się rozwiązuje.`
    },
    {
      question: 'Czy mogę zmienić adres dostawy?',
      answer: `Tak, zmiana adresu dostawy jest zazwyczaj możliwa, ale zależy od aktualnego statusu przesyłki i polityki przewoźnika. 

Najpierw zaloguj się na stronie przewoźnika używając numeru śledzenia. Jeśli opcja zmiany adresu jest dostępna, znajdziesz ją w szczegółach przesyłki. Wielu przewoźników (np. DPD, UPS) umożliwia zmianę adresu online lub przez aplikację mobilną.

Jeśli nie możesz zmienić adresu samodzielnie, skontaktuj się z nami na support@galaxysklep.pl jak najszybciej. Pomożemy Ci w kontakcie z przewoźnikiem i zmianie adresu dostawy. Pamiętaj, że zmiana może być trudniejsza, jeśli przesyłka jest już u kuriera.`
    },
    {
      question: 'Jak mogę zmienić termin dostawy mojej przesyłki?',
      answer: `Zmiana terminu dostawy jest możliwa u większości przewoźników. Sprawdź status przesyłki na stronie przewoźnika używając numeru śledzenia.

Wielu przewoźników (DPD, UPS, InPost) oferuje narzędzia online lub aplikacje mobilne, gdzie możesz wybrać dogodny termin dostawy. Ta opcja jest często oznaczona jako "Zmień termin dostawy" lub "Elastyczna dostawa".

Jeśli nie możesz zmienić terminu online, skontaktuj się z obsługą klienta przewoźnika lub napisz do nas na support@galaxysklep.pl. Niektóre zmiany mogą być płatne, szczególnie jeśli wymagasz konkretnego przedziału czasowego.

Zalecamy działać jak najszybciej, ponieważ niektóre systemy umożliwiają zmiany tylko do określonego momentu przed dostawą.`
    },
    {
      question: 'Czy mogę śledzić wiele przesyłek jednocześnie?',
      answer: `Tak, śledzenie wielu przesyłek jest możliwe, choć zależy od możliwości przewoźnika. Niektórzy (np. UPS, DPD) pozwalają wprowadzić kilka numerów śledzenia jednocześnie w swoich narzędziach online.

Jeśli zamawiasz u nas regularnie, polecamy założenie konta na naszej stronie - wszystkie Twoje zamówienia i numery śledzenia będą dostępne w jednym miejscu w sekcji "Moje zamówienia".

Możesz również utworzyć konto u przewoźników, gdzie po zalogowaniu możesz dodawać przesyłki do listy śledzenia i mieć centralizowany przegląd.

Dla wygody zapisuj numery śledzenia z naszych e-maili. W razie pytań o konkretne przesyłki, napisz na support@galaxysklep.pl - chętnie pomożemy.`
    },
    {
      question: 'Jak sprawdzić, który przewoźnik dostarcza moją przesyłkę?',
      answer: `Informację o przewoźniku znajdziesz w e-mailu z potwierdzeniem wysyłki, który wysyłamy na Twój adres e-mail zaraz po nadaniu paczki. E-mail zawiera nazwę przewoźnika i numer śledzenia.

Możesz również sprawdzić te informacje logując się na swoje konto na naszej stronie w sekcji "Moje zamówienia" - przy każdym zamówieniu widoczny jest przewoźnik i numer śledzenia.

Współpracujemy głównie z: InPost, DPD, DHL, Pocztą Polską i UPS. Wybór przewoźnika zależy od wybranej metody dostawy podczas składania zamówienia.

Jeśli nie otrzymałeś e-maila z informacją o wysyłce, sprawdź folder SPAM lub skontaktuj się z nami na support@galaxysklep.pl - natychmiast wyślemy Ci wszystkie potrzebne informacje.`
    },
    {
      question: 'Co zrobić, jeśli status przesyłki nie zmienia się od kilku dni?',
      answer: `Jeśli status przesyłki nie zmienia się przez kilka dni, najpierw upewnij się, że wprowadzasz poprawny numer śledzenia. Pamiętaj, że w okresach przedświątecznych lub podczas dużego ruchu systemy mogą wykazywać opóźnienia w aktualizacji.

Przy przesyłkach międzynarodowych lub w okresach logistycznych szczytów może wystąpić dłuższe opóźnienie podczas transportu między sortowniami. Jeśli status nie zmienia się dłużej niż 3-5 dni, skontaktuj się z obsługą przewoźnika.

Napisz również do nas na support@galaxysklep.pl - jako nadawca mamy dodatkowe możliwości sprawdzenia statusu i możemy złożyć oficjalne zapytanie do przewoźnika.

W większości przypadków chodzi o tymczasowe opóźnienie w logistyce, a nie o zagubienie przesyłki. Kluczem jest cierpliwość i komunikacja.`
    },
    {
      question: 'Co oznaczają poszczególne statusy przesyłki?',
      answer: `Oto najczęstsze statusy przesyłek i ich znaczenie:

**"Przyjęta do przewozu"** - przesyłka została zarejestrowana w systemie przewoźnika i czeka na odbiór.

**"W sortowni"** - przesyłka dotarła do sortowni, gdzie jest sortowana według miejsca docelowego.

**"W trasie"** - przesyłka została wysłana z sortowni i jest w drodze do kolejnego punktu.

**"W oddziale docelowym"** - przesyłka dotarła do najbliższego centrum dystrybucyjnego w Twojej okolicy.

**"Przekazana kurierowi"** - przesyłka jest u kuriera i zostanie dostarczona tego samego dnia.

**"Dostarczona"** - przesyłka została pomyślnie dostarczona.

**"Nieudana próba doręczenia"** - kurier próbował dostarczyć przesyłkę, ale nikogo nie zastał. Przesyłka może trafić do punktu odbioru.

**"Oczekuje na odbiór"** - przesyłka czeka w punkcie odbioru (np. Paczkomat InPost).

Jeśli nie rozumiesz konkretnego statusu, napisz do nas na support@galaxysklep.pl - wyjaśnimy, co dokładnie oznacza.`
    },
    {
      question: 'Czy śledzenie pokazuje dokładny czas dostawy?',
      answer: `System śledzenia pokazuje przewidywany czas dostawy, który może się zmieniać w zależności od:

• **Sytuacji drogowej** - korki lub wypadki mogą spowodować opóźnienia
• **Pogody** - niekorzystne warunki atmosferyczne wpływają na transport
• **Obłożenia kuriera** - liczba przesyłek do doręczenia danego dnia

Niektórzy przewoźnicy (np. DPD) oferują "śledzenie na żywo" z dokładniejszym czasem dostawy, gdy kurier jest już w drodze do Ciebie.

W dniu dostawy często otrzymasz SMS lub e-mail z przedziałem czasowym (np. 10:00-12:00), kiedy możesz spodziewać się kuriera.

Jeśli potrzebujesz dostawy w konkretnym terminie, napisz do nas na support@galaxysklep.pl przed złożeniem zamówienia - doradzimy najlepszą opcję dostawy dla Twoich potrzeb.`
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
            Informacje o dostawie
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jeśli potrzebujesz sprawdzić informacje o swojej przesyłce lub śledzić jej aktualną lokalizację, 
            jesteś we właściwym miejscu! Na tej stronie znajdziesz przegląd linków do najpopularniejszych 
            firm kurierskich, które pozwolą Ci łatwo i szybko śledzić Twoje przesyłki.
          </p>
        </div>

        {/* Tracking Links Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#131921] text-center mb-8">
            <span className="border-b-2 border-[#6da306] pb-2">Śledź swoją przesyłkę</span>
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
            <span className="border-b-2 border-[#6da306] pb-2">Często zadawane pytania</span>
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
            <span className="border-b-2 border-[#6da306] pb-2">Informacje o doręczeniu</span>
          </h2>
          <div className="space-y-6 text-gray-700 max-w-4xl mx-auto">
            <p>
              Doręczenie przesyłki odbywa się w kilku etapach, z których każdy ma swoją specyfikę i zasady. 
              Ogólnie rzecz biorąc, na czas dostawy wpływają różne czynniki, takie jak rodzaj usługi przewozowej, 
              odległość między nadawcą a odbiorcą, aktualne obciążenie przewoźnika i inne okoliczności logistyczne.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-semibold text-[#131921] mb-3 flex items-center gap-2">
                  <Clock className="text-[#6da306]" size={20} />
                  Standardowe czasy dostawy
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Paczkomaty InPost:</strong> 1-2 dni robocze</li>
                  <li>• <strong>Kurier DPD/DHL:</strong> 1-3 dni robocze</li>
                  <li>• <strong>Poczta Polska:</strong> 2-5 dni roboczych</li>
                  <li>• <strong>Dostawa ekspresowa:</strong> następny dzień roboczy</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-semibold text-[#131921] mb-3 flex items-center gap-2">
                  <Info className="text-[#6da306]" size={20} />
                  Ważne informacje
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Wszystkie przesyłki są ubezpieczone</li>
                  <li>• Darmowa dostawa przy każdym zamówieniu</li>
                  <li>• Możliwość śledzenia przesyłki online</li>
                  <li>• Powiadomienia SMS/e-mail o statusie</li>
                </ul>
              </div>
            </div>
            
            <p>
              Jeśli oczekujesz dostawy, zalecamy śledzenie statusu przesyłki za pomocą numeru śledzenia, 
              który pozwoli Ci sprawdzić aktualną lokalizację paczki i przewidywany czas doręczenia. 
              Podczas dostawy ważne jest, aby pod adresem był ktoś, kto może odebrać przesyłkę.
            </p>
            
            <p>
              W przypadku opóźnienia, zmiany adresu dostawy lub innych problemów, jak najszybciej skontaktuj 
              się z nami pod adresem <a href="mailto:support@galaxysklep.pl" className="text-[#6da306] underline font-semibold">support@galaxysklep.pl</a>. 
              Każdy przewoźnik ma swoje zasady i procedury rozwiązywania takich sytuacji, dlatego warto 
              zapoznać się z nimi z wyprzedzeniem.
            </p>
            
            <div className="bg-[#6da306] text-white rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Potrzebujesz pomocy?</h3>
              <p className="mb-4">
                Nasz zespół obsługi klienta jest do Twojej dyspozycji
              </p>
              <a
                href="mailto:support@galaxysklep.pl"
                className="inline-flex items-center gap-2 bg-white text-[#6da306] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <MapPin size={20} />
                support@galaxysklep.pl
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}