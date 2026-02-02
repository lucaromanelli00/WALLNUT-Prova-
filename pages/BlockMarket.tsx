
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { MarketBlockData, MarketEntity } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { GroupInheritanceBar } from '../components/GroupInheritanceBar';
import { transcribeAudio } from '../services/gemini';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Scale, 
  MessageSquare, 
  Handshake,
  ChevronLeft,
  Save,
  CheckCircle,
  Lock,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Globe,
  Truck
} from 'lucide-react';

// --- CONSTANTS: Question Configurations ---

const QUESTIONS_3_1: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'topTrends', label: "Quali trend di mercato stanno influenzando maggiormente l’azienda ad oggi?" },
  { key: 'trendIdentification', label: "Come vengono identificati i nuovi trend rilevanti per il vostro business?" },
  { key: 'trendToStrategy', label: "In che modo i trend vengono tradotti in scelte strategiche o nuovi servizi?" },
  { key: 'emergingPositioning', label: "Ci sono trend emergenti su cui state iniziando a posizionarvi?" },
  { key: 'earlyTrend', label: "Qual è un trend che siete riusciti a intercettare in anticipo?" },
  { key: 'missedTrend', label: "Qual è invece un trend che, a posteriori, è stato sottovalutato?" },
  { key: 'unservedNeeds', label: "Esistono bisogni emergenti dei clienti che oggi non riuscite ancora a servire?" },
];

const QUESTIONS_3_2: { key: keyof MarketBlockData, label: string }[] = [
  // Competitor list is handled separately with specific feedback
  { key: 'monitoringStrategy', label: "Come viene monitorato il posizionamento competitivo?" },
  { key: 'observedModels', label: "Ci sono aziende o modelli di business che vengono osservati con particolare attenzione?" },
];

const QUESTIONS_3_3: { key: keyof MarketBlockData, label: string }[] = [
  // Customer list is handled separately
  { key: 'idealCustomerPattern', label: "Che pattern comuni vedete nei clienti ideali?" },
  { key: 'targetEvolution', label: "Come è cambiato nel tempo il vostro target?" },
  { key: 'strategicCriteria', label: "Ci sono clienti che considerate “strategici”? In base a quali criteri?" },
  { key: 'growthSegments', label: "Avete segmenti di clienti preferenziali o in crescita?" },
  { key: 'customerRelationship', label: "Che tipo di relazione mantenete con i clienti chiave? (es. partnership)" },
];

const QUESTIONS_3_4_SUPPLIERS: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'suppliersEvolution', label: "Come è cambiato nel tempo il vostro parco fornitori (target)?" },
  { key: 'strategicSuppliers', label: "Ci sono fornitori che considerate “strategici”? In base a quali criteri?" },
  { key: 'supplierRelationships', label: "Che tipo di relazione mantenete con i fornitori chiave?" },
];

const QUESTIONS_3_5: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'impactingRegulations', label: "Quali normative (nazionali, europee o di settore) influenzano direttamente le attività?" },
  { key: 'complianceUpdate', label: "In che modo vi tenete aggiornati sugli aspetti normativi rilevanti?" },
  { key: 'developmentConditioning', label: "Esistono requisiti normativi che condizionano lo sviluppo dei vostri servizi?" },
  { key: 'complianceRoles', label: "Avete figure interne o esterne dedicate alla gestione normativa?" },
  { key: 'recentChanges', label: "Ci sono stati cambiamenti normativi recenti che hanno impattato le scelte strategiche?" },
  { key: 'riskAreas', label: "Quali aree ritenete oggi più esposte a rischio normativo o sanzionatorio?" },
];

