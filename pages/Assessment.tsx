import React, { useState } from 'react';
import { 
  Landmark, 
  PiggyBank, 
  Telescope, 
  Users, 
  Layers, 
  Leaf, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface InsightData {
  id: string;
  title: string;
  payoff: string;
  description: React.ReactNode;
  icon: any;
  color: string;
  borderColor: string;
  bgGradient: string;
  lightBg: string;
}

const INSIGHTS: InsightData[] = [
  {
    id: 'financial',
    title: 'Financial Control & Liquidity',
    payoff: 'Anticipiamo tensioni finanziarie e rafforziamo il profilo verso banche e investitori.',
    icon: Landmark,
    color: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    lightBg: 'bg-emerald-50/50',
    description: (
      <div className="space-y-5 text-slate-700 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
        <p>
          Questa area ti dà una visione chiara e anticipata della tua tenuta finanziaria. 
          Non ci limitiamo a leggere i numeri a consuntivo, ma analizziamo flussi di incasso e pagamento, struttura dei costi e impegni finanziari per capire <strong className="font-bold text-emerald-800">se e quando potresti andare in tensione di cassa</strong>.
        </p>
        <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl space-y-3">
          <p>Valutiamo la sostenibilità del tuo modello economico, individuiamo clienti o condizioni commerciali che erodono liquidità e simuliamo scenari realistici (ritardi di incasso, perdita di un cliente chiave, aumento dei costi).</p>
          <p>In parallelo, analizziamo come la tua azienda viene "letta" dalle banche, individuando criticità che impattano su rating, affidamenti e costo del credito.</p>
        </div>
        <p className="font-medium text-emerald-900 border-l-4 border-emerald-500 pl-4 py-1 italic bg-white/50 rounded-r-lg">
          Il risultato è una mappa chiara dei rischi finanziari e delle leve su cui intervenire per migliorare liquidità, stabilità e credibilità bancaria, prima che il problema diventi urgente.
        </p>
      </div>
    )
  },
  {
    id: 'incentives',
    title: 'Incentives & Opportunities',
    payoff: 'Recuperiamo risorse economiche da attività e investimenti che stai già sostenendo.',
    icon: PiggyBank,
    color: 'text-amber-700',
    borderColor: 'border-amber-200',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-amber-100',
    lightBg: 'bg-amber-50/50',
    description: (
      <div className="space-y-5 text-slate-700 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
        <p>
          Analizziamo in modo strutturato l’operatività e i piani dell’azienda per individuare tutte le forme di incentivo realmente accessibili, evitando approcci sporadici o legati al singolo bando.
        </p>
        <div className="p-4 bg-amber-50/80 border border-amber-100 rounded-xl">
          <p className="mb-3 font-semibold text-amber-900">Interveniamo su più ambiti, spesso gestiti separatamente o ignorati:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {['Innovazione e sviluppo di prodotti', 'Assunzioni e costo del lavoro', 'Formazione tecnica e digitale', 'Investimenti produttivi', 'Marchi, brevetti e asset', 'Iniziative sociali e ambientali'].map((item, i) => (
              <li key={i} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mb-2">Per ciascun ambito verifichiamo i requisiti effettivi, stimiamo il beneficio economico e segnaliamo eventuali vincoli o mancanze che ne limitano l’accesso.</p>
        <p className="font-medium text-amber-900 border-l-4 border-amber-500 pl-4 py-1 italic bg-white/50 rounded-r-lg">
          Il risultato è una visione ordinata e continuativa delle opportunità economiche, che permette all’azienda di recuperare risorse e pianificare investimenti senza disperdere tempo o assumere rischi inutili.
        </p>
      </div>
    )
  },
  {
    id: 'market',
    title: 'Market Growth Scenarios',
    payoff: 'Ti aiutiamo a capire dove competere e come crescere, prima di investire.',
    icon: Telescope,
    color: 'text-violet-700',
    borderColor: 'border-violet-200',
    bgGradient: 'bg-gradient-to-br from-violet-50 to-violet-100',
    lightBg: 'bg-violet-50/50',
    description: (
      <div className="space-y-5 text-slate-700 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
        <p>
          Questa area serve a prendere decisioni di crescita <strong className="font-bold text-violet-800">con cognizione di causa</strong>. 
          Analizziamo il tuo posizionamento attuale, il contesto competitivo e l’evoluzione del mercato per capire dove stai realmente competendo oggi e dove potresti competere domani.
        </p>
        <div className="p-4 bg-violet-50/80 border border-violet-100 rounded-xl">
          <p>
            Monitoriamo i competitor, individuiamo segnali di cambiamento (nuove offerte, nuovi player, variazioni di prezzo, mercati emergenti) e valutiamo se esistono opportunità di espansione, anche all’estero, coerenti con il tuo prodotto e con la tua struttura di costi.
          </p>
        </div>
        <p>
          Non forniamo "idee astratte", ma scenari realistici: mercati più promettenti, canali più adatti, condizioni minime di sostenibilità economica.
        </p>
        <p className="font-medium text-violet-900 border-l-4 border-violet-500 pl-4 py-1 italic bg-white/50 rounded-r-lg">
          Il risultato è una base solida per le decisioni strategiche, che riduce il rischio di investimenti guidati solo dall’intuizione.
        </p>
      </div>
    )
  },
  {
    id: 'risk',
    title: 'Client & Supplier Risk',
    payoff: 'Misuriamo quanto il tuo business dipende da pochi clienti o fornitori critici.',
    icon: Users,
    color: 'text-rose-700',
    borderColor: 'border-rose-200',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-rose-100',
    lightBg: 'bg-rose-50/50',
    description: (
      <div className="space-y-5 text-slate-700 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
        <p>
          In questa area analizziamo la solidità del tuo portafoglio clienti e fornitori per capire se esistono <strong className="font-bold text-rose-800">dipendenze pericolose</strong> che mettono a rischio la continuità aziendale.
        </p>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 bg-white rounded-lg border border-rose-100 shadow-sm">
            <h5 className="font-bold text-rose-800 text-sm uppercase mb-1">Analisi Clienti</h5>
            <p className="text-sm">Valutiamo quanto fatturato è concentrato su pochi clienti, come si comportano nei pagamenti e cosa succederebbe se uno di questi venisse meno.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-100 shadow-sm">
            <h5 className="font-bold text-rose-800 text-sm uppercase mb-1">Analisi Fornitori</h5>
            <p className="text-sm">Allo stesso modo analizziamo i fornitori critici, verificando esposizioni, rischi operativi e possibili colli di bottiglia.</p>
          </div>
        </div>
        <p>
          Non ci limitiamo a segnalare la concentrazione: simuliamo l’impatto reale sul margine e sulla struttura dei costi in caso di perdita o rallentamento di una relazione chiave.
        </p>
        <p className="font-medium text-rose-900 border-l-4 border-rose-500 pl-4 py-1 italic bg-white/50 rounded-r-lg">
          Il risultato è una misurazione oggettiva del rischio commerciale e operativo, utile sia per decisioni interne sia per dialogare con banche e investitori.
        </p>
      </div>
    )
  },
  {
    id: 'digital',
    title: 'Digital Stack & Governance',
    payoff: 'Razionalizziamo il tuo ecosistema digitale eliminando sprechi e ridondanze.',
    icon: Layers,
    color: 'text-blue-700',
    borderColor: 'border-blue-200',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
    lightBg: 'bg-blue-50/50',
    description: (
      <div className="space-y-5 text-slate-700 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
        <p>
          Questa area mette ordine nel tuo insieme di strumenti digitali. 
          Analizziamo software, piattaforme e servizi utilizzati in azienda per capire cosa è davvero utile, cosa è ridondante e cosa genera costi senza valore.
        </p>
        <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-xl">
          <p className="mb-2">Individuiamo licenze non utilizzate, sovrapposizioni funzionali, rinnovi automatici non governati e situazioni di "caos digitale" che aumentano costi e inefficienze operative.</p>
        </div>
        <p>
          Il nostro obiettivo non è cambiare strumenti, ma <strong className="font-bold text-blue-800">razionalizzare e governare</strong> quelli esistenti, migliorando controllo, efficienza e prevedibilità dei costi.
        </p>
        <p className="font-medium text-blue-900 border-l-4 border-blue-500 pl-4 py-1 italic bg-white/50 rounded-r-lg">
          Il risultato è una struttura digitale più semplice, sostenibile e coerente con le reali esigenze dell’azienda.
        </p>
      </div>
    )
  },
  {
    id: 'esg',
    title: 'ESG & Compliance Readiness',
    payoff: 'Trasformiamo compliance e sostenibilità in un vantaggio competitivo concreto.',
    icon: Leaf,
    color: 'text-teal-700',
    borderColor: 'border-teal-200',
    bgGradient: 'bg-gradient-to-br from-teal-50 to-teal-100',
    lightBg: 'bg-teal-50/50',
    description: (
      <div className="space-y-5 text-slate-700 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
        <p>
          In questa area valutiamo se la tua azienda è pronta ad affrontare le richieste crescenti su sostenibilità, compliance normativa e requisiti di filiera, <strong className="font-bold text-teal-800">senza subirle</strong>.
        </p>
        <div className="p-4 bg-teal-50/80 border border-teal-100 rounded-xl">
          <p>
            Analizziamo consumi energetici, gestione ambientale, governance, sicurezza, welfare e documentazione obbligatoria per capire se esistono rischi di non conformità, esclusione da clienti strategici o peggioramento dell’accesso al credito.
          </p>
        </div>
        <p>
          Valutiamo anche come questi elementi possono diventare leve economiche: migliori condizioni bancarie, accesso a bandi dedicati, rafforzamento della posizione come fornitore qualificato.
        </p>
        <p className="font-medium text-teal-900 border-l-4 border-teal-500 pl-4 py-1 italic bg-white/50 rounded-r-lg">
          Il risultato è una mappa chiara del livello di readiness dell’azienda e delle azioni prioritarie per trasformare obblighi normativi in opportunità concrete.
        </p>
      </div>
    )
  }
];

export const Assessment = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="pb-20 relative animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Assessment & Insight</h1>
          <p className="text-slate-500 mt-3 text-lg max-w-3xl leading-relaxed">
            I risultati strategici elaborati dal tuo Digital Twin. 
            Esplora le 6 aree chiave per scoprire rischi latenti e opportunità di crescita immediate.
          </p>
        </div>

        {/* Accordion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            const isExpanded = expandedId === insight.id;

            return (
              <div
                key={insight.id}
                className={`relative bg-white rounded-3xl text-left border shadow-sm transition-all duration-500 overflow-hidden flex flex-col ${
                  isExpanded 
                    ? `row-span-2 ${insight.borderColor} ring-4 ring-opacity-20 ${insight.borderColor.replace('border', 'ring')} shadow-xl z-10` 
                    : 'border-slate-100 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Subtle top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${insight.bgGradient.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}></div>

                {/* Main Card Clickable Area */}
                <button 
                  onClick={() => toggleCard(insight.id)}
                  className="p-8 w-full text-left outline-none"
                >
                  {/* Header with Icon and Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${insight.bgGradient} ${insight.color} transition-transform duration-300 ${!isExpanded && 'group-hover:scale-110'} shadow-sm shrink-0`}>
                      <Icon size={28} />
                    </div>
                    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-colors ${
                      isExpanded 
                        ? `${insight.lightBg} ${insight.color} ${insight.borderColor}`
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {isExpanded ? 'Active' : 'Report Ready'}
                    </div>
                  </div>

                  {/* Visible Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className={`text-xl font-extrabold mb-4 transition-colors leading-tight break-words ${isExpanded ? 'text-slate-900' : 'text-slate-800'}`}>
                      {insight.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {insight.payoff}
                    </p>
                  </div>

                  {/* Toggle Action Label */}
                  <div className={`mt-6 pt-6 border-t flex items-center text-sm font-bold transition-colors ${isExpanded ? `${insight.color} border-slate-200` : 'text-slate-300 border-slate-50'}`}>
                    <span>{isExpanded ? 'Chiudi Analisi' : 'Esplora Analisi'}</span>
                    <div className={`ml-auto transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                       {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                </button>

                {/* Expanded Content (Accordion) */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`p-8 pt-0 border-t border-slate-100 ${insight.lightBg.replace('/50', '/30')}`}>
                    <div className="pt-6">
                      {insight.description}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};