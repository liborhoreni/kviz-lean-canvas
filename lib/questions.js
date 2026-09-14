// Otázky pro kvíz o Lean Canvasu.
// `correct` = index správné odpovědi v poli `choices`.
// `confidence` je moje interní poznámka pro Libora (high/medium/low) – u medium/low
// stojí za to si odpověď před ostrým během kurzu ověřit. Hráčům se nikde nezobrazuje.

export const TIME_LIMIT_MS = 15000;
export const COUNTDOWN_MS = 3000;
export const REVEAL_AUTO_MS = 5000;

export const QUESTIONS = [
  // ZÁKAZNÍK
  {
    topic: 'Zákazník',
    q: 'Prodáváte klimatizace do letadel. Kdo je vaším zákazníkem?',
    choices: ['Cestující', 'Výrobce letadla', 'Letecká společnost'],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Zákazník',
    q: 'Prodáváte školení obchodních dovedností pro zaměstnance. Kdo je vaším uživatelem?',
    choices: ['Majitel firmy', 'Zaměstnanec', 'Majitel budovy'],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Zákazník',
    q: 'Koho byste si měli vybrat za první vlaštovky (early adopters)?',
    choices: [
      'Zákazníky, kteří problém pociťují nejsilněji a zároveň k nim mám nejlepší přístup',
      'Co nejširší skupinu lidí, ať je trh od začátku co největší',
      'Zákazníky, kteří počkají, až bude produkt hotový a dokonalý, a pak si ho rádi koupí',
    ],
    correct: 0,
    confidence: 'high',
  },

  // PROBLÉM
  {
    topic: 'Problém',
    q: 'Proč potřebujete zjistit, které problémy jsou pro zákazníky skutečně závažné?',
    choices: [
      'Abyste věděli, co máte řešit jako první.',
      'Abyste dali najevo, že se o ně zajímáte, a pak jim snadněji prodali cokoliv, co vyrobíte.',
      'Abyste se dokázali tvářit přesvědčivěji, že váš produkt jejich problém opravdu řeší.',
    ],
    correct: 0,
    confidence: 'high',
  },
  {
    topic: 'Problém',
    q: 'Co znamená, když zákazník svůj problém sám nijak neřeší?',
    choices: [
      'Je to skvělá příležitost nabídnout mu vaše řešení, protože neví o žádné konkurenci.',
      'Riziko, že mu neprodáte své řešení.',
      'Že už řešení našel.',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Problém',
    q: 'K čemu slouží v Lean Canvas sekce problém?',
    choices: [
      'Správně si definuji problém, a už ho nemusím ověřovat u zákazníků.',
      'K pochopení zákazníka a nalezení konkurence.',
      'Cílem je přesvědčit zákazníka, že má problém.',
    ],
    correct: 1,
    confidence: 'high',
  },

  // ŘEŠENÍ
  {
    topic: 'Řešení',
    q: 'Na co byste se měli při přípravě vašeho produktu či služby zaměřit?',
    choices: [
      'Na nalezení kvalitního řešení vašeho problému.',
      'Řešení těch problémů zákazníků a uživatelů, kterým rozumíte nejvíce.',
      'Řešení nejvážnějších problémů zákazníků a uživatelů.',
    ],
    correct: 2,
    confidence: 'medium',
  },
  {
    topic: 'Řešení',
    q: 'Co je MVP?',
    choices: [
      'Produkt, u kterého nevadí, že obsahuje spoustu chyb.',
      'Produkt, díky kterému získáte zpětnou vazbu od zákazníků co nejrychleji.',
      'Maximalizace výkonu produktu.',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Řešení',
    q: 'Proč je zamilovanost do vlastního nápadu na produkt či službu nebezpečná?',
    choices: [
      'Můžete strávit čas a peníze tvorbou něčeho, co neřeší ničí problémy a nikdo to nechce.',
      'Nebudete nikdy spokojeni s výsledkem, protože vaše vize nikdy nemůže být naplněna na sto procent.',
      'Jakmile zamilovanost opadne, vzdáte to.',
    ],
    correct: 0,
    confidence: 'high',
  },

  // PŘIDANÁ HODNOTA
  {
    topic: 'Přidaná hodnota',
    q: 'Je pro jeden produkt vždy jen jedna unikátní přidaná hodnota?',
    choices: [
      'Samozřejmě, každý produkt se komunikuje jednotně, je proto nutné, aby všechna sdělení vypadala stejně.',
      'Pro každou skupinu zákazníků je možné přijít s jinou přidanou hodnotou.',
      'Ano, unikátní znamená, že je jedna.',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Přidaná hodnota',
    q: 'Co je srozumitelný opis?',
    choices: [
      'Yoguard – „Jogurty bez éček a přidaných cukrů“',
      'Kidseats – „Skutečně bezpečné dětské sedačky“',
      'Canon C450 – „Usain Bolt mezi tiskárnami“',
    ],
    correct: 2,
    confidence: 'medium',
  },
  {
    topic: 'Přidaná hodnota',
    q: 'Kdy je nejvhodnější použít srozumitelný opis?',
    choices: [
      'Při prvním kontaktu se zákazníkem, abyste rychle vysvětlili, o co jde',
      'Jako hlavní marketingové heslo na vašich webových stránkách',
      'Až když už máte hotový finální produkt',
    ],
    correct: 0,
    confidence: 'high',
  },

  // BUSINESS MODEL
  {
    topic: 'Business model',
    q: 'Jaký je nejvhodnější způsob nastavování ceny vašeho produktu či služby?',
    choices: [
      'Cenu je nutné nastavovat vždy pouze podle toho, jaké máte náklady.',
      'Cenu je většinou vhodné nastavovat podle ceny existujících alternativ k vašemu produktu (službě).',
      'Cenu je nejlepší nastavovat cestou pokusu a omylu.',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Business model',
    q: 'Kolik peněz je vhodné chtít po zákaznících za MVP?',
    choices: [
      'S přihlédnutím k minimální funkčnosti relativně málo, abychom neměli ostudu.',
      'Tolik, kolik budete chtít za finální produkt.',
      'Produkt je vhodné nabízet ze začátku zadarmo.',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Business model',
    q: 'Kdy je vhodné začít za svůj produkt (či službu) vyžadovat od zákazníků peníze?',
    choices: [
      'Co nejdříve. Ideálně již ve formě předobjednávky, i když nemáte vůbec nic reálného v ruce.',
      'Až v okamžiku, kdy máte odladěné všechny detaily svého produktu (či služby).',
      'Primární je získat peníze od investora.',
    ],
    correct: 0,
    confidence: 'high',
  },

  // CESTY K ZÁKAZNÍKŮM
  {
    topic: 'Cesty k zákazníkům',
    q: 'Příkladem škálovatelného produktu je:',
    choices: ['2,5 l Kofola', 'Návrh domu od architekta', 'Videokurz obchodních dovedností'],
    correct: 2,
    confidence: 'medium',
  },
  {
    topic: 'Cesty k zákazníkům',
    q: 'Co lze získat chozením na konference, výstavy a networkingové akce?',
    choices: [
      'Nic, je to ztráta času. Lepší je pracovat na produktu.',
      'Osobní kontakt s potenciální cílovou skupinou.',
      'Jídlo zdarma.',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Cesty k zákazníkům',
    q: 'První vlaštovky jste získali přímým oslovením zákazníků a osobním kontaktem s nimi. Je tato cesta vhodná k získání řádově většího počtu zákazníků?',
    choices: [
      'Ne, tento způsob je zpravidla velmi drahý.',
      'Ano, osobní kontakt je nejlepší.',
      'Ano, mám tisíce kamarádů na Facebooku.',
    ],
    correct: 0,
    confidence: 'high',
  },

  // INDIKÁTORY
  {
    topic: 'Indikátory',
    q: 'Co nejlépe odlišuje amatéry od profíků?',
    note: 'Pozor, tahle je trošku tricky – víc odpovědí zní rozumně, vyber tu nejlepší.',
    choices: [
      'Profík vždy diverzifikuje zdroje příjmů.',
      'Amatér jedná na základě domněnek, profík měří.',
      'Profík analyzuje, vyhodnocuje výsledky a na základě nich upravuje svůj produkt nebo službu.',
    ],
    correct: 2,
    confidence: 'high',
  },
  {
    topic: 'Indikátory',
    q: 'Co by měl každý indikátor vždy obsahovat?',
    choices: [
      'Výchozí hodnotu, konkrétní cílové číslo a termín, kdy ho chcete dosáhnout',
      'Jen odhad, protože přesná čísla stejně nikdy nevyjdou',
      'Srovnání s alespoň pěti konkurenčními firmami',
    ],
    correct: 0,
    confidence: 'high',
  },
  {
    topic: 'Indikátory',
    q: 'Nejlepší příklad indikátoru je:',
    choices: [
      'Letos prodám nejvíce produktů mezi konkurencí.',
      'Mou písničku budou letos hrát rádia.',
      'Premium (placenou) verzi si letos zaplatí minimálně 7 % zákazníků.',
    ],
    correct: 2,
    confidence: 'high',
  },

  // NÁKLADY
  {
    topic: 'Náklady',
    q: 'Co jsou variabilní náklady?',
    choices: ['Paušální platby za telefon.', 'Nákup materiálu použitého na výrobek.', 'Platby s vyplněným variabilním symbolem.'],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Náklady',
    q: 'Co jsou fixní náklady?',
    choices: [
      'Náklady, které rostou s počtem prodaných kusů',
      'Náklady, které nezávisí na objemu výroby, např. nájem prostoru',
      'Náklady, které máte jen jednou za rok',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Náklady',
    q: 'Za jak dlouho dosáhne masér break-even pointu? (Fixní náklady 42 000 Kč, variabilní náklady 50 Kč/zákazník, hodina práce = 800 Kč)',
    choices: ['54 hodin', '56 hodin', '58 hodin'],
    correct: 1,
    confidence: 'high', // ověřeno výpočtem: 42000 / (800-50) = 56
  },

  // NEFÉROVÁ VÝHODA
  {
    topic: 'Neférová výhoda',
    q: 'Co nejčastěji může představovat neférovou výhodu?',
    choices: ['Silná značka', 'Prvenství v uvedení produktu na trh', 'Namotivovaní zaměstnanci'],
    correct: 0,
    confidence: 'low',
  },
  {
    topic: 'Neférová výhoda',
    q: 'Co z toho je skutečně těžké okopírovat, a může tedy jít o neférovou výhodu?',
    choices: [
      'Barvy a slogan na vašich webových stránkách',
      'Specifické know-how vašeho týmu, existující zákazníci nebo komunita',
      'Skvělý nápad na produkt, který vás právě napadl',
    ],
    correct: 1,
    confidence: 'high',
  },
  {
    topic: 'Neférová výhoda',
    q: 'Je patent vždy nejlepší způsob, jak si zajistit neférovou výhodu?',
    choices: [
      'Ano, patent je vždy nejrychlejší a nejlevnější cesta k ochraně nápadu',
      'Ne, právní ochrana bývá drahá, zdlouhavá a úspěch na trhu nezaručí',
      'Ano, bez patentu nemá smysl s podnikáním vůbec začínat',
    ],
    correct: 1,
    confidence: 'high',
  },
];

export const TOPICS = [...new Set(QUESTIONS.map((q) => q.topic))];

export function publicQuestion(index, revealed) {
  const item = QUESTIONS[index];
  if (!item) return null;
  const { topic, q, choices, correct, note } = item;
  return {
    index,
    total: QUESTIONS.length,
    topic,
    topicNumber: TOPICS.indexOf(topic) + 1,
    topicCount: TOPICS.length,
    q,
    note,
    choices,
    correct: revealed ? correct : undefined,
  };
}