const QUESTIONS_3_6: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'feedbackChannels', label: "Dove ricevete oggi feedback esterni (recensioni, social)?" },
  { key: 'feedbackCollection', label: "In che modo raccogliete e archiviate i feedback pubblici?" },
  { key: 'feedbackAnalysis', label: "Come analizzate e interpretate le recensioni per migliorare?" },
  { key: 'negativeResponseStrategy', label: "Avete una strategia di risposta alle recensioni negative? Chi se ne occupa?" },
  { key: 'recurringPerceptions', label: "Quali sono le percezioni esterne più ricorrenti sulla vostra azienda?" },
  { key: 'reputationManagement', label: "Avete mai gestito crisi reputazionali? Come?" },
];

const QUESTIONS_3_7: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'proposalStakeholders', label: "Chi è coinvolto nelle diverse fasi della proposta (negoziazione, firma)?" },
  { key: 'offerTypes', label: "Quali sono i principali tipi di offerta (una tantum, abbonamento, progetto)?" },
  { key: 'newOfferOrigin', label: "Come nascono nuove offerte: input di mercato, sales, opportunità tecniche?" },
  { key: 'valueGenerators', label: "Quali offerte o servizi generano la maggior parte del valore oggi?" },
  { key: 'conversionRate', label: "Qual è il tasso medio di conversione tra offerte inviate e contratti firmati?" },
  { key: 'contractManagement', label: "Come vengono archiviati e gestiti i contratti?" },
  { key: 'pricingStrategy', label: "Come viene definito il pricing? (value-based, cost-based, market-driven)" },
  { key: 'contractStandards', label: "Avete modelli standard di contratto o SLA ricorrenti?" },
  { key: 'strategicPartnerships', label: "Ci sono partnership strategiche o accordi rilevanti? Con chi?" },
  { key: 'satisfactionMonitoring', label: "Come viene monitorata la soddisfazione post-contratto?" },
];

// --- HELPER COMPONENT FOR ENTITY LISTS ---

