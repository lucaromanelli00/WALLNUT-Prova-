
import React, { useState, useEffect } from 'react';
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
  Loader2,
  Check
} from 'lucide-react';

// --- SHARED COMPONENTS ---

const TextAreaInput = ({ label, value, onChange, audioKey, placeholder }: { label: string, value: string, onChange: (v: string) => void, audioKey: string, placeholder?: string }) => {
  const { saveAudioAnswer, audioAnswers } = useApp();
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleAudioSave = async (base64: string) => {
    saveAudioAnswer(audioKey, base64);
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
          className={`w-full min-h-[100px] p-4 border rounded-xl focus:outline-none focus:border-blue-500 transition-colors mb-3 text-sm text-slate-700 ${isTranscribing ? 'bg-indigo-50/30 border-indigo-200' : 'bg-slate-50 focus:bg-white border-slate-200'}`}
          placeholder={isTranscribing ? "L'IA sta scrivendo per te..." : (placeholder || "Scrivi qui o registra una risposta vocale...")}
          value={value || ''}
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

const RadioGroup = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) => (
  <div className="mb-8">
    <label className="block text-sm font-semibold text-slate-800 mb-3">{label}</label>
    <div className="flex flex-wrap gap-3">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
            value === opt 
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({ label, options, values, onChange }: { label: string, options: string[], values: string[], onChange: (v: string[]) => void }) => {
  const toggle = (opt: string) => {
    if (values.includes(opt)) onChange(values.filter(v => v !== opt));
    else onChange([...values, opt]);
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-slate-800 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(opt => {
          const isSelected = values.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl border text-left transition-all ${
                isSelected 
                ? 'bg-blue-50 border-blue-200 text-blue-800' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const LikertScale = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => {
  const levels = [
    { val: '1', label: 'Controllo' },
    { val: '2', label: 'Equilibrio' },
    { val: '3', label: 'Responsabilizzazione' },
    { val: '4', label: 'Autonomia' },
    { val: '5', label: 'Fiducia totale' }
  ];

  return (
    <div className="mb-10">
      <label className="block text-sm font-semibold text-slate-800 mb-6">{label}</label>
      <div className="relative flex justify-between items-center px-4">
        {/* Connection Line */}
        <div className="absolute left-4 right-4 h-1 bg-slate-100 top-5 -z-10"></div>
        
        {levels.map((lvl) => {
          const isSelected = value === lvl.val;
          return (
            <div key={lvl.val} className="flex flex-col items-center cursor-pointer group" onClick={() => onChange(lvl.val)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                isSelected 
                ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-100' 
                : 'bg-white text-slate-400 border-2 border-slate-200 group-hover:border-blue-400 group-hover:text-blue-500'
              }`}>
                {lvl.val}
              </div>
              <span className={`mt-3 text-xs font-medium text-center max-w-[80px] transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {lvl.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DistributionSlider = ({ data, onChange }: { data: string, onChange: (v: string) => void }) => {
  const [values, setValues] = useState({ presence: 33, autonomy: 33, results: 34 });

  useEffect(() => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.presence !== undefined) setValues(parsed);
    } catch {
      // Keep default
    }
  }, [data]);

  const handleChange = (key: keyof typeof values, val: number) => {
    const newValues = { ...values, [key]: val };
    setValues(newValues);
    onChange(JSON.stringify(newValues));
  };

  const total = values.presence + values.autonomy + values.results;
  const isBalanced = total === 100;

  return (
    <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quanto contano nella pratica?</label>
        <div className={`text-xs font-bold px-3 py-1 rounded-full ${isBalanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          Totale: {total}%
        </div>
      </div>

      <div className="space-y-6">
        {[{ k: 'presence', l: 'Presenza Fisica' }, { k: 'autonomy', l: 'Autonomia' }, { k: 'results', l: 'Risultati' }].map(item => (
          <div key={item.k}>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>{item.l}</span>
              <span>{values[item.k as keyof typeof values]}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={values[item.k as keyof typeof values]}
              onChange={e => handleChange(item.k as keyof typeof values, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        ))}
      </div>
      {!isBalanced && <p className="text-xs text-red-500 font-bold mt-4 text-center">La somma deve essere 100% per salvare correttamente.</p>}
    </div>
  );
};

const ExternalPartnersSection = ({ data, update }: { data: ProfileBlockData, update: any }) => {
  const [partners, setPartners] = useState<{ category: string, role: string }[]>([]);

  useEffect(() => {
    try {
      if (data.externalPartners) {
        setPartners(JSON.parse(data.externalPartners));
      }
    } catch { setPartners([]) }
  }, [data.externalPartners]);

  const categories = [
    "Consulenti strategici",
    "Agenzie marketing/comunicazione",
    "Partner tecnologici / IT",
    "Studi legali / fiscali",
    "Sviluppatori esterni",
    "Nessuna"
  ];

  const handleToggle = (cat: string) => {
    if (cat === "Nessuna") {
      setPartners([{ category: "Nessuna", role: "-" }]);
      update({ externalPartners: JSON.stringify([{ category: "Nessuna", role: "-" }]) });
      return;
    }

    let newPartners = [...partners.filter(p => p.category !== "Nessuna")];
    const exists = newPartners.find(p => p.category === cat);

    if (exists) {
      newPartners = newPartners.filter(p => p.category !== cat);
    } else {
      newPartners.push({ category: cat, role: 'Operativo' }); // Default role
    }
    
    setPartners(newPartners);
    update({ externalPartners: JSON.stringify(newPartners) });
  };

  const handleRoleChange = (cat: string, role: string) => {
    const newPartners = partners.map(p => p.category === cat ? { ...p, role } : p);
    setPartners(newPartners);
    update({ externalPartners: JSON.stringify(newPartners) });
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-slate-800 mb-3">Quali figure esterne collaborano stabilmente con l’azienda?</label>
      <div className="space-y-3">
        {categories.map(cat => {
          const isSelected = partners.some(p => p.category === cat);
          const currentRole = partners.find(p => p.category === cat)?.role || 'Operativo';

          return (
            <div key={cat} className={`border rounded-xl transition-all ${isSelected ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'}`}>
              <div 
                className="flex items-center space-x-3 p-4 cursor-pointer"
                onClick={() => handleToggle(cat)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span className="text-sm font-medium text-slate-700">{cat}</span>
              </div>

              {isSelected && cat !== "Nessuna" && (
                <div className="px-4 pb-4 pl-12 animate-in slide-in-from-top-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Ruolo Prevalente</p>
                  <div className="flex flex-wrap gap-2">
                    {['Operativo', 'Consulenziale', 'Decisionale', 'Misto'].map(role => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(cat, role)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          currentRole === role 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- SECTION IMPLEMENTATIONS ---

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
        
        {/* Q1: Organigram */}
        <RadioGroup 
          label="L’organigramma formale riflette il funzionamento reale dell’azienda?"
          options={["Sì, in modo coerente", "Parzialmente", "No, in modo significativo"]}
          value={data.organigramAdherence}
          onChange={(val) => update({ organigramAdherence: val })}
        />
        
        {data.organigramAdherence && data.organigramAdherence !== "Sì, in modo coerente" && (
          <div className="pl-4 border-l-2 border-orange-200 mb-8 animate-in slide-in-from-left-4">
            <TextAreaInput 
              label="In quali ambiti si discosta maggiormente?"
              value={data.organigramDivergence}
              onChange={(val) => update({ organigramDivergence: val })}
              audioKey="b1_organigramDivergence"
            />
          </div>
        )}

        {/* Q2: Key Figures */}
        <TextAreaInput 
          label="Chi sono le 3–5 figure chiave per il funzionamento dell’azienda oggi? (ruolo, ambito, responsabilità effettiva)"
          value={data.keyFigures}
          onChange={(val) => update({ keyFigures: val })}
          audioKey="b1_keyFigures"
        />

        {/* Q3: Collaborating Teams */}
        <TextAreaInput 
          label="Quali funzioni collaborano maggiormente nella pratica?"
          value={data.collaboratingTeams}
          onChange={(val) => update({ collaboratingTeams: val })}
          audioKey="b1_collaboratingTeams"
        />

        {/* Q4: External Partners */}
        <ExternalPartnersSection data={data} update={update} />

        {/* Q5: Distinctive Skills */}
        <TextAreaInput 
          label="Quali competenze interne considerate oggi distintive o strategiche?"
          value={data.distinctiveSkills}
          onChange={(val) => update({ distinctiveSkills: val })}
          audioKey="b1_distinctiveSkills"
        />

        {/* Q6: Missing Skills */}
        <TextAreaInput 
          label="Quali competenze risultano oggi mancanti o sottodimensionate?"
          value={data.missingSkills}
          onChange={(val) => update({ missingSkills: val })}
          audioKey="b1_missingSkills"
        />
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

        {/* Q1: Likert Scale */}
        <LikertScale 
          label="Come viene vissuto il rapporto tra azienda e individuo?"
          value={data.individualRelationship}
          onChange={(val) => update({ individualRelationship: val })}
        />

        {/* Q2: Distribution Slider */}
        <DistributionSlider 
          data={data.evaluationCriteria} 
          onChange={(val) => update({ evaluationCriteria: val })}
        />

        {/* Q3: Rewarded Behaviors */}
        <CheckboxGroup 
          label="Quali comportamenti vengono premiati, anche implicitamente?"
          options={["Proattività", "Velocità", "Affidabilità", "Allineamento gerarchico", "Innovazione", "Capacità relazionali"]}
          values={data.rewardedBehaviors}
          onChange={(val) => update({ rewardedBehaviors: val })}
        />

        {/* Q4: Tolerated Behaviors */}
        <CheckboxGroup 
          label="Quali comportamenti vengono tollerati pur non essendo coerenti con i valori dichiarati?"
          options={["Ritardi", "Scarsa comunicazione", "Centralizzazione eccessiva", "Resistenza al cambiamento", "Overworking"]}
          values={data.toleratedBehaviors}
          onChange={(val) => update({ toleratedBehaviors: val })}
        />

        {/* Q5: Change Reaction */}
        <RadioGroup 
          label="Come reagisce l’organizzazione al cambiamento?"
          options={["Proattiva", "Pragmatica", "Reattiva", "Difensiva"]}
          value={data.changeReaction}
          onChange={(val) => update({ changeReaction: val })}
        />

        {/* Q6: Digital Attitude */}
        <RadioGroup 
          label="Il digitale è vissuto come:"
          options={["Opportunità", "Necessità", "Imposizione"]}
          value={data.digitalAttitude}
          onChange={(val) => update({ digitalAttitude: val })}
        />
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
    let completed = 0;
    const totalSections = 3;

    // 1.1 Completion
    const s1Keys: (keyof ProfileBlockData)[] = ['organigramAdherence', 'keyFigures', 'collaboratingTeams', 'distinctiveSkills', 'missingSkills'];
    const s1Basic = s1Keys.every(k => (profileData[k] as string)?.length > 0);
    const s1Partners = profileData.externalPartners && profileData.externalPartners.length > 5; // Basic check for non-empty JSON array
    if (s1Basic && s1Partners) completed++;

    // 1.2 Completion
    const s2Keys: (keyof ProfileBlockData)[] = ['individualRelationship', 'changeReaction', 'digitalAttitude'];
    const s2Basic = s2Keys.every(k => (profileData[k] as string)?.length > 0);
    const s2Behaviors = profileData.rewardedBehaviors.length > 0;
    if (s2Basic && s2Behaviors) completed++;

    // 1.3 Completion
    if (profileData.library.length > 0) completed++;

    const percentage = Math.round((completed / totalSections) * 100);

    return { 
      percentage, 
      s1Complete: !!(s1Basic && s1Partners), 
      s2Complete: !!(s2Basic && s2Behaviors), 
      s3Complete: profileData.library.length > 0 
    };
  };

  const progress = calculateProgress();

  const handleSaveDraft = () => {
    updateBlockProgress(1, progress.percentage, 'IN_PROGRESS');
  };

  const handleCompleteBlock = () => {
    if (progress.percentage < 100) {
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
