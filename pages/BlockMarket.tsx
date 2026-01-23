import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { MarketBlockData } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { GroupInheritanceBar } from '../components/GroupInheritanceBar'; // IMPORTED
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
  Loader2
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
  { key: 'directCompetitors', label: "Chi è considerato oggi come competitor diretto? (Almeno 5)" },
  { key: 'differentiation', label: "In cosa vi differenziate realmente da loro? Cosa vi accomuna?" },
  { key: 'monitoringStrategy', label: "Come viene monitorato il posizionamento competitivo?" },
  { key: 'observedModels', label: "Ci sono aziende o modelli di business che vengono osservati con particolare attenzione?" },
];

const QUESTIONS_3_3: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'mainCustomers', label: "Chi sono oggi i clienti principali in termini di tipologia, settore, dimensioni?" },
  { key: 'idealCustomerPattern', label: "Che pattern comuni vedete nei clienti ideali?" },
  { key: 'targetEvolution', label: "Come è cambiato nel tempo il vostro target?" },
  { key: 'attractiveness', label: "Cosa vi rende attraenti per questi clienti?" },
  { key: 'strategicCriteria', label: "Ci sono clienti che considerate “strategici”? In base a quali criteri?" },
  { key: 'growthSegments', label: "Avete segmenti di clienti preferenziali o in crescita?" },
  { key: 'customerRelationship', label: "Che tipo di relazione mantenete con i clienti chiave? (es. partnership)" },
];

const QUESTIONS_3_4: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'impactingRegulations', label: "Quali normative (nazionali, europee o di settore) influenzano direttamente le attività?" },
  { key: 'complianceUpdate', label: "In che modo vi tenete aggiornati sugli aspetti normativi rilevanti?" },
  { key: 'developmentConditioning', label: "Esistono requisiti normativi che condizionano lo sviluppo dei vostri servizi?" },
  { key: 'complianceRoles', label: "Avete figure interne o esterne dedicate alla gestione normativa?" },
  { key: 'recentChanges', label: "Ci sono stati cambiamenti normativi recenti che hanno impattato le scelte strategiche?" },
  { key: 'riskAreas', label: "Quali aree ritenete oggi più esposte a rischio normativo o sanzionatorio?" },
];

const QUESTIONS_3_5: { key: keyof MarketBlockData, label: string }[] = [
  { key: 'feedbackChannels', label: "Dove ricevete oggi feedback esterni (recensioni, social)?" },
  { key: 'feedbackCollection', label: "In che modo raccogliete e archiviate i feedback pubblici?" },
  { key: 'feedbackAnalysis', label: "Come analizzate e interpretate le recensioni per migliorare?" },
  { key: 'negativeResponseStrategy', label: "Avete una strategia di risposta alle recensioni negative? Chi se ne occupa?" },
  { key: 'recurringPerceptions', label: "Quali sono le percezioni esterne più ricorrenti sulla vostra azienda?" },
  { key: 'reputationManagement', label: "Avete mai gestito crisi reputazionali? Come?" },
];

const QUESTIONS_3_6: { key: keyof MarketBlockData, label: string }[] = [
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

// --- SHARED COMPONENT ---

const QuestionList = ({ title, questions, data, update, icon: Icon, colorClass }: { title: string, questions: { key: keyof MarketBlockData, label: string }[], data: MarketBlockData, update: any, icon: any, colorClass: string }) => {
  const { saveAudioAnswer, audioAnswers } = useApp();
  const [transcribingKey, setTranscribingKey] = useState<string | null>(null);

  const handleAudioSave = async (key: string, base64: string) => {
    // 1. Save Audio locally
    const audioKey = `b3_${key}`;
    saveAudioAnswer(audioKey, base64);
    
    // 2. Trigger Transcription
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
                    value={data[q.key] || ''}
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
  const [activeSection, setActiveSection] = useState<'3.1' | '3.2' | '3.3' | '3.4' | '3.5' | '3.6'>('3.1');

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

  // Progress Calculation
  const calculateProgress = () => {
    let filledFields = 0;
    const allQuestions = [
      ...QUESTIONS_3_1, ...QUESTIONS_3_2, ...QUESTIONS_3_3, 
      ...QUESTIONS_3_4, ...QUESTIONS_3_5, ...QUESTIONS_3_6
    ];
    
    allQuestions.forEach(q => { if(marketData[q.key]) filledFields++; });

    const percentage = Math.min(100, Math.round((filledFields / allQuestions.length) * 100));

    // Section completion logic
    const checkSection = (qs: typeof QUESTIONS_3_1) => qs.every(q => (marketData[q.key] as string)?.length > 0);

    return { 
      percentage,
      s1: checkSection(QUESTIONS_3_1),
      s2: checkSection(QUESTIONS_3_2),
      s3: checkSection(QUESTIONS_3_3),
      s4: checkSection(QUESTIONS_3_4),
      s5: checkSection(QUESTIONS_3_5),
      s6: checkSection(QUESTIONS_3_6),
    };
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
          <NavButton id="3.4" label="Normative" icon={Scale} completed={progress.s4} />
          <NavButton id="3.5" label="Percezione & Feedback" icon={MessageSquare} completed={progress.s5} />
          <NavButton id="3.6" label="Offerte & Partnership" icon={Handshake} completed={progress.s6} />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          
          {/* Smart Inheritance Bar */}
          <GroupInheritanceBar blockId={3} />

          {activeSection === '3.1' && <QuestionList title="Trend di Mercato" questions={QUESTIONS_3_1} data={marketData} update={updateMarketData} icon={TrendingUp} colorClass="bg-blue-600 text-blue-600" />}
          {activeSection === '3.2' && <QuestionList title="Analisi Competitor" questions={QUESTIONS_3_2} data={marketData} update={updateMarketData} icon={Target} colorClass="bg-amber-500 text-amber-500" />}
          {activeSection === '3.3' && <QuestionList title="Mappatura Clienti" questions={QUESTIONS_3_3} data={marketData} update={updateMarketData} icon={Users} colorClass="bg-purple-600 text-purple-600" />}
          {activeSection === '3.4' && <QuestionList title="Normative" questions={QUESTIONS_3_4} data={marketData} update={updateMarketData} icon={Scale} colorClass="bg-slate-700 text-slate-700" />}
          {activeSection === '3.5' && <QuestionList title="Percezione Pubblica" questions={QUESTIONS_3_5} data={marketData} update={updateMarketData} icon={MessageSquare} colorClass="bg-emerald-600 text-emerald-600" />}
          {activeSection === '3.6' && <QuestionList title="Offerte, Contratti e Partnership" questions={QUESTIONS_3_6} data={marketData} update={updateMarketData} icon={Handshake} colorClass="bg-red-600 text-red-600" />}
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