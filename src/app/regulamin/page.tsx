// src/app/regulamin/page.tsx
import Link from 'next/link';
import { ArrowLeft, FileText, ShoppingCart, Package, Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegulaminPage() {
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
          <h1 className="text-4xl font-bold text-black mb-4">Regulamin sklepu</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Obowiązuje od 1 stycznia 2025
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">1. Postanowienia ogólne</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Niniejszy regulamin (dalej „Regulamin") sklepu Galaxy Sklep, 
                  NIP: 04688465, z siedzibą przy ul. 1. máje 535/50, 46007 Liberec, Czechy 
                  (dalej „Sprzedawca"), określa zasady korzystania ze sklepu internetowego 
                  dostępnego pod adresem galaxysklep.pl oraz prawa i obowiązki Sprzedawcy 
                  i Kupującego.
                </p>
                <p>
                  Regulamin jest dostępny nieodpłatnie pod adresem galaxysklep.pl/regulamin, 
                  co umożliwia jego pozyskanie, odtwarzanie i utrwalanie za pomocą systemu 
                  teleinformatycznego, którym posługuje się Kupujący.
                </p>
              </div>
            </section>

            {/* Order Process */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">2. Składanie zamówienia i zawarcie umowy</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Wszystkie produkty prezentowane w sklepie internetowym stanowią zaproszenie 
                  do zawarcia umowy w rozumieniu art. 71 Kodeksu cywilnego.
                </p>
                <p className="font-semibold">Proces składania zamówienia:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kupujący dodaje wybrane produkty do koszyka</li>
                  <li>Wypełnia formularz zamówienia podając dane niezbędne do realizacji</li>
                  <li>Wybiera sposób dostawy i płatności</li>
                  <li>Przed złożeniem zamówienia ma możliwość weryfikacji i korekty danych</li>
                  <li>Składa zamówienie klikając przycisk „Zamawiam z obowiązkiem zapłaty"</li>
                  <li>Otrzymuje potwierdzenie przyjęcia zamówienia na podany adres e-mail</li>
                </ul>
                <p>
                  Umowa sprzedaży zostaje zawarta w momencie przesłania przez Sprzedawcę 
                  potwierdzenia przyjęcia zamówienia.
                </p>
              </div>
            </section>

            {/* Price and Payment */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">3. Ceny i warunki płatności</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Wszystkie ceny podane w sklepie są cenami brutto (zawierają podatek VAT). 
                  Cena podana przy produkcie jest wiążąca w chwili złożenia zamówienia.
                </p>
                <p className="font-semibold">Dostępne metody płatności:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Płatność online kartą kredytową/debetową</li>
                  <li>Szybki przelew online</li>
                  <li>Płatność BLIK</li>
                  <li>Przelew tradycyjny na rachunek bankowy</li>
                  <li>Płatność przy odbiorze (za pobraniem)</li>
                  <li>PayPal</li>
                </ul>
                <p>
                  Do ceny produktów doliczany jest koszt dostawy zgodnie z aktualnym 
                  cennikiem przewoźnika.
                </p>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">4. Dostawa towaru</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Sposób dostawy wybiera Kupujący spośród dostępnych opcji:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>InPost Paczkomaty - dostawa do wybranego paczkomatu</li>
                  <li>Kurier DPD - dostawa pod wskazany adres</li>
                  <li>Poczta Polska - dostawa na adres lub do placówki</li>
                  <li>Odbiór osobisty w magazynie (po wcześniejszym umówieniu)</li>
                </ul>
                <p>
                  Czas realizacji zamówienia wynosi od 1 do 3 dni roboczych od momentu 
                  zaksięgowania płatności (nie dotyczy płatności za pobraniem). W przypadku 
                  produktów oznaczonych jako „na zamówienie" czas realizacji może być dłuższy.
                </p>
                <p>
                  Kupujący jest informowany o wysyłce zamówienia drogą elektroniczną wraz 
                  z numerem przesyłki umożliwiającym śledzenie paczki.
                </p>
              </div>
            </section>

            {/* Withdrawal */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">5. Prawo odstąpienia od umowy</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie 
                  14 dni bez podania jakiejkolwiek przyczyny.
                </p>
                <p>
                  Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia, 
                  w którym Konsument wszedł w posiadanie rzeczy lub w którym osoba 
                  trzecia inna niż przewoźnik i wskazana przez Konsumenta weszła w 
                  posiadanie rzeczy.
                </p>
                <p>
                  Aby skorzystać z prawa odstąpienia od umowy, należy poinformować nas 
                  o swojej decyzji drogą elektroniczną na adres: zwroty@galaxysklep.pl 
                  lub pisemnie na adres siedziby.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-semibold mb-1">Prawo odstąpienia nie przysługuje w przypadku:</p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Produktów wykonanych na specjalne zamówienie</li>
                        <li>Produktów ulegających szybkiemu zepsuciu</li>
                        <li>Produktów dostarczonych w zapieczętowanym opakowaniu, których po otwarciu nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych</li>
                        <li>Nagrań dźwiękowych, wizualnych oraz programów komputerowych dostarczonych w zapieczętowanym opakowaniu, jeżeli opakowanie zostało otwarte</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Rights and Defects */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">6. Reklamacje i gwarancja</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Sprzedawca odpowiada wobec Kupującego będącego konsumentem za wady 
                  fizyczne i prawne towaru (rękojmia) na zasadach określonych w Kodeksie 
                  cywilnym, w szczególności w art. 556 i następnych.
                </p>
                <p>
                  Reklamację można złożyć:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Elektronicznie na adres: reklamacje@galaxysklep.pl</li>
                  <li>Pisemnie na adres: Galaxy Sklep, 1. máje 535/50, 46007 Liberec, Czechy</li>
                  <li>Telefonicznie: +420 123 456 789</li>
                </ul>
                <p>
                  Sprzedawca ustosunkuje się do reklamacji w terminie 14 dni od dnia 
                  jej otrzymania. Jeżeli Sprzedawca nie ustosunkuje się do reklamacji 
                  w tym terminie, uważa się, że uznał reklamację za uzasadnioną.
                </p>
                <p>
                  Niektóre produkty objęte są dodatkowo gwarancją producenta. Warunki 
                  gwarancji określa gwarant i są one dołączane do produktu.
                </p>
              </div>
            </section>

            {/* Personal Data */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">7. Ochrona danych osobowych</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Administratorem danych osobowych Kupujących jest Galaxy Sklep. 
                  Dane osobowe są przetwarzane zgodnie z Rozporządzeniem Parlamentu 
                  Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).
                </p>
                <p>
                  Szczegółowe informacje dotyczące przetwarzania danych osobowych 
                  znajdują się w Polityce Prywatności dostępnej pod adresem 
                  galaxysklep.pl/polityka-prywatnosci.
                </p>
              </div>
            </section>

            {/* Final Provisions */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-black">8. Postanowienia końcowe</h2>
              </div>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają 
                  przepisy prawa polskiego, w szczególności Kodeksu cywilnego oraz 
                  ustawy o prawach konsumenta.
                </p>
                <p>
                  Sprzedawca zastrzega sobie prawo do zmiany Regulaminu. Zmiany wchodzą 
                  w życie z dniem ich publikacji na stronie sklepu. Do zamówień złożonych 
                  przed zmianą Regulaminu stosuje się postanowienia obowiązujące w dniu 
                  złożenia zamówienia.
                </p>
                <p>
                  Ewentualne spory będą rozstrzygane przez sąd właściwy dla siedziby 
                  Sprzedawcy lub sąd właściwy dla miejsca zamieszkania Konsumenta, 
                  według wyboru Konsumenta.
                </p>
                <p className="font-semibold">
                  Niniejszy Regulamin obowiązuje od dnia 1 stycznia 2025 roku.
                </p>
              </div>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 text-center">
                W przypadku pytań prosimy o kontakt: support@galaxysklep.pl lub +420 123 456 789
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}