import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regulamin - Galaxy Sklep',
  description: 'Regulamin sklepu internetowego Galaxy Sklep - warunki sprzedaży, zwroty, reklamacje',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Regulamin</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-center font-bold mb-4">Polityka prywatności</p>
        
        <div className="text-center mb-6">
          <p><strong>Nazwa firmy:</strong> Galaxy Sklep</p>
          <p><strong>Adres:</strong> 1. máje 535/50, 46007 Liberec, Czechy</p>
          <p><strong>NIP:</strong> 04688465</p>
          <p><strong>Forma prawna:</strong> Działalność gospodarcza</p>
          <p><strong>Email:</strong> <a href="mailto:support@galaxysklep.pl" className="text-blue-600 hover:underline">support@galaxysklep.pl</a></p>
          <p className="mt-2 text-sm italic">(Siedziba firmy - korespondencja prosimy wysyłać na e-mail)</p>
        </div>

        <p className="text-center mb-6">
          dla sprzedaży towarów za pośrednictwem sklepu internetowego dostępnego pod adresem internetowym www.galaxysklep.pl
        </p>

        <ol className="list-decimal space-y-6">
          <li>
            <strong>POSTANOWIENIA WSTĘPNE</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Niniejszy regulamin (dalej jako „<strong>regulamin</strong>") Galaxy Sklep z siedzibą przy ul. 1. máje 535/50, 46007 Liberec, Czechy, NIP: 04688465 (dalej jako „<strong>sprzedawca</strong>") reguluje zgodnie z przepisami prawa polskiego wzajemne prawa i obowiązki stron umowy powstałe w związku lub na podstawie umowy sprzedaży (dalej jako „<strong>umowa sprzedaży</strong>") zawieranej między sprzedawcą a inną osobą fizyczną (dalej jako „<strong>kupujący</strong>") za pośrednictwem sklepu internetowego sprzedawcy. Sklep internetowy jest prowadzony przez sprzedawcę na stronie internetowej dostępnej pod adresem www.galaxysklep.pl (dalej jako „<strong>strona internetowa</strong>"), za pośrednictwem interfejsu strony internetowej (dalej jako „<strong>interfejs sklepu internetowego</strong>").
              </li>
              <li>
                Regulamin nie ma zastosowania w przypadkach, gdy osoba zamierzająca nabyć towar od sprzedawcy jest osobą prawną lub osobą, która składa zamówienie w ramach swojej działalności gospodarczej lub w ramach samodzielnego wykonywania zawodu.
              </li>
              <li>
                Postanowienia odbiegające od regulaminu mogą zostać uzgodnione w umowie sprzedaży. Odmienne uzgodnienia w umowie sprzedaży mają pierwszeństwo przed postanowieniami regulaminu.
              </li>
              <li>
                Postanowienia regulaminu stanowią integralną część umowy sprzedaży. Umowa sprzedaży i regulamin są sporządzone w języku polskim. Umowę sprzedaży można zawrzeć w języku polskim.
              </li>
              <li>
                Treść regulaminu może być zmieniana lub uzupełniana przez sprzedawcę. Niniejsze postanowienie nie narusza praw i obowiązków powstałych w okresie obowiązywania poprzedniej wersji regulaminu.
              </li>
            </ol>
          </li>

          <li>
            <strong>KONTO UŻYTKOWNIKA</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Na podstawie rejestracji kupującego dokonanej na stronie internetowej, kupujący może uzyskać dostęp do swojego interfejsu użytkownika. Ze swojego interfejsu użytkownika kupujący może składać zamówienia na towary (dalej jako „<strong>konto użytkownika</strong>"). Jeśli interfejs sklepu internetowego to umożliwia, kupujący może składać zamówienia na towary także bez rejestracji bezpośrednio z interfejsu sklepu internetowego.
              </li>
              <li>
                Przy rejestracji na stronie internetowej oraz przy składaniu zamówienia kupujący jest zobowiązany podać poprawnie i zgodnie z prawdą wszystkie dane. Dane podane na koncie użytkownika kupujący jest zobowiązany aktualizować przy każdej ich zmianie. Dane podane przez kupującego na koncie użytkownika i przy składaniu zamówienia są przez sprzedawcę uznawane za prawidłowe.
              </li>
              <li>
                Dostęp do konta użytkownika jest zabezpieczony nazwą użytkownika i hasłem. Kupujący jest zobowiązany zachować poufność informacji niezbędnych do uzyskania dostępu do jego konta użytkownika.
              </li>
              <li>
                Kupujący nie jest uprawniony do udostępniania korzystania z konta użytkownika osobom trzecim.
              </li>
              <li>
                Sprzedawca może usunąć konto użytkownika, w szczególności w przypadku, gdy kupujący nie korzysta ze swojego konta użytkownika dłużej niż rok lub w przypadku, gdy kupujący naruszy swoje obowiązki wynikające z umowy sprzedaży (w tym regulaminu).
              </li>
              <li>
                Kupujący przyjmuje do wiadomości, że konto użytkownika może być niedostępne w sposób ciągły, w szczególności ze względu na niezbędną konserwację sprzętu i oprogramowania sprzedawcy lub niezbędną konserwację sprzętu i oprogramowania osób trzecich.
              </li>
            </ol>
          </li>

          <li>
            <strong>ZAWARCIE UMOWY SPRZEDAŻY</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Cała prezentacja towarów umieszczona w interfejsie sklepu internetowego ma charakter informacyjny i sprzedawca nie jest zobowiązany do zawarcia umowy sprzedaży dotyczącej tego towaru.
              </li>
              <li>
                Interfejs sklepu internetowego zawiera informacje o towarach, w tym podanie cen poszczególnych towarów i kosztów zwrotu towaru, jeśli towar ten ze swojej natury nie może być zwrócony zwykłą drogą pocztową. Ceny towarów są podane z podatkiem od towarów i usług (VAT) oraz wszystkimi powiązanymi opłatami. Ceny towarów pozostają w mocy przez okres, w którym są wyświetlane w interfejsie sklepu internetowego. Niniejsze postanowienie nie ogranicza możliwości sprzedawcy do zawarcia umowy sprzedaży na indywidualnie uzgodnionych warunkach.
              </li>
              <li>
                Interfejs sklepu internetowego zawiera również informacje o kosztach związanych z pakowaniem i dostawą towarów oraz o sposobie i czasie dostawy towarów. Informacje o kosztach związanych z pakowaniem i dostawą towarów podane w interfejsie sklepu internetowego obowiązują tylko w przypadkach, gdy towar jest dostarczany na terytorium Rzeczypospolitej Polskiej.
              </li>
              <li>
                W celu zamówienia towaru kupujący wypełnia formularz zamówienia w interfejsie sklepu internetowego. Formularz zamówienia zawiera w szczególności informacje o:
                <ul className="list-disc ml-6 mt-2">
                  <li>zamawianym towarze (zamawiany towar kupujący „umieszcza" w elektronicznym koszyku zakupowym interfejsu sklepu internetowego),</li>
                  <li>sposobie zapłaty ceny zakupu towaru, dane o wymaganym sposobie dostawy zamawianego towaru oraz</li>
                  <li>informacje o kosztach związanych z dostawą towaru (dalej łącznie jako „<strong>zamówienie</strong>").</li>
                </ul>
              </li>
              <li>
                Przed wysłaniem zamówienia do sprzedawcy kupujący może sprawdzić i zmienić dane wprowadzone do zamówienia, również w odniesieniu do możliwości wykrywania i poprawiania błędów powstałych przy wprowadzaniu danych do zamówienia. Kupujący wysyła zamówienie sprzedawcy poprzez kliknięcie przycisku „Zamów z obowiązkiem zapłaty". Dane podane w zamówieniu są przez sprzedawcę uznawane za prawidłowe. Sprzedawca niezwłocznie po otrzymaniu zamówienia potwierdza jego otrzymanie kupującemu pocztą elektroniczną na adres poczty elektronicznej kupującego podany na koncie użytkownika lub w zamówieniu (dalej jako „<strong>adres elektroniczny kupującego</strong>").
              </li>
              <li>
                Sprzedawca jest zawsze uprawniony, w zależności od charakteru zamówienia (ilość towaru, wysokość ceny zakupu, przewidywane koszty transportu), poprosić kupującego o dodatkowe potwierdzenie zamówienia (na przykład pisemnie lub telefonicznie).
              </li>
              <li>
                Stosunek umowny między sprzedawcą a kupującym powstaje z chwilą doręczenia przyjęcia zamówienia (akceptacji), które jest wysyłane przez sprzedawcę kupującemu pocztą elektroniczną na adres poczty elektronicznej kupującego.
              </li>
              <li>
                Kupujący wyraża zgodę na użycie środków komunikacji na odległość przy zawieraniu umowy sprzedaży. Koszty poniesione przez kupującego przy korzystaniu ze środków komunikacji na odległość w związku z zawarciem umowy sprzedaży (koszty połączenia internetowego, koszty rozmów telefonicznych) ponosi sam kupujący, przy czym koszty te nie różnią się od stawki podstawowej.
              </li>
            </ol>
          </li>

          <li>
            <strong>CENA TOWARU I WARUNKI PŁATNOŚCI</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Cenę towaru i ewentualne koszty związane z dostawą towaru zgodnie z umową sprzedaży kupujący może uiścić sprzedawcy w następujący sposób:
                <ul className="list-disc ml-6 mt-2">
                  <li>gotówką przy odbiorze w miejscu określonym przez kupującego w zamówieniu;</li>
                  <li>bezgotówkowo przelewem na rachunek sprzedawcy IBAN: PL21 2910 0006 2469 8002 0883 7403, BIC/SWIFT: BMPBPLPP, prowadzony w Aion S.A. Spolka Akcyjna Oddzial w Polsce, Dobra 40, 00-344, Warszawa, Poland (dalej jako „<strong>rachunek sprzedawcy</strong>");</li>
                  <li>bezgotówkowo za pośrednictwem systemu płatności;</li>
                  <li>bezgotówkowo kartą płatniczą;</li>
                  <li>gotówką lub kartą płatniczą przy odbiorze osobistym w punkcie odbioru;</li>
                  <li>za pośrednictwem kredytu udzielonego przez osobę trzecią.</li>
                </ul>
              </li>
              <li>
                Przy wyborze płatności po odbiorze (płatność na fakturę) klient jest zobowiązany zapłacić kwotę wskazaną na fakturze w terminie płatności, który standardowo wynosi <strong>14 dni</strong> od daty wystawienia faktury, chyba że uzgodniono inaczej. W przypadku niedotrzymania tego terminu sprzedawca ma prawo do odsetek za opóźnienie w wysokości ustawowej oraz do kary umownej w wysokości 10% należnej kwoty.
              </li>
              <li>
                Klient jest ponadto zobowiązany pokryć wszelkie koszty związane z windykacją należnej kwoty, w tym opłaty prawne i opłaty za usługi windykacyjne. Sprzedawca zastrzega sobie prawo do wstrzymania dalszych dostaw towarów lub usług do czasu pełnej spłaty należnej kwoty wraz z odsetkami i karą umowną.
              </li>
              <li>
                Wraz z ceną zakupu kupujący jest zobowiązany zapłacić sprzedawcy również koszty związane z pakowaniem i dostawą towaru w uzgodnionej wysokości. O ile nie wskazano wyraźnie inaczej, przez cenę zakupu rozumie się również koszty związane z dostawą towaru.
              </li>
              <li>
                Sprzedawca nie wymaga od kupującego zaliczki ani innej podobnej płatności. Nie narusza to postanowień art. 4.6 regulaminu dotyczących obowiązku zapłaty ceny zakupu towaru z góry.
              </li>
              <li>
                W przypadku płatności gotówką, za pobraniem lub w punkcie odbioru cena zakupu jest płatna przy odbiorze towaru. W przypadku płatności bezgotówkowej cena zakupu jest płatna w ciągu 14 dni od zawarcia umowy sprzedaży.
              </li>
              <li>
                W przypadku płatności bezgotówkowej kupujący jest zobowiązany uiścić cenę zakupu towaru wraz z podaniem symbolu zmiennego płatności. W przypadku płatności bezgotówkowej zobowiązanie kupującego do zapłaty ceny zakupu jest spełnione w momencie uznania odpowiedniej kwoty na rachunku sprzedawcy.
              </li>
              <li>
                Sprzedawca jest uprawniony, w szczególności w przypadku braku dodatkowego potwierdzenia zamówienia przez kupującego (art. 3.6), żądać zapłaty całej ceny zakupu przed wysłaniem towaru do kupującego.
              </li>
              <li>
                Ewentualne rabaty cenowe udzielone przez sprzedawcę kupującemu nie mogą być łączone.
              </li>
              <li>
                Jeśli jest to zwyczajowe w obrocie handlowym lub jeśli tak stanowią powszechnie obowiązujące przepisy prawa, sprzedawca wystawi kupującemu dokument podatkowy - fakturę dotyczącą płatności dokonywanych na podstawie umowy sprzedaży. Sprzedawca jest płatnikiem podatku od towarów i usług. Dokument podatkowy - fakturę sprzedawca wystawi kupującemu po zapłaceniu ceny towaru i prześle go w formie elektronicznej na elektroniczny adres kupującego.
              </li>
            </ol>
          </li>

          <li>
            <strong>ODSTĄPIENIE OD UMOWY SPRZEDAŻY</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Kupujący przyjmuje do wiadomości, że zgodnie z przepisami prawa nie można między innymi odstąpić od umowy sprzedaży:
                <ul className="list-disc ml-6 mt-2">
                  <li>o dostarczenie towaru wyprodukowanego zgodnie z wymaganiami kupującego lub dostosowanego do jego osobistych potrzeb,</li>
                  <li>o dostarczenie towaru, który ulega szybkiemu zepsuciu, lub towaru o krótkim terminie przydatności, a także towaru, który po dostawie ze względu na swój charakter został nieodwracalnie zmieszany z innym towarem,</li>
                  <li>o dostarczenie towaru w zapieczętowanym opakowaniu, którego po naruszeniu plomb nie można zwrócić ze względów ochrony zdrowia lub ze względów higienicznych,</li>
                  <li>o dostarczenie nagrań dźwiękowych lub wizualnych albo programów komputerowych w zapieczętowanym opakowaniu, jeżeli kupujący naruszył plomby.</li>
                </ul>
              </li>
              <li>
                Jeśli nie chodzi o przypadek wymieniony w art. 5.1 regulaminu lub o inny przypadek, gdy nie można odstąpić od umowy sprzedaży, kupujący ma prawo odstąpić od umowy sprzedaży w ciągu czternastu (14) dni od dnia, w którym kupujący lub wskazana przez niego osoba trzecia inna niż przewoźnik odbierze towar.
              </li>
              <li>
                Odstąpienie od umowy sprzedaży musi zostać wysłane sprzedawcy w terminie określonym w art. 5.2 regulaminu. Do odstąpienia od umowy sprzedaży kupujący może wykorzystać wzór formularza dostarczony przez sprzedawcę. Odstąpienie od umowy sprzedaży kupujący może wysłać między innymi na adres siedziby sprzedawcy lub na adres poczty elektronicznej sprzedawcy support@galaxysklep.pl.
              </li>
              <li>
                W przypadku odstąpienia od umowy sprzedaży umowa sprzedaży zostaje rozwiązana od początku. Towar kupujący odeśle lub przekaże sprzedawcy z powrotem bez zbędnej zwłoki, najpóźniej w ciągu czternastu (14) dni od odstąpienia od umowy, chyba że sprzedawca zaproponował, że sam odbierze towar. Termin zgodnie z poprzednim zdaniem jest zachowany, jeśli kupujący wyśle towar przed jego upływem. Jeśli kupujący odstąpi od umowy sprzedaży, ponosi koszty związane ze zwrotem towaru sprzedawcy, również w przypadku, gdy towar ze względu na swój charakter nie może być zwrócony zwykłą drogą pocztową.
              </li>
              <li>
                W przypadku odstąpienia od umowy sprzedaży zgodnie z art. 5.2 regulaminu sprzedawca zwróci środki pieniężne otrzymane od kupującego w ciągu czternastu (14) dni od odstąpienia od umowy sprzedaży przez kupującego, w taki sam sposób, w jaki sprzedawca je od kupującego otrzymał. Sprzedawca jest również uprawniony do zwrotu świadczenia udzielonego przez kupującego już przy zwrocie towaru przez kupującego lub w inny sposób, jeśli kupujący wyrazi na to zgodę i nie powstaną przez to kupującemu dodatkowe koszty. Jeśli kupujący odstąpi od umowy sprzedaży, sprzedawca nie jest zobowiązany zwrócić otrzymanych środków pieniężnych kupującemu wcześniej, niż sprzedawca otrzyma towar lub niż kupujący udowodni, że odesłał towar, w zależności od tego, co nastąpi wcześniej.
              </li>
              <li>
                Roszczenie o naprawienie szkody powstałej na towarze sprzedawca jest uprawniony jednostronnie potrącić z roszczenia kupującego o zwrot ceny zakupu.
              </li>
              <li>
                W przypadkach, gdy kupujący ma prawo odstąpić od umowy sprzedaży, sprzedawca jest również uprawniony odstąpić od umowy sprzedaży w dowolnym momencie, aż do czasu odbioru towaru przez kupującego. W takim przypadku sprzedawca zwróci kupującemu cenę zakupu bez zbędnej zwłoki, bezgotówkowo na rachunek wskazany przez kupującego.
              </li>
              <li>
                Jeśli wraz z towarem kupującemu został przekazany prezent, umowa darowizny między sprzedawcą a kupującym jest zawarta z warunkiem rozwiązującym, że w przypadku odstąpienia od umowy sprzedaży przez kupującego umowa darowizny dotycząca takiego prezentu traci ważność, a kupujący jest zobowiązany wraz z towarem zwrócić sprzedawcy również otrzymany prezent.
              </li>
            </ol>
          </li>

          <li>
            <strong>TRANSPORT I DOSTAWA TOWARU</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                W przypadku, gdy sposób transportu został uzgodniony na podstawie specjalnego żądania kupującego, kupujący ponosi ryzyko i ewentualne dodatkowe koszty związane z tym sposobem transportu.
              </li>
              <li>
                Jeśli sprzedawca zgodnie z umową sprzedaży jest zobowiązany dostarczyć towar w miejsce określone przez kupującego w zamówieniu, kupujący jest zobowiązany odebrać towar przy dostawie.
              </li>
              <li>
                W przypadku, gdy z przyczyn leżących po stronie kupującego konieczne jest dostarczanie towaru wielokrotnie lub w inny sposób niż określono w zamówieniu, kupujący jest zobowiązany pokryć koszty związane z wielokrotnym dostarczaniem towaru lub koszty związane z innym sposobem dostawy.
              </li>
              <li>
                Przy odbiorze towaru od przewoźnika kupujący jest zobowiązany sprawdzić nienaruszalność opakowań towaru, a w przypadku jakichkolwiek wad niezwłocznie powiadomić o tym przewoźnika. W przypadku stwierdzenia naruszenia opakowania świadczącego o nieuprawnionej ingerencji w przesyłkę, kupujący nie musi odbierać przesyłki od przewoźnika. Nie narusza to praw kupującego z tytułu odpowiedzialności za wady towaru i innych praw kupującego wynikających z powszechnie obowiązujących przepisów prawa.
              </li>
              <li>
                Dalsze prawa i obowiązki stron przy transporcie towaru mogą regulować specjalne warunki dostawy sprzedawcy, jeśli zostały przez sprzedawcę wydane.
              </li>
            </ol>
          </li>

          <li>
            <strong>PRAWA Z WADLIWEGO WYKONANIA</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Prawa i obowiązki stron umowy dotyczące praw z wadliwego wykonania regulują odpowiednie powszechnie obowiązujące przepisy prawa (w szczególności przepisy Kodeksu cywilnego i ustawy o prawach konsumenta).
              </li>
              <li>
                Sprzedawca odpowiada wobec kupującego, że rzecz przy odbiorze nie ma wad. W szczególności sprzedawca odpowiada wobec kupującego, że rzecz:
                <ul className="list-disc ml-6 mt-2">
                  <li>odpowiada uzgodnionemu opisowi, rodzajowi i ilości, a także jakości, funkcjonalności, kompatybilności, interoperacyjności i innym uzgodnionym właściwościom,</li>
                  <li>nadaje się do celu, dla którego kupujący ją wymaga i z którym sprzedawca się zgodził,</li>
                  <li>jest dostarczona z uzgodnionym wyposażeniem i instrukcjami użytkowania, w tym instrukcją montażu lub instalacji.</li>
                </ul>
              </li>
              <li>
                Sprzedawca odpowiada wobec kupującego również za to, że oprócz uzgodnionych właściwości:
                <ul className="list-disc ml-6 mt-2">
                  <li>rzecz nadaje się do celu, do którego rzecz tego rodzaju jest zwykle używana, również z uwzględnieniem praw osób trzecich, przepisów prawa, norm technicznych lub kodeksów postępowania danej branży, jeśli nie ma norm technicznych,</li>
                  <li>rzecz ilością, jakością i innymi właściwościami, w tym trwałością, funkcjonalnością, kompatybilnością i bezpieczeństwem, odpowiada zwykłym właściwościom rzeczy tego samego rodzaju, których kupujący może rozsądnie oczekiwać, również z uwzględnieniem publicznych oświadczeń złożonych przez sprzedawcę lub inną osobę w tym samym łańcuchu umownym, w szczególności reklamą lub oznakowaniem,</li>
                  <li>rzecz jest dostarczona z wyposażeniem, w tym opakowaniem, instrukcją montażu i innymi instrukcjami użytkowania, których kupujący może rozsądnie oczekiwać,</li>
                  <li>rzecz odpowiada jakością lub wykonaniem próbce lub wzorowi, które sprzedawca udostępnił kupującemu przed zawarciem umowy sprzedaży.</li>
                </ul>
              </li>
              <li>
                Jeśli wada ujawni się w ciągu dwóch lat od odbioru, uważa się, że rzecz była wadliwa już przy odbiorze.
              </li>
              <li>
                Kupujący może zgłosić wadę, która ujawni się na rzeczy w ciągu dwóch lat od odbioru.
              </li>
              <li>
                Jeśli rzecz ma wadę, kupujący może żądać jej usunięcia. Według swojego wyboru może żądać dostarczenia nowej rzeczy bez wady lub naprawy rzeczy, chyba że wybrany sposób usunięcia wady jest niemożliwy lub w porównaniu z drugim nieproporcjonalnie kosztowny. Sprzedawca może odmówić usunięcia wady, jeśli jest to niemożliwe lub nieproporcjonalnie kosztowne, szczególnie z uwzględnieniem znaczenia wady i wartości, jaką rzecz miałaby bez wady.
              </li>
              <li>
                Sprzedawca usunie wadę w rozsądnym czasie po jej zgłoszeniu, tak aby nie sprawić kupującemu znacznych trudności, przy czym uwzględnia się charakter rzeczy i cel, dla którego kupujący rzecz nabył. W celu usunięcia wady sprzedawca odbierze rzecz na własny koszt.
              </li>
              <li>
                Kupujący może żądać odpowiedniej obniżki ceny lub odstąpić od umowy sprzedaży, jeśli:
                <ul className="list-disc ml-6 mt-2">
                  <li>sprzedawca odmówił usunięcia wady lub jej nie usunął,</li>
                  <li>wada ujawnia się ponownie,</li>
                  <li>wada stanowi istotne naruszenie umowy sprzedaży,</li>
                  <li>z oświadczenia sprzedawcy lub z okoliczności wynika, że wada nie zostanie usunięta w rozsądnym czasie lub bez znacznych trudności dla kupującego.</li>
                </ul>
              </li>
              <li>
                Jeśli wada rzeczy jest nieistotna, kupujący nie może odstąpić od umowy sprzedaży. Jeśli kupujący odstąpi od umowy sprzedaży, sprzedawca zwróci kupującemu cenę zakupu bez zbędnej zwłoki po otrzymaniu rzeczy lub po tym, jak kupujący udowodni, że rzecz odesłał.
              </li>
              <li>
                Wadę można zgłosić sprzedawcy, u którego rzecz została zakupiona.
              </li>
              <li>
                Reklamacja wraz z usunięciem wady musi być rozpatrzona, a kupujący musi być o tym poinformowany najpóźniej w ciągu trzydziestu (30) dni od dnia złożenia reklamacji, chyba że sprzedawca z kupującym uzgodni dłuższy termin.
              </li>
              <li>
                Prawa z tytułu odpowiedzialności za wady towaru kupujący może w szczególności zgłaszać pocztą elektroniczną na adres support@galaxysklep.pl.
              </li>
              <li>
                Dalsze prawa i obowiązki stron związane z odpowiedzialnością sprzedawcy za wady może regulować reklamacyjny regulamin sprzedawcy.
              </li>
            </ol>
          </li>

          <li>
            <strong>INNE PRAWA I OBOWIĄZKI STRON UMOWY</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Kupujący nabywa własność towaru poprzez zapłacenie całej ceny zakupu towaru.
              </li>
              <li>
                Sprzedawca nie jest związany żadnymi kodeksami postępowania w stosunku do kupującego.
              </li>
              <li>
                Rozpatrywanie skarg konsumentów zapewnia sprzedawca za pośrednictwem poczty elektronicznej. Skargi można przesyłać na adres elektroniczny sprzedawcy. Informację o rozpatrzeniu skargi kupującego sprzedawca prześle na adres elektroniczny kupującego.
              </li>
              <li>
                Do pozasądowego rozstrzygania sporów konsumenckich z umowy sprzedaży właściwy jest Wojewódzki Inspektorat Inspekcji Handlowej. Platformę do rozstrzygania sporów online znajdującą się pod adresem internetowym http://ec.europa.eu/consumers/odr można wykorzystać przy rozstrzyganiu sporów między sprzedawcą a kupującym z umowy sprzedaży.
              </li>
              <li>
                Europejskie Centrum Konsumenckie Polska jest punktem kontaktowym zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) nr 524/2013 z dnia 21 maja 2013 r. w sprawie internetowego systemu rozstrzygania sporów konsumenckich oraz zmiany rozporządzenia (WE) nr 2006/2004 i dyrektywy 2009/22/WE.
              </li>
              <li>
                Kupujący może zwrócić się ze skargą do organu nadzoru lub kontroli państwowej. Sprzedawca jest uprawniony do sprzedaży towarów na podstawie zezwolenia na prowadzenie działalności gospodarczej. Kontrolę działalności gospodarczej przeprowadza w ramach swoich kompetencji właściwy organ. Nadzór nad obszarem ochrony danych osobowych sprawuje Urząd Ochrony Danych Osobowych. Inspekcja Handlowa sprawuje w określonym zakresie między innymi nadzór nad przestrzeganiem przepisów o ochronie konsumentów.
              </li>
              <li>
                Kupujący niniejszym przyjmuje na siebie ryzyko zmiany okoliczności.
              </li>
            </ol>
          </li>

          <li>
            <strong>OCHRONA DANYCH OSOBOWYCH</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Swój obowiązek informacyjny wobec kupującego w rozumieniu art. 13 Rozporządzenia Parlamentu Europejskiego i Rady 2016/679 w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) (dalej jako „<strong>RODO</strong>") związany z przetwarzaniem danych osobowych kupującego w celu realizacji umowy sprzedaży, w celu negocjacji w sprawie umowy sprzedaży oraz w celu wypełnienia obowiązków publicznoprawnych sprzedawcy, sprzedawca wypełnia za pośrednictwem odrębnego dokumentu.
              </li>
            </ol>
          </li>

          <li>
            <strong>PRZESYŁANIE KOMUNIKATÓW HANDLOWYCH I ZAPISYWANIE PLIKÓW COOKIES</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Kupujący wyraża zgodę na przesyłanie komunikatów handlowych przez sprzedawcę na adres elektroniczny lub numer telefonu kupującego. Swój obowiązek informacyjny wobec kupującego w rozumieniu art. 13 RODO związany z przetwarzaniem danych osobowych kupującego w celu przesyłania komunikatów handlowych sprzedawca wypełnia za pośrednictwem odrębnego dokumentu.
              </li>
              <li>
                Swoje ustawowe obowiązki związane z ewentualnym zapisywaniem plików cookies na urządzeniu kupującego sprzedawca wypełnia za pośrednictwem odrębnego dokumentu.
              </li>
            </ol>
          </li>

          <li>
            <strong>DORĘCZANIE</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Kupującemu można doręczać na adres elektroniczny kupującego.
              </li>
            </ol>
          </li>

          <li>
            <strong>POSTANOWIENIA KOŃCOWE</strong>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                Jeśli stosunek założony umową sprzedaży zawiera element międzynarodowy (zagraniczny), strony uzgadniają, że stosunek ten rządzi się prawem polskim. Wyborem prawa zgodnie z poprzednim zdaniem kupujący, który jest konsumentem, nie jest pozbawiony ochrony, jaką zapewniają mu przepisy prawne, od których nie można odstąpić umownie.
              </li>
              <li>
                Jeśli jakiekolwiek postanowienie regulaminu jest nieważne lub nieskuteczne lub stanie się takim, zamiast nieważnych postanowień wejdzie postanowienie, którego sens najbardziej zbliża się do nieważnego postanowienia. Nieważność lub nieskuteczność jednego postanowienia nie wpływa na ważność pozostałych postanowień.
              </li>
              <li>
                Umowa sprzedaży wraz z regulaminem jest archiwizowana przez sprzedawcę w formie elektronicznej i nie jest dostępna.
              </li>
              <li>
                Załącznik do regulaminu stanowi wzór formularza odstąpienia od umowy sprzedaży.
              </li>
              <li>
                Dane kontaktowe sprzedawcy: adres siedziby 1. máje 535/50, 46007 Liberec, Czechy (siedziba firmy - korespondencja prosimy wysyłać na e-mail), adres poczty elektronicznej support@galaxysklep.pl. Sprzedawca nie udostępnia innego środka komunikacji online.
              </li>
            </ol>
          </li>
        </ol>

        <p className="text-center mt-8">
          W Libercu dnia {new Date().toLocaleDateString('pl-PL')}
        </p>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Dane bankowe</h2>
          <p><strong>Numer konta:</strong> 21291000062469800208837403</p>
          <p><strong>IBAN:</strong> PL21 2910 0006 2469 8002 0883 7403</p>
          <p><strong>BIC/SWIFT:</strong> BMPBPLPP</p>
          <p><strong>Bank:</strong> Aion S.A. Spolka Akcyjna Oddzial w Polsce</p>
          <p><strong>Adres banku:</strong> Dobra 40, 00-344, Warszawa, Poland</p>
        </div>
      </div>
    </div>
  )
}