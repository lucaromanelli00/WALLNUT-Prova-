
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { TechTool } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { GroupInheritanceBar } from '../components/GroupInheritanceBar'; // IMPORTED
import { transcribeAudio } from '../services/gemini';
import { 
  Server, 
  ShieldCheck, 
  Users, 
  Activity, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle,
  AlertTriangle,
  Lock,
  Check,
  Laptop,
  Sparkles,
  Loader2
} from 'lucide-react';

// --- CONSTANTS ---
const TOOL_DOMAINS = [
  "Project Management",
  "CRM / Gestione Clienti",
  "Comunicazione Interna",
  "Gestione Documentale",
  "Risorse Umane (HR)",
  "Contabilità & Amministrazione",
  "Sviluppo Software",
  "Marketing & Sales",
  "Altro"
];

// --- UI COMPONENTS ---

const InputRow = ({ label, value, onChange, placeholder, minHeight = "100px", audioKey }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, minHeight?: string, audioKey: string }) => {
  const { saveAudioAnswer, audioAnswers } = useApp();
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleAudioSave = async (base64: string) => {
    // 1. Save Audio locally
    saveAudioAnswer(audioKey, base64);
    
    // 2. Trigger Transcription
    if (base64) {
      setIsTranscribing(true);
      const text = await transcribeAudio(base64);
      if (text) {
        const newText = value ? `${value}\n\n[Trascrizione Audio]: ${text}` : text;
        onChange(newText);
      }
      setIsTranscribing(false);
    }
  };
  
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex justify-between items-start mb-3">
        <label className="block text-sm font-semibold text-slate-800 leading-relaxed max-w-[85%]">{label}</label>
        {isTranscribing && (
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            <span>AI Thinking...</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <textarea
          className={`w-full text-sm text-slate-700 placeholder-slate-400 p-4 rounded-xl border focus:outline-none focus:border-blue-500 resize-y transition-colors mb-3 ${isTranscribing ? 'bg-indigo-50/30 border-indigo-200' : 'bg-slate-50 border-slate-200 focus:bg-white'}`}
          style={{ minHeight }}
          placeholder={isTranscribing ? "L'IA sta scrivendo per te..." : (placeholder || "Scrivi qui la tua risposta...")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
        onSave={handleAudioSave}
        savedAudio={audioAnswers[audioKey]}
      />
    </div>
  );
};

const RadioSelection = ({ options, value, onChange, vertical = false }: { options: string[], value: string, onChange: (v: string) => void, vertical?: boolean }) => (
  <div className={`flex ${vertical ? 'flex-col space-y-3' : 'space-x-4'}`}>
    {options.map(opt => {
      const isSelected = value === opt;
      return (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`relative px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center ${
            isSelected 
              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {isSelected && <Check size={16} className="absolute left-3 text-blue-600" />}
          <span className={isSelected ? 'ml-2' : ''}>{opt}</span>
        </button>
      );
    })}
  </div>
);

// --- SECTIONS COMPONENTS ---

const Section4_1 = ({ data, update }: { data: any, update: any }) => {
  const [newTool, setNewTool] = useState<Partial<TechTool>>({ domain: TOOL_DOMAINS[0] });

  const handleAddTool = () => {
    if (newTool.name && newTool.domain) {
      const tool: TechTool = {
        id: Date.now().toString(),
        domain: newTool.domain,
        name: newTool.name,
        description: newTool.description || '',
        team: newTool.team || ''
      };
      update({ tools: [...data.tools, tool] });
      setNewTool({ domain: TOOL_DOMAINS[0], name: '', description: '', team: '' });
    }
  };

  const removeTool = (id: string) => {
    update({ tools: data.tools.filter((t: TechTool) => t.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* ERP Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Server size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sistemi ERP & Core</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-3">L'azienda utilizza un sistema ERP centrale?</label>
            <RadioSelection 
              options={['Sì', 'No']} 
              value={data.erpUsed} 
              onChange={(val) => update({ erpUsed: val })} 
            />
          </div>
          
          {data.erpUsed === 'Sì' && (
            <div className="animate-in fade-in mt-6 pt-6 border-t border-slate-50">
              <InputRow 
                label="Quale ERP utilizzate e quali ambiti aziendali copre (es. Contabilità, Magazzino, Produzione)?"
                value={data.erpName}
                onChange={(val) => update({ erpName: val })}
                placeholder="Es. SAP S/4HANA per finanza e logistica..."
                audioKey="b4_erpName"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tools Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Laptop size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Mappatura Strumenti Digitali</h3>
        </div>
        
        {/* Add Tool Form */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Aggiungi Strumento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Dominio</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
                value={newTool.domain}
                onChange={e => setNewTool({...newTool, domain: e.target.value})}
              >
                {TOOL_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Nome Strumento</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Es. Slack, Jira..."
                value={newTool.name || ''}
                onChange={e => setNewTool({...newTool, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Team Utilizzatore</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Es. Marketing..."
                value={newTool.team || ''}
                onChange={e => setNewTool({...newTool, team: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Scopo Principale</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Es. Chat aziendale"
                value={newTool.description || ''}
                onChange={e => setNewTool({...newTool, description: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={handleAddTool}
            disabled={!newTool.name}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            <Plus size={18} />
            <span>Aggiungi Strumento</span>
          </button>
        </div>

        {/* Tools List */}
        <div className="space-y-3">
          {data.tools.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
              <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Server size={24} />
              </div>
              <p className="text-slate-400 font-medium">Nessuno strumento mappato.</p>
            </div>
          ) : (
            data.tools.map((tool: TechTool) => (
              <div key={tool.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {tool.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-slate-800">{tool.name}</span>
                      <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full tracking-wide">{tool.domain}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center space-x-2">
                      <span className="font-semibold text-slate-600">{tool.team}</span>
                      <span>•</span>
                      <span>{tool.description}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeTool(tool.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Section4_2 = ({ data, update }: { data: any, update: any }) => (
  <div className="space-y-6 animate-in fade-in">
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <Users size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Governance & Decisioni</h3>
      </div>

      <InputRow 
        label="Chi prende le decisioni strategiche sul digitale? (Es. CEO, CTO, Responsabile IT)"
        value={data.strategicDecider}
        onChange={(val) => update({ strategicDecider: val })}
        minHeight="80px"
        audioKey="b4_strategicDecider"
      />

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-800 mb-3">Qual è il modello decisionale prevalente?</label>
        <RadioSelection 
          vertical
          options={['Centralizzato (IT decide tutto)', 'Distribuito (Ogni team decide)', 'Misto']} 
          value={data.decisionModel} 
          onChange={(val) => update({ decisionModel: val })} 
        />
      </div>

      <InputRow 
        label="Qual è il tempo medio di implementazione dall'idea al 'Go Live' effettivo?"
        value={data.implementationTime}
        onChange={(val) => update({ implementationTime: val })}
        placeholder="Es. 3 mesi per progetti medi..."
        minHeight="80px"
        audioKey="b4_implementationTime"
      />
    </div>
  </div>
);

const Section4_3 = ({ data, update }: { data: any, update: any }) => (
  <div className="space-y-6 animate-in fade-in">
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
          <ShieldCheck size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Sicurezza & Rischio</h3>
      </div>

      <InputRow 
        label="Quali sono i principali scenari di rischio temuti? (es. Ransomware, perdita dati, interruzione servizi)"
        value={data.riskScenarios}
        onChange={(val) => update({ riskScenarios: val })}
        audioKey="b4_riskScenarios"
      />

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-800 mb-3">Avete subito incidenti o Data Breach recenti?</label>
        <RadioSelection 
          options={['Sì', 'No']} 
          value={data.dataBreach} 
          onChange={(val) => update({ dataBreach: val })} 
        />
      </div>
        
      {data.dataBreach === 'Sì' && (
          <div className="animate-in fade-in pt-4 border-t border-slate-50">
            <InputRow 
              label="Descrivi brevemente l'incidente avvenuto."
              value={data.dataBreachDetails}
              onChange={(val) => update({ dataBreachDetails: val })}
              placeholder="Descrivi brevemente cosa è successo..."
              audioKey="b4_dataBreachDetails"
            />
          </div>
      )}
    </div>
  </div>
);

const Section4_4 = ({ data, update }: { data: any, update: any }) => {
  const handleFeedback = (key: string, value: string) => {
    update({ toolFeedback: { ...data.toolFeedback, [key]: value } });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Activity size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Utilizzo & Criticità</h3>
        </div>

        <InputRow 
           label="Quali sono gli strumenti indispensabili (Business Critical) che se si fermassero bloccherebbero l'azienda?"
           value={data.indispensableTools}
           onChange={(val) => update({ indispensableTools: val })}
           audioKey="b4_indispensableTools"
         />
         <InputRow 
           label="Quali sono gli strumenti problematici (lenti, obsoleti o che creano frizione)?"
           value={data.problematicTools}
           onChange={(val) => update({ problematicTools: val })}
           audioKey="b4_problematicTools"
         />
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Feedback Analitico Strumenti</h4>
        
        {data.tools.length === 0 ? (
          <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 flex items-center space-x-3">
            <AlertTriangle size={24} />
            <div>
              <p className="font-bold">Nessuno strumento rilevato</p>
              <p className="text-sm opacity-80">Torna alla sezione 4.1 per aggiungere i tool aziendali prima di dare feedback.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {data.tools.map((tool: TechTool) => {
              const key = `${tool.domain}-${tool.id}`;
              const currentVal = data.toolFeedback?.[key];
              return (
                <div key={key} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <div className="font-bold text-slate-800 text-lg">{tool.name}</div>
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{tool.team}</div>
                     </div>
                     {currentVal && <CheckCircle size={20} className="text-green-500 animate-in zoom-in" />}
                   </div>
                   
                   <div className="space-y-2">
                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Frequenza di Utilizzo</p>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                       {['Quotidiano', 'Settimanale', 'Raramente', 'Mai'].map(opt => (
                         <button
                           key={opt}
                           onClick={() => handleFeedback(key, opt)}
                           className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                             currentVal === opt 
                             ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                             : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                           }`}
                         >
                           {opt}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export const BlockTechnology = () => {
  const navigate = useNavigate();
  const { user, techData, updateTechData, updateBlockProgress } = useApp();
  const [activeSection, setActiveSection] = useState<'4.1' | '4.2' | '4.3' | '4.4'>('4.1');

  // Security Check (Owner always allowed)
  if (user && user.role !== 'OWNER' && !user.assignedBlocks.includes(4)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <Lock className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Accesso Negato</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Torna alla Dashboard</button>
      </div>
    );
  }

  // Progress Calculation Logic
  const calculateProgress = () => {
    let completedSections = 0;
    
    // 4.1: At least 1 tool OR manual answers
    const s1Complete = techData.tools.length > 0 || !!techData.erpUsed;
    if (s1Complete) completedSections++;
    
    // 4.2: Decider filled
    const s2Complete = !!techData.strategicDecider;
    if (s2Complete) completedSections++;
    
    // 4.3: Risks filled
    const s3Complete = !!techData.riskScenarios;
    if (s3Complete) completedSections++;
    
    // 4.4: Indispensable tools filled
    const s4Complete = !!techData.indispensableTools;
    if (s4Complete) completedSections++;

    return {
      count: completedSections,
      percentage: Math.round((completedSections / 4) * 100),
      s1Complete, s2Complete, s3Complete, s4Complete
    };
  };

  const progress = calculateProgress();

  const handleSaveDraft = () => {
    updateBlockProgress(4, progress.percentage, 'IN_PROGRESS');
  };

  const handleCompleteBlock = () => {
    if (progress.count < 4) {
      if (!confirm("Non tutte le sezioni sono complete. Vuoi chiudere comunque il blocco?")) return;
    }
    updateBlockProgress(4, 100, 'COMPLETED');
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
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Tecnologia</h1>
            <p className="text-xs text-slate-500">Blocco 4 - Analisi LDE</p>
          </div>
          <NavButton id="4.1" label="Strumenti Digitali" icon={Server} completed={progress.s1Complete} />
          <NavButton id="4.2" label="Governance" icon={Users} completed={progress.s2Complete} />
          <NavButton id="4.3" label="Sicurezza" icon={ShieldCheck} completed={progress.s3Complete} />
          <NavButton id="4.4" label="Utilizzo" icon={Activity} completed={progress.s4Complete} />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          
          {/* Smart Inheritance Bar */}
          <GroupInheritanceBar blockId={4} />

          {activeSection === '4.1' && <Section4_1 data={techData} update={updateTechData} />}
          {activeSection === '4.2' && <Section4_2 data={techData} update={updateTechData} />}
          {activeSection === '4.3' && <Section4_3 data={techData} update={updateTechData} />}
          {activeSection === '4.4' && <Section4_4 data={techData} update={updateTechData} />}
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
