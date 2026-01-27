
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { IdentityBlockData } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { GroupInheritanceBar } from '../components/GroupInheritanceBar'; // IMPORTED
import { transcribeAudio } from '../services/gemini';
import { 
  Fingerprint, 
  History, 
  Rocket, 
  GraduationCap, 
  AlertTriangle, 
  Banknote,
  ChevronLeft,
  Save,
  CheckCircle,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';

// --- CONSTANTS: Question Configurations ---

const QUESTIONS_2_1: { key: keyof IdentityBlockData, label: string }[] = [
  { key: 'nameOrigin', label: "Qual è l'origine del nome dell’azienda e quale significato si voleva trasmettere?" },
  { key: 'visualEvolution', label: "Come si è evoluta l'identità visiva (logo, colori)? Ci sono stati cambiamenti significativi?" },
  { key: 'toneOfVoice', label: "Quale tono di voce utilizza l’azienda e come riflette la cultura aziendale?" },
  { key: 'consistency', label: "In che modo l’azienda mantiene coerenza identitaria adattandosi al mercato?" },
  { key: 'brandBookUsage', label: "Quanto il brand book è realmente applicato nella pratica quotidiana?" },
  { key: 'identityAdaptation', label: "In quali casi l’identità viene adattata o “forzata” per esigenze commerciali?" },
  { key: 'sustainabilityRealness', label: "Quanto la sostenibilità è parte reale della proposta di valore?" },
];

const QUESTIONS_2_2: { key: keyof IdentityBlockData, label: string }[] = [
  { key: 'growthSteps', label: "Quali sono stati gli step principali nel percorso di crescita e in quali anni?" },
  { key: 'marketValidation', label: "Quando si è conclusa la fase di validazione del mercato?" },
  { key: 'partnerships', label: "Ci sono state partnership strategiche che hanno rappresentato una svolta?" },
  { key: 'governanceChanges', label: "Ci sono stati cambiamenti nella governance o leadership? Con quali effetti?" },
  { key: 'newMarkets', label: "L’azienda ha mai affrontato l’ingresso in nuovi mercati o settori?" },
  { key: 'crises', label: "Ci sono state crisi significative? Come sono state gestite?" },
  { key: 'significantEvents', label: "Quali altri eventi sono stati particolarmente significativi?" },
  { key: 'growthStart', label: "Quando è iniziata realmente la crescita e come?" },
  { key: 'newServices', label: "Quando sono stati implementati nuovi servizi? Come?" },
  { key: 'expansionFactors', label: "Quali fattori hanno influenzato le scelte di espansione?" },
  { key: 'threeKeyStages', label: "Quali possono essere le 3 tappe fondamentali nella storia aziendale?" },
];

const QUESTIONS_2_3: { key: keyof IdentityBlockData, label: string }[] = [
  { key: 'strategicPriorities', label: "Quali sono oggi le 2-3 priorità strategiche più importanti?" },
  { key: 'futureVision', label: "Come viene immaginata l’azienda tra 3-5 anni?" },
  { key: 'targetMarkets', label: "Quali sono i mercati che l’azienda vuole esplorare o rafforzare?" },
  { key: 'businessLinesEvolution', label: "Quali linee di business avranno un ruolo crescente o decrescente?" },
  { key: 'roadmapFormalization', label: "Esiste una roadmap formale o è una direzione adattiva?" },
  { key: 'obstacles', label: "Quali sono i principali ostacoli o rischi per questi piani?" },
  { key: 'teamSharing', label: "Quanto sono condivisi questi piani con il team? Come vengono comunicati?" },
  { key: 'supportNeeded', label: "Che tipo di supporto servirebbe oggi per accelerare lo sviluppo?" },
  { key: 'businessModelChanges', label: "Sono previsti cambiamenti nel modello di business?" },
  { key: 'goalMeasurement', label: "Come viene misurato oggi l’avanzamento degli obiettivi strategici?" },
];

const QUESTIONS_2_4: { key: keyof IdentityBlockData, label: string }[] = [
  { key: 'obsoleteBeliefs', label: "Quale convinzione iniziale oggi non vale più?" },
  { key: 'formativeError', label: "Qual è stato l’errore più formativo nella storia aziendale?" },
  { key: 'pivotMoment', label: "C’è stato un momento preciso in cui si è capito che bisognava cambiare direzione?" },
  { key: 'experienceImpact', label: "Quali esperienze hanno cambiato il modo di lavorare o organizzare l’azienda?" },
  { key: 'regrettedDecisions', label: "Ci sono decisioni importanti che col senno di poi avreste preso diversamente?" },
  { key: 'crisisMoments', label: "In quali momenti vi siete sentiti più in crisi? Come ne siete usciti?" },
  { key: 'peopleRole', label: "Che ruolo hanno avuto le persone nei principali cambiamenti?" },
  { key: 'errorPattern', label: "C’è un pattern ricorrente negli errori fatti?" },
];

const QUESTIONS_2_5: { key: keyof IdentityBlockData, label: string }[] = [
  { key: 'strategicRisks', label: "Quali sono i principali rischi strategici attuali?" },
  { key: 'operationalRisks', label: "Ci sono rischi operativi o organizzativi critici?" },
  { key: 'materializedRisks', label: "L'azienda ha mai affrontato un rischio materializzato? Come?" },
  { key: 'preventiveMeasures', label: "Quali misure preventive sono state implementate?" },
  { key: 'underratedRisks', label: "Esistono rischi sottovalutati o poco discussi?" },
  { key: 'riskCommunication', label: "Come viene condivisa la percezione del rischio?" },
  { key: 'riskMonitoring', label: "Come vengono monitorati i rischi e le strategie di mitigazione?" },
  { key: 'riskManagementTools', label: "Quali strumenti potrebbero migliorare la gestione dei rischi?" },
  { key: 'formalRiskMapping', label: "L’azienda ha mai formalizzato una mappatura dei rischi?" },
];

const QUESTIONS_2_6: { key: keyof IdentityBlockData, label: string }[] = [
  { key: 'financialPhilosophy', label: "Qual è stata finora la filosofia di gestione finanziaria?" },
  { key: 'economicRiskAttitude', label: "Qual è l’attitudine verso il rischio economico?" },
  { key: 'healthIndicators', label: "Quali sono i principali indicatori di salute economica monitorati?" },
  { key: 'financeStrategyAlignment', label: "C’è coerenza tra dati finanziari e scelte strategiche?" },
  { key: 'dataSharing', label: "Quanto vengono condivisi i dati finanziari con il team?" },
  { key: 'teamAwareness', label: "Qual è il livello di consapevolezza economica del team?" },
  { key: 'pastCrises', label: "Ci sono state situazioni critiche in passato? Come affrontate?" },
  { key: 'financeFunctionImportance', label: "Quanto è importante strutturare la funzione finanziaria?" },
  { key: 'financialRiskPolicy', label: "Qual è la politica rispetto al rischio finanziario e di credito?" },
  { key: 'debtStance', label: "Qual è la posizione riguardo l'assunzione di debito?" },
  { key: 'liquidityManagement', label: "Come vengono gestiti i rischi di liquidità?" },
];

// --- SHARED COMPONENT FOR SECTIONS ---

const QuestionList = ({ title, questions, data, update, icon: Icon, colorClass }: { title: string, questions: { key: keyof IdentityBlockData, label: string }[], data: IdentityBlockData, update: any, icon: any, colorClass: string }) => {
  const { saveAudioAnswer, audioAnswers } = useApp();
  const [transcribingKey, setTranscribingKey] = useState<string | null>(null);

  const handleAudioSave = async (key: string, base64: string) => {
    // 1. Save Audio locally
    const audioKey = `b2_${key}`;
    saveAudioAnswer(audioKey, base64);
    
    // 2. Trigger Transcription
    if (base64) {
      setTranscribingKey(key);
      const text = await transcribeAudio(base64);
      if (text) {
        const currentValue = data[key as keyof IdentityBlockData] as string;
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
             const audioKey = `b2_${q.key}`;
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

export const BlockIdentity = () => {
  const navigate = useNavigate();
  const { user, identityData, updateIdentityData, updateBlockProgress } = useApp();
  const [activeSection, setActiveSection] = useState<'2.1' | '2.2' | '2.3' | '2.4' | '2.5' | '2.6'>('2.1');

  // Security Check
  if (user && user.role !== 'OWNER' && !user.assignedBlocks.includes(2)) {
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
      ...QUESTIONS_2_1, ...QUESTIONS_2_2, ...QUESTIONS_2_3, 
      ...QUESTIONS_2_4, ...QUESTIONS_2_5, ...QUESTIONS_2_6
    ];
    
    allQuestions.forEach(q => { if(identityData[q.key]) filledFields++; });

    const percentage = Math.min(100, Math.round((filledFields / allQuestions.length) * 100));

    // Section completion logic
    const checkSection = (qs: typeof QUESTIONS_2_1) => qs.every(q => (identityData[q.key] as string)?.length > 0);

    return { 
      percentage,
      s1: checkSection(QUESTIONS_2_1),
      s2: checkSection(QUESTIONS_2_2),
      s3: checkSection(QUESTIONS_2_3),
      s4: checkSection(QUESTIONS_2_4),
      s5: checkSection(QUESTIONS_2_5),
      s6: checkSection(QUESTIONS_2_6),
    };
  };

  const progress = calculateProgress();

  const handleSaveDraft = () => {
    updateBlockProgress(2, progress.percentage, 'IN_PROGRESS');
  };

  const handleCompleteBlock = () => {
    if (progress.percentage < 90) {
      if(!confirm("Non hai compilato tutti i campi. Vuoi comunque completare il blocco?")) return;
    }
    updateBlockProgress(2, 100, 'COMPLETED');
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
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Dimensioni & Identità</h1>
            <p className="text-xs text-slate-500">Blocco 2 - Analisi LDE</p>
          </div>
          <NavButton id="2.1" label="Corporate Identity" icon={Fingerprint} completed={progress.s1} />
          <NavButton id="2.2" label="Timeline Evolutiva" icon={History} completed={progress.s2} />
          <NavButton id="2.3" label="Piani di Sviluppo" icon={Rocket} completed={progress.s3} />
          <NavButton id="2.4" label="Learned Lessons" icon={GraduationCap} completed={progress.s4} />
          <NavButton id="2.5" label="Mappatura Rischi" icon={AlertTriangle} completed={progress.s5} />
          <NavButton id="2.6" label="Doc. Finanziaria" icon={Banknote} completed={progress.s6} />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          
          {/* Smart Inheritance Bar */}
          <GroupInheritanceBar blockId={2} />

          {activeSection === '2.1' && <QuestionList title="Corporate Identity" questions={QUESTIONS_2_1} data={identityData} update={updateIdentityData} icon={Fingerprint} colorClass="bg-blue-600 text-blue-600" />}
          {activeSection === '2.2' && <QuestionList title="Timeline Evolutiva" questions={QUESTIONS_2_2} data={identityData} update={updateIdentityData} icon={History} colorClass="bg-amber-500 text-amber-500" />}
          {activeSection === '2.3' && <QuestionList title="Piani di Sviluppo" questions={QUESTIONS_2_3} data={identityData} update={updateIdentityData} icon={Rocket} colorClass="bg-purple-600 text-purple-600" />}
          {activeSection === '2.4' && <QuestionList title="Learned Lessons" questions={QUESTIONS_2_4} data={identityData} update={updateIdentityData} icon={GraduationCap} colorClass="bg-emerald-600 text-emerald-600" />}
          {activeSection === '2.5' && <QuestionList title="Mappatura Rischi" questions={QUESTIONS_2_5} data={identityData} update={updateIdentityData} icon={AlertTriangle} colorClass="bg-red-600 text-red-600" />}
          {activeSection === '2.6' && <QuestionList title="Documentazione Finanziaria" questions={QUESTIONS_2_6} data={identityData} update={updateIdentityData} icon={Banknote} colorClass="bg-slate-800 text-slate-800" />}
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
