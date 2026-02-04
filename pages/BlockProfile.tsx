
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ProfileBlockData, LibraryItem } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { GroupInheritanceBar } from '../components/GroupInheritanceBar';
import { transcribeAudio } from '../services/gemini';
import { 
  Users, 
  Heart, 
  BookOpen, 
  ChevronLeft, 
  Save, 
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  Link as LinkIcon,
  Sparkles,
  Loader2
} from 'lucide-react';

// NOTE: "hint" contains the actual question now, which we will display as the main label.
const QUESTIONS_1_1: { key: keyof ProfileBlockData, hint: string }[] = [
  { key: 'organigramAdherence', hint: "L’organigramma formale riflette il funzionamento reale dell’azienda? Se no, in quali punti diverge?" },
  { key: 'keyFigures', hint: "Chi sono le 3–5 figure chiave per il funzionamento dell’azienda oggi? (ruolo, ambito, responsabilità effettiva)" },
  { key: 'informalRoles', hint: "Esistono ruoli informali che influenzano decisioni o processi chiave?" },
  { key: 'collaboratingTeams', hint: "Quali team o funzioni collaborano maggiormente nella pratica?" },
  { key: 'externalPartners', hint: "Quali figure esterne collaborano stabilmente con l’azienda? (consulenti, partner, ecc.) Che ruolo hanno?" },
  { key: 'distinctiveSkills', hint: "Quali competenze interne considerate oggi distintive o strategiche?" },
  { key: 'missingSkills', hint: "Quali competenze chiave risultano invece mancanti o sottodimensionate?" },
];

const QUESTIONS_1_2: { key: keyof ProfileBlockData, hint: string }[] = [
  { key: 'individualRelationship', hint: "Qual è il rapporto tra l’azienda e il singolo individuo?" },
  { key: 'idealEnvironment', hint: "Come descriveresti l’ambiente di lavoro ideale in azienda?" },
  { key: 'autonomyVsResults', hint: "Quanto contano, nella pratica, presenza, autonomia e risultati?" },
  { key: 'rewardedBehaviors', hint: "Quali comportamenti vengono premiati, anche implicitamente?" },
  { key: 'toleratedBehaviors', hint: "Quali comportamenti vengono tollerati pur non essendo coerenti con i valori dichiarati?" },
  { key: 'internalCommunication', hint: "Come viene gestita la comunicazione interna?" },
  { key: 'meetingManagement', hint: "Come vengono gestite riunioni e momenti di confronto?" },
  { key: 'workLifeBalance', hint: "Come viene considerato il work–life balance?" },
  { key: 'diversityValue', hint: "Quanto valore viene dato alla diversità di background, esperienze e prospettive?" },
  { key: 'changeReaction', hint: "Come reagisce l’organizzazione al cambiamento?" },
  { key: 'digitalAttitude', hint: "Il digitale è vissuto come opportunità, imposizione o rischio?" },
];

// Shared Component for Text Input
const TextAreaInput = ({ label, value, onChange, audioKey }: { label: string, value: string, onChange: (v: string) => void, audioKey: string }) => {
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
        // Append text if there's already content, or just set it
        const newText = value ? `${value}\n\n[Trascrizione Audio]: ${text}` : text;
        onChange(newText);
      }
      setIsTranscribing(false);
    }
  };
  
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex justify-between items-start mb-3">
        <label className="block text-sm font-semibold text-slate-800 leading-relaxed max-w-[85%]">
          {label}
        </label>
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
          placeholder={isTranscribing ? "L'IA sta scrivendo per te..." : "Scrivi qui o registra una risposta vocale..."}
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

