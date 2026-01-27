import React, { useState } from 'react';
import { 
  Landmark, 
  PiggyBank, 
  Telescope, 
  Users, 
  Layers, 
  Leaf, 
  ChevronRight,
  ChevronDown,
  X,
  Maximize2
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
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          Questa area ti dà una visione chiara e anticipata della tua tenuta finanziaria. 
          Non ci limitiamo a leggere i numeri a consuntivo, ma analizziamo flussi di incasso e pagamento, struttura dei costi e impegni finanziari per capire <strong className="font-bold text-emerald-800">se e quando potresti andare in tensione di cassa</strong>.
        </p>
        <div className="p-6 bg-emerald-50/80 border border-emerald-100 rounded-2xl space-y-4 shadow-sm">
          <p>Valutiamo la sostenibilità del tuo modello economico, individuiamo clienti o condizioni commerciali che erodono liquidità e simuliamo scenari realistici (ritardi di incasso, perdita di un cliente chiave, aumento dei costi).</p>
          <p>In parallelo, analizziamo come la tua azienda viene "letta" dalle banche, individuando criticità che impattano su rating, affidamenti e costo del credito.</p>
        </div>
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 border-emerald-500 shadow-sm">
           <div className="font-medium text-emerald-900 italic">
             Il risultato è una mappa chiara dei rischi finanziari e delle leve su cui intervenire per migliorare liquidità, stabilità e credibilità bancaria, prima che il problema diventi urgente.
           </div>
        </div>
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
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          Analizziamo in modo strutturato l’operatività e i piani dell’azienda per individuare tutte le forme di incentivo realmente accessibili, evitando approcci sporadici o legati al singolo bando.
        </p>
        <div className="p-6 bg-amber-50/80 border border-amber-100 rounded-2xl shadow-sm">
          <p className="mb-4 font-bold text-amber-900 text-xl">Interveniamo su più ambiti, spesso ignorati:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
            {['Innovazione e sviluppo di prodotti', 'Assunzioni e costo del lavoro', 'Formazione tecnica e digitale', 'Investimenti produttivi', 'Marchi, brevetti e asset', 'Iniziative sociali e ambientali'].map((item, i) => (
              <li key={i} className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-amber-50">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p>Per ciascun ambito verifichiamo i requisiti effettivi, stimiamo il beneficio economico e segnaliamo eventuali vincoli o mancanze che ne limitano l’accesso.</p>
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 border-amber-500 shadow-sm">
           <div className="font-medium text-amber-900 italic">
            Il risultato è una visione ordinata e continuativa delle opportunità economiche, che permette all’azienda di recuperare risorse e pianificare investimenti senza disperdere tempo o assumere rischi inutili.
           </div>
        </div>
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
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          Questa area serve a prendere decisioni di crescita <strong className="font-bold text-violet-800">con cognizione di causa</strong>. 
          Analizziamo il tuo posizionamento attuale, il contesto competitivo e l’evoluzione del mercato per capire dove stai realmente competendo oggi e dove potresti competere domani.
        </p>
        <div className="p-6 bg-violet-50/80 border border-violet-100 rounded-2xl shadow-sm">
          <p>
            Monitoriamo i competitor, individuiamo segnali di cambiamento (nuove offerte, nuovi player, variazioni di prezzo, mercati emergenti) e valutiamo se esistono opportunità di espansione, anche all’estero, coerenti con il tuo prodotto e con la tua struttura di costi.
          </p>
        </div>
        <p>
          Non forniamo "idee astratte", ma scenari realistici: mercati più promettenti, canali più adatti, condizioni minime di sostenibilità economica.
        </p>
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 border-violet-500 shadow-sm">
           <div className="font-medium text-violet-900 italic">
            Il risultato è una base solida per le decisioni strategiche, che riduce il rischio di investimenti guidati solo dall’intuizione.
           </div>
        </div>
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
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          In questa area analizziamo la solidità del tuo portafoglio clienti e fornitori per capire se esistono <strong className="font-bold text-rose-800">dipendenze pericolose</strong> che mettono a rischio la continuità aziendale.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <h5 className="font-bold text-rose-800 text-base uppercase mb-2">Analisi Clienti</h5>
            <p className="text-base">Valutiamo quanto fatturato è concentrato su pochi clienti, come si comportano nei pagamenti e cosa succederebbe se uno di questi venisse meno.</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <h5 className="font-bold text-rose-800 text-base uppercase mb-2">Analisi Fornitori</h5>
            <p className="text-base">Allo stesso modo analizziamo i fornitori critici, verificando esposizioni, rischi operativi e possibili colli di bottiglia.</p>
          </div>
        </div>
        <p>
          Non ci limitiamo a segnalare la concentrazione: simuliamo l’impatto reale sul margine e sulla struttura dei costi in caso di perdita o rallentamento di una relazione chiave.
        </p>
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 border-rose-500 shadow-sm">
           <div className="font-medium text-rose-900 italic">
            Il risultato è una misurazione oggettiva del rischio commerciale e operativo, utile sia per decisioni interne sia per dialogare con banche e investitori.
           </div>
        </div>
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
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          Questa area mette ordine nel tuo insieme di strumenti digitali. 
          Analizziamo software, piattaforme e servizi utilizzati in azienda per capire cosa è davvero utile, cosa è ridondante e cosa genera costi senza valore.
        </p>
        <div className="p-6 bg-blue-50/80 border border-blue-100 rounded-2xl shadow-sm">
          <p className="mb-0">Individuiamo licenze non utilizzate, sovrapposizioni funzionali, rinnovi automatici non governati e situazioni di "caos digitale" che aumentano costi e inefficienze operative.</p>
        </div>
        <p>
          Il nostro obiettivo non è cambiare strumenti, ma <strong className="font-bold text-blue-800">razionalizzare e governare</strong> quelli esistenti, migliorando controllo, efficienza e prevedibilità dei costi.
        </p>
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 border-blue-500 shadow-sm">
           <div className="font-medium text-blue-900 italic">
            Il risultato è una struttura digitale più semplice, sostenibile e coerente con le reali esigenze dell’azienda.
           </div>
        </div>
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
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        <p>
          In questa area valutiamo se la tua azienda è pronta ad affrontare le richieste crescenti su sostenibilità, compliance normativa e requisiti di filiera, <strong className="font-bold text-teal-800">senza subirle</strong>.
        </p>
        <div className="p-6 bg-teal-50/80 border border-teal-100 rounded-2xl shadow-sm">
          <p>
            Analizziamo consumi energetici, gestione ambientale, governance, sicurezza, welfare e documentazione obbligatoria per capire se esistono rischi di non conformità, esclusione da clienti strategici o peggioramento dell’accesso al credito.
          </p>
        </div>
        <p>
          Valutiamo anche come questi elementi possono diventare leve economiche: migliori condizioni bancarie, accesso a bandi dedicati, rafforzamento della posizione come fornitore qualificato.
        </p>
        <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 border-teal-500 shadow-sm">
           <div className="font-medium text-teal-900 italic">
            Il risultato è una mappa chiara del livello di readiness dell’azienda e delle azioni prioritarie per trasformare obblighi normativi in opportunità concrete.
           </div>
        </div>
      </div>
    )
  }
];

export const Assessment = () => {
  const [activeInsight, setActiveInsight] = useState<InsightData | null>(null);

  const openModal = (insight: InsightData) => {
    setActiveInsight(insight);
  };

  const closeModal = () => {
    setActiveInsight(null);
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

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            
            return (
              <div
                key={insight.id}
                className="relative bg-white rounded-3xl text-left border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full"
              >
                {/* Top Gradient Stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${insight.bgGradient.replace('bg-gradient-to-br', 'bg-gradient-to-r')}`}></div>

                <div className="p-8 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${insight.bgGradient} ${insight.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors">
                    {insight.title}
                  </h3>

                  {/* Payoff */}
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                    {insight.payoff}
                  </p>

                  {/* Action Button */}
                  <button 
                    onClick={() => openModal(insight)}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${insight.lightBg} ${insight.color} hover:shadow-md hover:scale-[1.02]`}
                  >
                    <span>Esplora Analisi</span>
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FULL SCREEN MODAL */}
      {activeInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/40">
            
            {/* Modal Header */}
            <div className={`relative px-8 py-8 md:px-12 md:py-10 ${activeInsight.bgGradient}`}>
               <button 
                 onClick={closeModal}
                 className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
               >
                 <X size={24} />
               </button>

               <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center ${activeInsight.color} shadow-sm`}>
                     <activeInsight.icon size={24} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-white/80 bg-black/10 px-3 py-1 rounded-full border border-white/10">
                    Insight Dettagliato
                  </span>
               </div>
               
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                 {activeInsight.title}
               </h2>
               <p className="text-slate-700 font-medium text-lg mt-2 opacity-90 max-w-2xl">
                 {activeInsight.payoff}
               </p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white">
              <div className="max-w-3xl mx-auto">
                {activeInsight.description}
                
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                  <button 
                    onClick={closeModal}
                    className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Chiudi Scheda
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};