const EntityListBuilder = ({ 
  items, 
  onAdd, 
  onRemove, 
  placeholderName = "Nome Azienda", 
  placeholderLink = "https://www.azienda.com",
  withFeedback = false,
  feedbackLabel = "",
  feedbackKey = "attractiveness",
  onFeedbackChange
}: { 
  items: MarketEntity[], 
  onAdd: (item: MarketEntity) => void, 
  onRemove: (id: string) => void,
  placeholderName?: string,
  placeholderLink?: string,
  withFeedback?: boolean,
  feedbackLabel?: string | ((name: string) => string),
  feedbackKey?: keyof MarketEntity,
  onFeedbackChange?: (id: string, value: string) => void
}) => {
  const [newName, setNewName] = useState('');
  const [newLink, setNewLink] = useState('');

  const handleAdd = () => {
    if (newName) {
      onAdd({
        id: Date.now().toString(),
        name: newName,
        website: newLink
      });
      setNewName('');
      setNewLink('');
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Aggiungi Elemento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nome Azienda</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
              placeholder={placeholderName}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sito Web (Opzionale)</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-3.5 text-slate-400" />
              <input 
                type="text" 
                className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                placeholder={placeholderLink}
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button 
          onClick={handleAdd}
          disabled={!newName}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
        >
          <Plus size={18} />
          <span>Aggiungi alla lista</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm">
            Nessun elemento aggiunto.
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-bold text-slate-900 text-lg">{item.name}</h5>
                {item.website && <a href={item.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{item.website}</a>}
              </div>
              <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 p-1">
                <Trash2 size={18} />
              </button>
            </div>
            
            {withFeedback && onFeedbackChange && (
              <div className="mt-4 pt-4 border-t border-slate-50">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {typeof feedbackLabel === 'function' ? feedbackLabel(item.name) : feedbackLabel}
                </label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
                  placeholder="Scrivi qui..."
                  value={(item[feedbackKey as keyof MarketEntity] as string) || ''}
                  onChange={(e) => onFeedbackChange(item.id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SHARED COMPONENT FOR TEXT QUESTIONS ---

const QuestionList = ({ title, questions, data, update, icon: Icon, colorClass, children }: { title: string, questions: { key: keyof MarketBlockData, label: string }[], data: MarketBlockData, update: any, icon: any, colorClass: string, children?: React.ReactNode }) => {
  const { saveAudioAnswer, audioAnswers } = useApp();
  const [transcribingKey, setTranscribingKey] = useState<string | null>(null);

  const handleAudioSave = async (key: string, base64: string) => {
    const audioKey = `b3_${key}`;
    saveAudioAnswer(audioKey, base64);
    if (base64) {
      setTranscribingKey(key);
      const text = await transcribeAudio(base64);
      if (text) {
        const currentValue = data[key as keyof MarketBlockData] as string;
        const newText = currentValue ? `${currentValue}\n\n[Trascrizione Audio]: ${text}` : text;
        update({ [key]: newText });
      }
      setTranscribingKey(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>
        
        {children}

        <div className="divide-y divide-slate-100">
          {questions.map((q) => {
            const audioKey = `b3_${q.key}`;
            const isTranscribing = transcribingKey === q.key;

            return (
              <div key={q.key} className="py-6 first:pt-0 last:pb-0 border-0">
                <div className="flex justify-between items-start mb-3">
                  <label className="block text-sm font-semibold text-slate-800 leading-relaxed max-w-[85%]">{q.label}</label>
                  {isTranscribing && (
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
                      <Loader2 size={12} className="animate-spin" />
                      <span>AI Thinking...</span>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <textarea
                    className={`w-full min-h-[100px] p-4 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors mb-3 text-sm text-slate-700 ${isTranscribing ? 'bg-indigo-50/30 border-indigo-200' : 'bg-slate-50 focus:bg-white border-slate-200'}`}
                    placeholder={isTranscribing ? "L'IA sta scrivendo per te..." : "Scrivi qui o registra..."}
                    value={data[q.key as keyof MarketBlockData] as string || ''}
                    onChange={(e) => update({ [q.key]: e.target.value })}
                    disabled={isTranscribing}
                  />
                  {isTranscribing && (
                    <div className="absolute right-4 top-4">
                      <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                    </div>
                  )}
                </div>
                
                <AudioRecorder 
                  id={audioKey}
                  onSave={(base64) => handleAudioSave(q.key, base64)}
                  savedAudio={audioAnswers[audioKey]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export const BlockMarket = () => {
  const navigate = useNavigate();
  const { user, marketData, updateMarketData, updateBlockProgress } = useApp();
  const [activeSection, setActiveSection] = useState<'3.1' | '3.2' | '3.3' | '3.4' | '3.5' | '3.6' | '3.7'>('3.1');

  // Security Check
  if (user && user.role !== 'OWNER' && !user.assignedBlocks.includes(3)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <Lock className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Accesso Negato</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Torna alla Dashboard</button>
      </div>
    );
  }

  // --- Handlers for List Actions ---

  const addCompetitor = (item: MarketEntity) => {
    updateMarketData({ competitors: [...marketData.competitors, item] });
  };
  const removeCompetitor = (id: string) => {
    updateMarketData({ competitors: marketData.competitors.filter(i => i.id !== id) });
  };
  const updateCompetitorFeedback = (id: string, val: string) => {
    const updated = marketData.competitors.map(c => c.id === id ? { ...c, differentiation: val } : c);
    updateMarketData({ competitors: updated });
  };

  const addCustomer = (item: MarketEntity) => {
    updateMarketData({ customers: [...marketData.customers, item] });
  };
  const removeCustomer = (id: string) => {
    updateMarketData({ customers: marketData.customers.filter(i => i.id !== id) });
  };
  const updateCustomerFeedback = (id: string, val: string) => {
    const updated = marketData.customers.map(c => c.id === id ? { ...c, attractiveness: val } : c);
    updateMarketData({ customers: updated });
  };

  const addSupplier = (item: MarketEntity) => {
    updateMarketData({ suppliers: [...marketData.suppliers, item] });
  };
  const removeSupplier = (id: string) => {
    updateMarketData({ suppliers: marketData.suppliers.filter(i => i.id !== id) });
  };

  // Progress Calculation
  const calculateProgress = () => {
    let filledFields = 0;
    const textQuestions = [
      ...QUESTIONS_3_1, ...QUESTIONS_3_2, ...QUESTIONS_3_3, 
      ...QUESTIONS_3_4_SUPPLIERS, ...QUESTIONS_3_5, ...QUESTIONS_3_6, ...QUESTIONS_3_7
    ];
    
    // Count text fields
    textQuestions.forEach(q => { if(marketData[q.key as keyof MarketBlockData]) filledFields++; });
    
    // Count lists (weight as 1 field if not empty)
    if (marketData.competitors.length > 0) filledFields++;
    if (marketData.customers.length > 0) filledFields++;
    if (marketData.suppliers.length > 0) filledFields++;

    const totalFields = textQuestions.length + 3;
    const percentage = Math.min(100, Math.round((filledFields / totalFields) * 100));

    // Section completion logic
    const s1 = QUESTIONS_3_1.every(q => (marketData[q.key] as string)?.length > 0);
    const s2 = marketData.competitors.length > 0 && QUESTIONS_3_2.every(q => (marketData[q.key] as string)?.length > 0);
    const s3 = marketData.customers.length > 0 && QUESTIONS_3_3.every(q => (marketData[q.key] as string)?.length > 0);
    const s4 = marketData.suppliers.length > 0 && QUESTIONS_3_4_SUPPLIERS.every(q => (marketData[q.key] as string)?.length > 0);
    const s5 = QUESTIONS_3_5.every(q => (marketData[q.key] as string)?.length > 0);
    const s6 = QUESTIONS_3_6.every(q => (marketData[q.key] as string)?.length > 0);
    const s7 = QUESTIONS_3_7.every(q => (marketData[q.key] as string)?.length > 0);

    return { percentage, s1, s2, s3, s4, s5, s6, s7 };
  };

  const progress = calculateProgress();

  const handleSaveDraft = () => {
    updateBlockProgress(3, progress.percentage, 'IN_PROGRESS');
  };

  const handleCompleteBlock = () => {
    if (progress.percentage < 90) {
      if(!confirm("Non hai compilato tutti i campi. Vuoi comunque completare il blocco?")) return;
    }
    updateBlockProgress(3, 100, 'COMPLETED');
    navigate('/');
  };

  const NavButton = ({ id, label, icon: Icon, completed }: { id: string, label: string, icon: any, completed: boolean }) => (
    <button
      onClick={() => setActiveSection(id as any)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
        activeSection === id 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      <div className="flex-1">
        <div className="font-bold text-sm">{id}</div>
        <div className="text-xs opacity-80 truncate">{label}</div>
      </div>
      <div className="flex items-center space-x-2">
        {completed && (
          <div className={`w-2.5 h-2.5 rounded-full ${activeSection === id ? 'bg-green-300' : 'bg-green-500'}`}></div>
        )}
        {activeSection === id && <ChevronLeft size={16} className="rotate-180" />}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
          <ChevronLeft size={20} />
          <span>Dashboard</span>
        </button>
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completamento</div>
            <div className="text-lg font-bold text-slate-900">{progress.percentage}%</div>
          </div>
          <div className="w-32 md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress.percentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="mb-4 px-2">
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Ambiente Esterno</h1>
            <p className="text-xs text-slate-500">Blocco 3 - Analisi LDE</p>
          </div>
          <NavButton id="3.1" label="Trend di Mercato" icon={TrendingUp} completed={progress.s1} />
          <NavButton id="3.2" label="Analisi Competitor" icon={Target} completed={progress.s2} />
          <NavButton id="3.3" label="Mappatura Clienti" icon={Users} completed={progress.s3} />
          <NavButton id="3.4" label="Mappatura Fornitori" icon={Truck} completed={progress.s4} />
          <NavButton id="3.5" label="Normative" icon={Scale} completed={progress.s5} />
          <NavButton id="3.6" label="Percezione & Feedback" icon={MessageSquare} completed={progress.s6} />
          <NavButton id="3.7" label="Offerte & Partnership" icon={Handshake} completed={progress.s7} />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          
          {/* Smart Inheritance Bar */}
          <GroupInheritanceBar blockId={3} />

          {activeSection === '3.1' && (
            <QuestionList title="Trend di Mercato" questions={QUESTIONS_3_1} data={marketData} update={updateMarketData} icon={TrendingUp} colorClass="bg-blue-600 text-blue-600" />
          )}
          
          {activeSection === '3.2' && (
            <QuestionList title="Analisi Competitor" questions={QUESTIONS_3_2} data={marketData} update={updateMarketData} icon={Target} colorClass="bg-amber-500 text-amber-500">
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-800 mb-4">Chi è considerato oggi come competitor diretto? Elencali qui sotto (almeno 5).</label>
                <EntityListBuilder 
                  items={marketData.competitors} 
                  onAdd={addCompetitor} 
                  onRemove={removeCompetitor} 
                  placeholderName="Nome Competitor"
                  withFeedback
                  feedbackKey="differentiation"
                  feedbackLabel={(name) => `In cosa vi differenziate realmente da ${name}? Cosa vi accomuna?`}
                  onFeedbackChange={updateCompetitorFeedback}
                />
              </div>
            </QuestionList>
          )}

          {activeSection === '3.3' && (
            <QuestionList title="Mappatura Clienti" questions={QUESTIONS_3_3} data={marketData} update={updateMarketData} icon={Users} colorClass="bg-purple-600 text-purple-600">
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-800 mb-4">Chi sono oggi i clienti principali? Elenca almeno 5 top client.</label>
                <EntityListBuilder 
                  items={marketData.customers} 
                  onAdd={addCustomer} 
                  onRemove={removeCustomer} 
                  placeholderName="Nome Cliente"
                  withFeedback
                  feedbackKey="attractiveness"
                  feedbackLabel="Cosa vi rende attraenti per questo cliente?"
                  onFeedbackChange={updateCustomerFeedback}
                />
              </div>
            </QuestionList>
          )}

          {activeSection === '3.4' && (
            <QuestionList title="Mappatura Fornitori" questions={QUESTIONS_3_4_SUPPLIERS} data={marketData} update={updateMarketData} icon={Truck} colorClass="bg-indigo-600 text-indigo-600">
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-800 mb-4">Chi sono i principali fornitori?</label>
                <EntityListBuilder 
                  items={marketData.suppliers} 
                  onAdd={addSupplier} 
                  onRemove={removeSupplier} 
                  placeholderName="Nome Fornitore"
                />
              </div>
            </QuestionList>
          )}

          {activeSection === '3.5' && (
            <QuestionList title="Normative" questions={QUESTIONS_3_5} data={marketData} update={updateMarketData} icon={Scale} colorClass="bg-slate-700 text-slate-700" />
          )}

          {activeSection === '3.6' && (
            <QuestionList title="Percezione Pubblica" questions={QUESTIONS_3_6} data={marketData} update={updateMarketData} icon={MessageSquare} colorClass="bg-emerald-600 text-emerald-600" />
          )}

          {activeSection === '3.7' && (
            <QuestionList title="Offerte, Contratti e Partnership" questions={QUESTIONS_3_7} data={marketData} update={updateMarketData} icon={Handshake} colorClass="bg-red-600 text-red-600" />
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-4 bg-white border-t border-slate-200 flex justify-end items-center space-x-4 z-40">
         <button 
           onClick={handleSaveDraft}
           className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 flex items-center space-x-2"
         >
           <Save size={18} />
           <span>Salva Bozza</span>
         </button>
         <button 
           onClick={handleCompleteBlock}
           className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 flex items-center space-x-2"
         >
           <CheckCircle size={18} />
           <span>Completa Blocco</span>
         </button>
      </div>

    </div>
  );
};
