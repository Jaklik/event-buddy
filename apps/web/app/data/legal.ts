/**
 * Working drafts of the legal documents from the SelfPlan 2.0 legal pack (01-04).
 * Fields marked [DOPLNIT] are intentionally unresolved and must be completed and legally reviewed before launch.
 */
export interface LegalDoc { title: string; note: string; sections: { heading: string; paragraphs: string[] }[] }
export const legal: Record<string, LegalDoc> = {
  "obchodni-podminky": {
    "title": "Obchodní podmínky SelfPlan 2.0",
    "note": "Pracovní návrh pro český portál; doplnit označená pole a právně ověřit.",
    "sections": [
      {
        "heading": "1. Provozovatel a působnost",
        "paragraphs": [
          "Event Buddy s.r.o., IČO 22029052, Školská 660/3, Praha 1 (dále „Provozovatel“).",
          "Kontaktní e-mail: [DOPLNIT]; web: [DOPLNIT přesnou doménu]. Tyto podmínky upravují využívání české verze SelfPlan, nikoli budoucí slovenskou verzi. Účinné od: [DOPLNIT]."
        ]
      },
      {
        "heading": "2. Povaha služeb",
        "paragraphs": [
          "SelfPlan nabízí vyhledávání a prezentaci dodavatelů, poptávky a komunikaci, plánovač akcí, obsahovou poradnu, inspiraci, bazar, placenou reklamu, vlastní eventové weby a vlastní koordinační či konzultační služby.",
          "U vztahů zákazník–nezávislý dodavatel nebo uživatel–prodejce bazaru SelfPlan zpravidla není stranou jejich smlouvy; u výslovně objednaných služeb SelfPlanu je naopak přímým poskytovatelem. Zákonná odpovědnost Provozovatele není tímto ustanovením vyloučena."
        ]
      },
      {
        "heading": "3. Registrace a účty",
        "paragraphs": [
          "Obsah, katalog a vybrané nástroje lze používat bez účtu; trvalé ukládání vyžaduje registraci. Registrace e-mailem a heslem nebo podporovaným Google přihlášením; ověření e-mailu před poptávkami a publikováním. Jeden účet může spravovat neomezený počet dodavatelských profilů; zveřejnění dodavatelského profilu podléhá schválení.",
          "Uživatel musí uvádět pravdivé údaje, chránit přístupové údaje a nesmí vytvářet falešné nebo automatizované účty. Provozovatel může při podezření na porušení pravidel přiměřeně omezit účet s odůvodněním a dostupným postupem přezkumu."
        ]
      },
      {
        "heading": "4. Katalog, poptávky a CRM",
        "paragraphs": [
          "Dodavatel odpovídá za správnost svého profilu, oprávnění podnikat, nabídku a smluvní závazky. Kalendář veřejně zobrazuje pouze dostupnost bez údajů o zákaznících či zakázkách. Interní CRM slouží k evidenci poptávek a zakázek; jeho základní funkce jsou při spuštění zdarma.",
          "Poptávka ani zobrazení profilu automaticky nezakládá smlouvu se SelfPlanem ani s dodavatelem. Jakákoli budoucí provize z běžné dodavatelské zakázky vyžaduje samostatné sjednání; v této verzi se neuplatňuje."
        ]
      },
      {
        "heading": "5. Reklama a zvýraznění",
        "paragraphs": [
          "Reklamní a sponzorované pozice jsou placené, musí být zřetelně označené a objednávají se za aktuálně zveřejněných podmínek a cen. Žádost o reklamu podléhá schválení Provozovatelem; platba převodem a ruční potvrzení.",
          "Konkrétní reklamní pozice, kapacity, 30denní období, zaváděcí ceny do 31. 5. 2027 a standardní ceny od 1. 6. 2027 určuje samostatný ceník tvořící součást objednávky. Cena potvrzené kampaně se jednostranně zpětně nemění. Podmínky storna a okamžiku zahájení plnění: [DOPLNIT]."
        ]
      },
      {
        "heading": "6. Eventový bazar",
        "paragraphs": [
          "Bazar zprostředkovává zveřejnění inzerátů; prodej a platba probíhají mezi prodávajícím a kupujícím mimo portál. Prodávající musí pravdivě popsat věc, vlastnictví a stav, nesmí nabízet zakázané či protiprávní položky. Je povinen uvést, zda jedná jako podnikatel, pokud to funkce vyžaduje.",
          "Běžný inzerát je zdarma na 60 dní. Sedm dní před koncem přijde e-mailové upozornění; prodloužení o dalších 60 dní je zdarma. Po expiraci následuje neveřejný archiv 30 dní a poté odstranění, s výjimkou údajů nutných k zákonné obraně nebo evidenci. Placené zvýraznění podléhá samostatnému ceníku."
        ]
      },
      {
        "heading": "7. Inspirace, fotografie, recenze a obsah",
        "paragraphs": [
          "Uživatel zveřejňuje jen obsah, k němuž má potřebná práva a oprávnění, včetně práv a souhlasů dotčených osob tam, kde jsou vyžadovány. Provozovateli poskytuje nevýhradní, bezúplatné oprávnění obsah technicky hostovat, zobrazovat a přiměřeně upravovat pro fungování služby po dobu jeho zveřejnění; širší marketingové využití vyžaduje zvláštní titul.",
          "Fotografie v Inspiraci se mohou zveřejnit automaticky po bezpečnostních kontrolách a následně moderovat. AI snímky se označují a filtrují odděleně. Recenze musí odrážet skutečnou zkušenost, včetně komunikace; upravená zveřejněná recenze může znovu podléhat schválení. Způsob ověřování recenzí musí být veřejně vysvětlen."
        ]
      },
      {
        "heading": "8. Plánovač a eventové weby",
        "paragraphs": [
          "Plánovač a veřejné kalkulačky lze používat bez registrace; neuložená data se mohou po ukončení relace ztratit. Organizátor eventového webu odpovídá za správnost obsahu, informování hostů a oprávnění zveřejňovat jejich fotografie či osobní údaje. Seznam hostů není veřejný.",
          "Eventový web lze předplatbou vytvořit a prohlížet; ukládání vyžaduje účet. Cena 490 Kč jednorázově za 12 měsíců provozu [POTVRDIT počátek období, rozsah a obnovování]. Ve výchozím stavu jde o neveřejný odkaz; není to však náhrada řízení přístupu. Fotografie od hostů přes QR mají ve výchozím stavu ruční schvalování. RSVP může být přes veřejný formulář nebo individuální odkazy. SelfPlan nerozesílá pozvánky jménem organizátora."
        ]
      },
      {
        "heading": "9. Koordinace a konzultace",
        "paragraphs": [
          "SelfPlan může přímo poskytovat koordinaci obřadu, svatebního dne, kompletní plánování, konzultace a koordinaci dalších akcí. Konkrétní rozsah, termín, cena, storno a náklady se sjednávají individuální nabídkou či potvrzenou objednávkou.",
          "Konzultace mohou trvat 30 nebo 60 minut a hradí se předem. Doprava do 30 minut jízdy z Přelouče je v ceně, delší doprava individuálně; při nutném přenocování hradí ubytování klient podle předchozí dohody. Externí koordinátor může být přidělen interně; před uzavřením smlouvy musí být zřejmé, kdo je poskytovatelem služby."
        ]
      },
      {
        "heading": "10. Spotřebitelská práva a platby",
        "paragraphs": [
          "Před každou placenou objednávkou se zobrazí identita poskytovatele, celková cena, rozsah, doba plnění, způsob platby, případné opakování a podmínky odstoupení. Spotřebitel má práva podle kogentních předpisů; jejich omezení pouhou větou v podmínkách není možné.",
          "U digitálních služeb a obsahu nelze automaticky vyloučit čtrnáctidenní odstoupení. Případný souhlas se zahájením plnění před uplynutím lhůty a potvrzení důsledků musí být zajištěny samostatně a pouze v zákonem přípustných případech. Reklamace: [DOPLNIT kontakt, postup, lhůty]. Mimosoudní řešení spotřebitelských sporů: Česká obchodní inspekce, www.coi.cz."
        ]
      },
      {
        "heading": "11. Moderace a stížnosti",
        "paragraphs": [
          "Protiprávní obsah lze oznámit přes [DOPLNIT elektronický formulář/e-mail]. Oznámení se vyhodnotí a případné omezení obsahu či účtu bude odůvodněno, s postupem pro napadení rozhodnutí v rozsahu požadovaném použitelným právem. Pravidla se uplatňují objektivně a přiměřeně."
        ]
      },
      {
        "heading": "12. Změny, ukončení, právo",
        "paragraphs": [
          "Uživatel může požádat o zrušení účtu nebo využít samoobslužné odstranění; právně povinně uchovávané údaje mohou zůstat po zákonnou dobu. Změny podmínek se oznámí přiměřeně předem; placené sjednané závazky se nemění jednostranně v neprospěch zákazníka bez právního důvodu. Použije se české právo, aniž jsou dotčena neodnětelná spotřebitelská práva."
        ]
      }
    ]
  },
  "ochrana-osobnich-udaju": {
    "title": "Zásady ochrany osobních údajů",
    "note": "Pracovní informační dokument podle čl. 13–14 GDPR.",
    "sections": [
      {
        "heading": "1. Správce a kontakt",
        "paragraphs": [
          "Event Buddy s.r.o., IČO 22029052, Školská 660/3, Praha 1 (dále „Provozovatel“).",
          "Kontakt pro ochranu údajů: [DOPLNIT e-mail]. Pověřenec pro ochranu osobních údajů: [UVÉST pouze pokud je ustanoven]."
        ]
      },
      {
        "heading": "2. Kategorie údajů",
        "paragraphs": [
          "Identifikační a kontaktní údaje uživatelů a dodavatelů; přihlašovací identifikátory a zabezpečené autentizační údaje; profily, fotografie, recenze, zprávy, poptávky, objednávky a fakturační data; technické a bezpečnostní logy; údaje o souhlasech a nastavení cookies.",
          "Plánovač může obsahovat informace o akcích, rozpočtech a hostech. Eventové weby a RSVP mohou obsahovat jména hostů, účast, odpovědi a fotografie. Dodavatelské CRM může obsahovat kontakty jeho klientů. Citlivé údaje se nemají vyžadovat, pokud to není nezbytné; volné texty mohou takové údaje přesto obsahovat."
        ]
      },
      {
        "heading": "3. Účely a právní základy",
        "paragraphs": [
          "Plnění smlouvy: účty, poptávky, zprávy, plánovač, eventové weby, objednávky a koordinace (čl. 6 odst. 1 písm. b GDPR), pokud jde o smluvní vztah se subjektem údajů.",
          "Právní povinnost: účetnictví, daně a vyřízení zákonných požadavků (písm. c). Oprávněný zájem: zabezpečení, prevence podvodů, technický provoz, přiměřená obrana práv, moderace a nezbytná komunikace (písm. f), vždy s posouzením proporcionality.",
          "Souhlas: dobrovolný newsletter, volitelné analytické/marketingové cookies a jiné operace, kde je vyžadován (písm. a). Souhlas lze odvolat bez vlivu na předchozí zákonnost. Samotné přijetí obchodních podmínek není souhlas s GDPR."
        ]
      },
      {
        "heading": "4. Role u hostů a CRM",
        "paragraphs": [
          "U osobních údajů hostů eventového webu a kontaktů klientů dodavatelů je třeba před spuštěním přesně rozdělit role správce a zpracovatele podle skutečného rozhodování o účelech a prostředcích. Pokud SelfPlan jedná jako zpracovatel organizátora/dodavatele, musí existovat odpovídající smlouva dle čl. 28 GDPR, případně elektronicky přijatý dodatek.",
          "Provozovatel je samostatným správcem údajů, které zpracovává pro vlastní účty, zabezpečení, fakturaci a provoz platformy."
        ]
      },
      {
        "heading": "5. Příjemci a předávání",
        "paragraphs": [
          "Údaje mohou být zpřístupněny poskytovatelům hostingu, e-mailů, autentizace, analytiky, platebních služeb a technické podpory v nezbytném rozsahu. Konkrétní poskytovatelé a jejich sídla: [DOPLNIT podle skutečné infrastruktury].",
          "Předávání mimo EHP je nutné identifikovat pro každého poskytovatele a doložit příslušný mechanismus, například rozhodnutí o odpovídající ochraně nebo standardní smluvní doložky s doplňkovým posouzením."
        ]
      },
      {
        "heading": "6. Doby uchování",
        "paragraphs": [
          "Účet: po dobu existence a poté jen po nezbytnou dobu pro obranu práv a povinnou evidenci [UPŘESNIT]. Poptávky a zprávy: [STANOVIT retenční plán]. Faktury: podle příslušných účetních a daňových předpisů. Bezpečnostní logy: [STANOVIT].",
          "Inzerát bazaru: 60 dní aktivní, 30 dní archiv po expiraci, poté smazání veřejného obsahu a běžných dat, pokud není další zákonný důvod. Eventový web a galerie: [STANOVIT odstranění po 12 měsících, upozornění a případné exporty]. Cookies: podle tabulky cookies a zvolených nastavení. Zálohy: [STANOVIT rotaci a obnovu]."
        ]
      },
      {
        "heading": "7. Práva subjektů",
        "paragraphs": [
          "Právo na přístup, opravu, výmaz, omezení, přenositelnost, námitku a odvolání souhlasu v zákonných mezích. Žádosti lze zaslat na [DOPLNIT]. Odpověď zpravidla do jednoho měsíce, s případným zákonným prodloužením.",
          "Stížnost lze podat u Úřadu pro ochranu osobních údajů, www.uoou.gov.cz. Automatizované rozhodování s právními či obdobně významnými účinky: [OVĚŘIT a popsat, pokud existuje]."
        ]
      },
      {
        "heading": "8. Veřejnost a zabezpečení",
        "paragraphs": [
          "Dodavatelské profily, recenze, inzeráty a schválené fotografie jsou veřejné a mohou být indexovány. Soukromé plánovače, CRM, zprávy, seznamy hostů a neveřejné eventové weby se nesmějí indexovat a musí být chráněny řízením přístupu. Neindexování samo o sobě není bezpečnostní opatření.",
          "Používáme přiměřená technická a organizační opatření: řízení přístupů, šifrování přenosu, omezení oprávnění, logování a zálohování [KONKRÉTNĚ OVĚŘIT]."
        ]
      },
      {
        "heading": "9. Změny",
        "paragraphs": [
          "Aktuální verze dokumentu bude dostupná na webu, s datem účinnosti a informováním o podstatných změnách."
        ]
      }
    ]
  },
  "cookies": {
    "title": "Zásady používání cookies",
    "note": "Pracovní text; zveřejnit až po skutečném skenu cookies a integrací.",
    "sections": [
      {
        "heading": "1. Co jsou cookies",
        "paragraphs": [
          "Cookies a obdobné technologie ukládají či čtou informace ze zařízení. SelfPlan je používá pouze v rozsahu popsaném níže. Provozovatel: Event Buddy s.r.o., IČO 22029052, Školská 660/3, Praha 1 (dále „Provozovatel“)."
        ]
      },
      {
        "heading": "2. Kategorie",
        "paragraphs": [
          "Nezbytné: přihlášení, bezpečnost, ochrana před boty, uložení volby cookies a fungování objednávek; pokud jsou skutečně nezbytné, nevyžadují předchozí souhlas.",
          "Analytické: měření návštěvnosti a výkonu, pokud nesplňuje úzkou zákonnou výjimku, až po souhlasu. Marketingové a personalizační: reklamní měření, remarketing, externí trackery a volitelné integrace až po souhlasu.",
          "Přesný název, poskytovatel, účel, expirace a kategorie každého cookie nebo obdobné technologie: [DOPLNIT po technickém auditu]."
        ]
      },
      {
        "heading": "3. Volba návštěvníka",
        "paragraphs": [
          "Při první návštěvě nabídnout srovnatelně dostupné možnosti „Přijmout vše“, „Odmítnout volitelné“ a „Nastavení“. Volitelné kategorie jsou ve výchozím stavu vypnuté. Neudělení souhlasu nesmí blokovat základní funkce webu.",
          "Souhlas musí být informovaný, konkrétní a prokazatelný. Lze jej kdykoli změnit přes trvale dostupný odkaz „Nastavení cookies“ v patičce; odvolání musí být stejně snadné jako udělení."
        ]
      },
      {
        "heading": "4. Externí obsah",
        "paragraphs": [
          "Vložená videa, mapy, sociální sítě, Google přihlášení a další služby vyžadují individuální kontrolu technického chování. Netechnické trackery se nesmějí spouštět před platným souhlasem."
        ]
      },
      {
        "heading": "5. Uchovávání voleb a kontakt",
        "paragraphs": [
          "Evidence souhlasu: verze lišty, čas, zvolené kategorie a technický identifikátor v minimalizovaném rozsahu. Doba uchování: [STANOVIT]. Kontakt: [DOPLNIT]. Datum účinnosti: [DOPLNIT]."
        ]
      }
    ]
  },
  "pravidla-obsahu": {
    "title": "Pravidla obsahu, recenzí a moderace",
    "note": "Samostatný dokument navazující na obchodní podmínky.",
    "sections": [
      {
        "heading": "1. Povolený obsah",
        "paragraphs": [
          "Povoleny jsou pravdivé nabídky, relevantní fotografie a recenze založené na reálné zkušenosti. Zakázány jsou podvody, neoprávněné osobní údaje, zásahy do práv třetích osob, nezákonné zboží, spam, klamavé nabídky a manipulace hodnocení."
        ]
      },
      {
        "heading": "2. Recenze",
        "paragraphs": [
          "Recenzi lze přidat i na komunikaci před objednávkou, pokud je zkušenost pravdivá. SelfPlan musí na stránce vysvětlit, zda a jak ověřuje, že hodnocení pochází od skutečných zákazníků; nelze bez ověření tvrdit, že všechny recenze jsou ověřené.",
          "Při úpravě zveřejněné recenze se upravená verze vrací ke schválení; původní verzi lze interně uchovat pouze po odůvodněnou dobu. Negativní recenze se nesmějí automaticky potlačovat jen kvůli hodnocení."
        ]
      },
      {
        "heading": "3. Fotografie a AI",
        "paragraphs": [
          "Nahrávající potvrzuje potřebná práva a oprávnění. U fotografií osob musí respektovat jejich soukromí a zákonné podmínky zveřejnění. AI obrázky musí být viditelně označené a dostupné ve zvláštním filtru."
        ]
      },
      {
        "heading": "4. Nahlášení a rozhodnutí",
        "paragraphs": [
          "Oznamovací kanál: [DOPLNIT]. Formulář umožní uvést konkrétní URL, důvod, popis a kontakt v potřebném rozsahu. Oznámení posuzuje odpovědná osoba a zaznamenává důvody rozhodnutí.",
          "Při odstranění, omezení dosahu nebo blokaci je dotčená osoba informována o důvodech a možnostech přezkumu podle použitelného právního režimu. Lhůty, kontaktní místo DSA, případný interní systém stížností a transparentní reporty: [OVĚŘIT dle klasifikace služby a výjimek]."
        ]
      }
    ]
  }
}