const Section1_1 = ({ data, update }: { data: ProfileBlockData, update: any }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Ruoli & Team</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {QUESTIONS_1_1.map((q) => (
            <div key={q.key} className="py-6 first:pt-0 last:pb-0 border-0">
              <TextAreaInput 
                label={q.hint} // Using the full question
                value={data[q.key] as string || ''}
                onChange={(val) => update({ [q.key]: val })}
                audioKey={`b1_${q.key}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section1_2 = ({ data, update }: { data: ProfileBlockData, update: any }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6">
          <div className="p-2 bg-red-50 rounded-lg text-red-600">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Cultura Aziendale</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {QUESTIONS_1_2.map((q) => (
            <div key={q.key} className="py-6 first:pt-0 last:pb-0 border-0">
              <TextAreaInput 
                label={q.hint} // Using the full question
                value={data[q.key] as string || ''}
                onChange={(val) => update({ [q.key]: val })}
                audioKey={`b1_${q.key}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section1_3 = ({ data, update }: { data: ProfileBlockData, update: any }) => {
  const [newItem, setNewItem] = useState<Partial<LibraryItem>>({ type: 'Book' });

  const addItem = () => {
    if (newItem.title && newItem.type) {
      const item: LibraryItem = {
        id: Date.now().toString(),
        title: newItem.title,
        type: newItem.type,
        link: newItem.link || '',
        description: newItem.description || ''
      };
      update({ library: [...data.library, item] });
      setNewItem({ type: 'Book', title: '', link: '', description: '' });
    }
  };

  const removeItem = (id: string) => {
    update({ library: data.library.filter(i => i.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Library Aziendale</h3>
        </div>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          Inserisci figure, documenti, libri, articoli che hanno influenzato la tua formazione o che consulti per lavorare.
        </p>

        {/* Add Form */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titolo / Nome</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white transition-colors"
                placeholder="Es. Steve Jobs, Design Thinking..."
                value={newItem.title || ''}
                onChange={e => setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white transition-colors"
                value={newItem.type}
                onChange={e => setNewItem({...newItem, type: e.target.value})}
              >
                <option value="Book">Libro</option>
                <option value="Person">Persona / Mentore</option>
                <option value="Article">Articolo / Blog</option>
                <option value="Document">Documento Interno</option>
                <option value="Other">Altro</option>
              </select>
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link (Opzionale)</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white transition-colors"
                placeholder="https://..."
                value={newItem.link || ''}
                onChange={e => setNewItem({...newItem, link: e.target.value})}
              />
            </div>
            <div className="md:col-span-12">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Perché è importante?</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white transition-colors"
                placeholder="Descrizione breve dell'impatto..."
                value={newItem.description || ''}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={addItem}
            disabled={!newItem.title}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            <Plus size={18} />
            <span>Aggiungi alla Library</span>
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {data.library.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">La library è vuota.</div>
          ) : (
            data.library.map(item => (
              <div key={item.id} className="flex items-start justify-between p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                 <div className="flex items-start space-x-4">
                   <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      {item.type === 'Book' && <BookOpen size={24} />}
                      {item.type === 'Person' && <Users size={24} />}
                      {(item.type === 'Article' || item.type === 'Document') && <LinkIcon size={24} />}
                      {item.type === 'Other' && <Heart size={24} />}
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 text-lg">{item.title}</h4>
                     <p className="text-sm text-slate-500">{item.description}</p>
                     {item.link && (
                       <a href={item.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-500 hover:underline mt-1 inline-flex items-center gap-1">
                         <LinkIcon size={12} /> Apri Risorsa
                       </a>
                     )}
                   </div>
                 </div>
                 <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
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

// --- MAIN PAGE ---

export const BlockProfile = () => {
  const navigate = useNavigate();
  const { user, profileData, updateProfileData, updateBlockProgress } = useApp();
  const [activeSection, setActiveSection] = useState<'1.1' | '1.2' | '1.3'>('1.1');

  // Security Check
  if (user && user.role !== 'OWNER' && !user.assignedBlocks.includes(1)) {
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
    
    QUESTIONS_1_1.forEach(q => { if(profileData[q.key]) filledFields++; });
    QUESTIONS_1_2.forEach(q => { if(profileData[q.key]) filledFields++; });

    if (profileData.library.length > 0) filledFields += 2;

    const totalFields = QUESTIONS_1_1.length + QUESTIONS_1_2.length + 2;
    const percentage = Math.min(100, Math.round((filledFields / totalFields) * 100));
    
    // Exact completion check
    const s1Complete = QUESTIONS_1_1.every(q => profileData[q.key] && (profileData[q.key] as string).length > 0);
    const s2Complete = QUESTIONS_1_2.every(q => profileData[q.key] && (profileData[q.key] as string).length > 0);
    const s3Complete = profileData.library.length > 0;

    return { percentage, s1Complete, s2Complete, s3Complete };
  };

  const progress = calculateProgress();

  const handleSaveDraft = () => {
    updateBlockProgress(1, progress.percentage, 'IN_PROGRESS');
  };

  const handleCompleteBlock = () => {
    if (progress.percentage < 90) {
      if(!confirm("Non hai compilato tutti i campi. Vuoi comunque completare il blocco?")) return;
    }
    updateBlockProgress(1, 100, 'COMPLETED');
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
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Profilo aziendale e struttura organizzativa</h1>
            <p className="text-xs text-slate-500">Blocco 1 - Analisi LDE</p>
          </div>
          <NavButton id="1.1" label="Ruoli & Team" icon={Users} completed={progress.s1Complete} />
          <NavButton id="1.2" label="Cultura Aziendale" icon={Heart} completed={progress.s2Complete} />
          <NavButton id="1.3" label="Library" icon={BookOpen} completed={progress.s3Complete} />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          
          {/* Smart Inheritance Bar */}
          <GroupInheritanceBar blockId={1} />

          {activeSection === '1.1' && <Section1_1 data={profileData} update={updateProfileData} />}
          {activeSection === '1.2' && <Section1_2 data={profileData} update={updateProfileData} />}
          {activeSection === '1.3' && <Section1_3 data={profileData} update={updateProfileData} />}
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
