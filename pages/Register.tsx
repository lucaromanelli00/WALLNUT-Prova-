import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Logo } from '../components/Logo';
import { 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  User, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  Globe, 
  Box, 
  Briefcase,
  Users, 
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  UserCheck,
  Copy,
  Image,
  X
} from 'lucide-react';
import { CompanyDetails, DepartmentConfig } from '../types';

// --- Constants ---
const DEPARTMENTS_LIST = [
  "Strategy & Governance",
  "Amministrazione, Finanza & Controllo (AFC)",
  "Risorse Umane (HR)",
  "Commerciale & Marketing",
  "IT & Digital",
  "Legal & IP"
];

const STEPS = [
  "Benvenuto",
  "Metodologia LDE",
  "I tuoi Dati",
  "Struttura Aziendale",
  "Dettagli Azienda",
  "Ruoli",
  "Aree Funzionali",
  "Riepilogo"
];

// --- Components ---

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => (
  <div className="w-full bg-slate-100 h-1.5 mt-8 mb-8 flex">
    {Array.from({ length: totalSteps }).map((_, idx) => (
      <div 
        key={idx}
        className={`h-full flex-1 transition-all duration-300 ${
          idx <= currentStep ? 'bg-blue-600' : 'bg-transparent'
        } ${idx > 0 ? 'border-l border-white' : ''}`}
      />
    ))}
  </div>
);

export const Register = () => {
  const navigate = useNavigate();
  const { registerOwner, addNotification } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- State ---
  // User Data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '' // CEO, COO, Founder...
  });

  // Structure Type
  const [structureType, setStructureType] = useState<'SINGLE' | 'GROUP'>('SINGLE');

  // Companies List
  const [companies, setCompanies] = useState<CompanyDetails[]>([
    { id: 'c1', name: '', vat: '', isMain: true, outputType: 'Product', geoPresence: 'National', sizeClass: 'Small', employeeCount: '' }
  ]);
  const [activeCompanyIndex, setActiveCompanyIndex] = useState(0); // For Details Step
  const [activeDeptCompanyIndex, setActiveDeptCompanyIndex] = useState(0); // For Departments Step

  // Departments (Now stores ALL departments for ALL companies)
  const [departments, setDepartments] = useState<DepartmentConfig[]>([]);
  
  // Dropdown state for Copy functionality
  const [openCopyDropdown, setOpenCopyDropdown] = useState<string | null>(null);

  // Initialize departments when companies change
  useEffect(() => {
    // Generate department config for existing companies if not present
    setDepartments(prevDepts => {
      const newDepts = [...prevDepts];
      
      companies.forEach(company => {
        // Check if this company already has its departments initialized
        const hasDepts = newDepts.some(d => d.companyId === company.id);
        
        if (!hasDepts) {
          // Add default departments for this company
          DEPARTMENTS_LIST.forEach(name => {
            newDepts.push({
              id: `${company.id}-${name.toLowerCase().replace(/\s/g, '-')}`,
              name,
              companyId: company.id,
              enabled: true, // Always enabled/mandatory now
              isExternal: false,
              owner: { firstName: '', lastName: '', email: '', role: '' },
              members: [] // Initialize empty members list
            });
          });
        }
      });

      // Cleanup: Remove departments for deleted companies
      return newDepts.filter(d => companies.some(c => c.id === d.companyId));
    });
  }, [companies]);

  // --- Handlers ---
  const handleAddCompany = () => {
    setCompanies([
      ...companies, 
      { 
        id: `c${Date.now()}`, // Use timestamp to ensure unique ID
        name: '', 
        vat: '', 
        isMain: false,
        outputType: 'Service',
        geoPresence: 'Local',
        sizeClass: 'Micro',
        employeeCount: ''
      }
    ]);
  };

  const handleRemoveCompany = (index: number) => {
    if (companies[index].isMain) return;
    const newCompanies = [...companies];
    newCompanies.splice(index, 1);
    setCompanies(newCompanies);
    if (activeCompanyIndex >= index && activeCompanyIndex > 0) setActiveCompanyIndex(activeCompanyIndex - 1);
    if (activeDeptCompanyIndex >= index && activeDeptCompanyIndex > 0) setActiveDeptCompanyIndex(activeDeptCompanyIndex - 1);
  };

  const updateCompany = (index: number, field: keyof CompanyDetails, value: any) => {
    const newCompanies = [...companies];
    newCompanies[index] = { ...newCompanies[index], [field]: value };
    setCompanies(newCompanies);
  };

  const handleLogoUpload = (index: number, file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCompany(index, 'logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateDeptOwner = (companyId: string, deptName: string, field: string, value: any) => {
    setDepartments(prev => prev.map(d => {
      if (d.companyId === companyId && d.name === deptName) {
        if (field === 'isExternal') {
           return { ...d, isExternal: value };
        }
        return { 
          ...d, 
          owner: { ...d.owner!, [field]: value } 
        };
      }
      return d;
    }));
  };

  const assignOwnerToDept = (companyId: string, deptName: string) => {
    setDepartments(prev => prev.map(d => {
      if (d.companyId === companyId && d.name === deptName) {
        return {
          ...d,
          isExternal: false,
          owner: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role
          }
        };
      }
      return d;
    }));
  };

  const copyDelegateFromCompany = (targetCompanyId: string, sourceCompanyId: string, deptName: string) => {
    const sourceDept = departments.find(d => d.companyId === sourceCompanyId && d.name === deptName);
    const sourceCompanyName = companies.find(c => c.id === sourceCompanyId)?.name || 'altra azienda';
    
    // Close dropdown
    setOpenCopyDropdown(null);

    if (sourceDept && sourceDept.owner) {
      // Validate source data existence
      const hasData = sourceDept.owner.firstName || sourceDept.owner.email || sourceDept.isExternal;

      if (!hasData) {
        addNotification('info', `Nessun dato presente in ${sourceCompanyName} per l'area ${deptName}.`);
        return;
      }

      setDepartments(prev => prev.map(d => {
        if (d.companyId === targetCompanyId && d.name === deptName) {
          return {
            ...d,
            isExternal: sourceDept.isExternal,
            owner: { 
              firstName: sourceDept.owner?.firstName || '',
              lastName: sourceDept.owner?.lastName || '',
              email: sourceDept.owner?.email || '',
              role: sourceDept.owner?.role || ''
            }
          };
        }
        return d;
      }));
      
      addNotification('success', `Dati copiati da ${sourceCompanyName}.`);
    } else {
      addNotification('error', 'Errore nel recupero dati.');
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    registerOwner(
      {
        id: 'new-owner',
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        jobTitle: userData.role,
        role: 'OWNER',
        assignedBlocks: [1, 2, 3, 4, 5]
      },
      {
        type: structureType,
        companies,
        departments
      }
    );
    navigate('/');
  };

  // --- Steps Renderers ---

  // Step 0: Welcome
  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center text-center h-full animate-in zoom-in duration-500">
      <div className="mb-8">
        <Logo size={100} />
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
        Benvenuto nel Futuro.
      </h1>
      <p className="text-xl text-slate-500 max-w-2xl leading-relaxed mb-10">
        Wallnut è la piattaforma che trasforma la strategia in esecuzione. 
        Stai per costruire il <span className="text-blue-600 font-bold">Digital Twin</span> della tua organizzazione.
      </p>
      <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 shadow-xl flex items-center space-x-2">
        <span>Inizia Configurazione</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );

  // Step 1: LDE Methodology
  const renderLDE = () => (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Il Metodo LDE</h2>
        <p className="text-slate-500 mt-2">Automatizziamo il nostro approccio consulenziale per te.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl hover:shadow-lg transition-all">
          <div className="text-emerald-600 font-black text-4xl mb-4">L</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">LEARN</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Apprendimento e raccolta dati insight e idee attraverso survey, interviste e focus group. 
            Analisi del contesto (Stakeholder), Mercato e definizione dei KPI.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:shadow-lg transition-all">
          <div className="text-slate-600 font-black text-4xl mb-4">D</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">DESIGN</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Co-progettazione della Vision e disegno degli scenari futuri. 
            Definizione Workflow, Service Design e Business Model per trasformare input in progetti.
          </p>
        </div>
        <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl hover:shadow-lg transition-all shadow-xl">
          <div className="text-slate-900 font-black text-4xl mb-4">E</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">EXECUTE</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Esecuzione basata su obiettivi condivisi. Implementazione di soluzioni organizzative 
            o tecnologiche, consulenza e formazione mirata.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2">
          <span>Ho capito</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // Step 2: User Data
  const renderUserData = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Chi guida il progetto?</h2>
        <p className="text-slate-500">Inserisci i tuoi dati come Project Lead.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nome</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            placeholder="Mario"
            value={userData.firstName}
            onChange={e => setUserData({...userData, firstName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Cognome</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            placeholder="Rossi"
            value={userData.lastName}
            onChange={e => setUserData({...userData, lastName: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Aziendale</label>
        <input 
          type="email" 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          placeholder="mario.rossi@azienda.com"
          value={userData.email}
          onChange={e => setUserData({...userData, email: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Ruolo in Azienda</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          placeholder="Es. CEO, Founder, COO..."
          value={userData.role}
          onChange={e => setUserData({...userData, role: e.target.value})}
        />
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={() => setStep(1)} className="text-slate-500 font-semibold hover:text-slate-800">Indietro</button>
        <button 
          onClick={() => setStep(3)} 
          disabled={!userData.firstName || !userData.lastName || !userData.email || !userData.role}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center space-x-2"
        >
          <span>Continua</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // Step 3: Structure Type & Basic Info
  const renderStructure = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Struttura Aziendale</h2>
        <p className="text-slate-500">Definisci il perimetro legale dell'organizzazione.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setStructureType('SINGLE')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${structureType === 'SINGLE' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <Building className={`mb-4 ${structureType === 'SINGLE' ? 'text-blue-600' : 'text-slate-400'}`} size={32} />
          <h3 className="font-bold text-lg text-slate-900">Azienda Singola</h3>
          <p className="text-sm text-slate-500 mt-1">Unica entità legale.</p>
        </button>
        <button 
          onClick={() => setStructureType('GROUP')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${structureType === 'GROUP' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex -space-x-2 mb-4">
            <Building className={`${structureType === 'GROUP' ? 'text-blue-600' : 'text-slate-400'}`} size={32} />
            <Building className={`${structureType === 'GROUP' ? 'text-blue-400' : 'text-slate-300'}`} size={32} />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Gruppo / Holding</h3>
          <p className="text-sm text-slate-500 mt-1">Multi-entity o controllate.</p>
        </button>
      </div>

      <div className="space-y-6">
        {companies.map((company, index) => (
          <div key={company.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
             {index > 0 && (
                <button onClick={() => handleRemoveCompany(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
             )}
             <h4 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
               {company.isMain ? <Shield size={16} className="text-blue-600" /> : <Building size={16} className="text-slate-400" />}
               <span>{company.isMain ? (structureType === 'GROUP' ? 'Holding / Capogruppo' : 'Dati Azienda') : `Controllata #${index}`}</span>
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Ragione Sociale</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                    value={company.name}
                    onChange={(e) => updateCompany(index, 'name', e.target.value)}
                    placeholder="Acme S.p.A."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Partita IVA</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                    value={company.vat}
                    onChange={(e) => updateCompany(index, 'vat', e.target.value)}
                    placeholder="IT000..."
                  />
                </div>
                {/* Upload Logo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Logo Aziendale (Opzionale)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      id={`logo-${index}`} 
                      onChange={(e) => e.target.files && handleLogoUpload(index, e.target.files[0])} 
                    />
                    <label htmlFor={`logo-${index}`} className="flex items-center justify-between w-full px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="text-sm text-slate-600 truncate">{company.logo ? 'Logo caricato' : 'Carica Logo...'}</span>
                      <Image size={16} className="text-slate-400" />
                    </label>
                  </div>
                  {company.logo && (
                    <div className="mt-2">
                      <img src={company.logo} alt="Preview" className="h-8 w-auto object-contain rounded border border-slate-200" />
                    </div>
                  )}
                </div>
                {/* Upload Visura */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Visura Camerale (PDF)</label>
                  <div className="relative">
                    <input type="file" className="hidden" id={`file-${index}`} onChange={(e) => updateCompany(index, 'visuraFile', e.target.files?.[0]?.name)} />
                    <label htmlFor={`file-${index}`} className="flex items-center justify-between w-full px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="text-sm text-slate-600 truncate">{company.visuraFile || 'Carica PDF...'}</span>
                      <Upload size={16} className="text-slate-400" />
                    </label>
                  </div>
                </div>
             </div>
          </div>
        ))}
        
        {structureType === 'GROUP' && (
          <button onClick={handleAddCompany} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center space-x-2">
            <Plus size={20} />
            <span>Aggiungi Società al Gruppo</span>
          </button>
        )}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={() => setStep(2)} className="text-slate-500 font-semibold hover:text-slate-800">Indietro</button>
        <button 
          onClick={() => setStep(4)} 
          disabled={companies.some(c => !c.name || !c.vat || !c.visuraFile)}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center space-x-2"
        >
          <span>Continua</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // Step 4: Company Details
  const renderDetails = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dettagli Operativi</h2>
        <p className="text-slate-500">Classificazione e dimensionamento.</p>
      </div>

      {structureType === 'GROUP' && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {companies.map((c, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCompanyIndex(idx)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeCompanyIndex === idx ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name || `Azienda ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">{companies[activeCompanyIndex].name}</h3>
        
        <div className="space-y-6">
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-3">Output Principale</label>
             <div className="grid grid-cols-3 gap-3">
               {['Product', 'Service', 'Digital'].map(opt => (
                 <button
                   key={opt}
                   onClick={() => updateCompany(activeCompanyIndex, 'outputType', opt)}
                   className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                     companies[activeCompanyIndex].outputType === opt 
                     ? 'bg-blue-50 border-blue-500 text-blue-700' 
                     : 'border-slate-200 text-slate-600 hover:border-slate-300'
                   }`}
                 >
                   {opt === 'Product' ? 'Prodotto Fisico' : opt === 'Service' ? 'Servizi' : 'Prod. Digitale'}
                 </button>
               ))}
             </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-3">Presenza Geografica</label>
             <div className="grid grid-cols-3 gap-3">
               {['Local', 'National', 'Multinational'].map(opt => (
                 <button
                   key={opt}
                   onClick={() => updateCompany(activeCompanyIndex, 'geoPresence', opt)}
                   className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                     companies[activeCompanyIndex].geoPresence === opt 
                     ? 'bg-blue-50 border-blue-500 text-blue-700' 
                     : 'border-slate-200 text-slate-600 hover:border-slate-300'
                   }`}
                 >
                   {opt === 'Local' ? 'Locale' : opt === 'National' ? 'Nazionale' : 'Multinazionale'}
                 </button>
               ))}
             </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-3">Dimensione Azienda</label>
             <div className="grid grid-cols-4 gap-2">
               {['Micro', 'Small', 'Medium', 'Large'].map(opt => (
                 <button
                   key={opt}
                   onClick={() => updateCompany(activeCompanyIndex, 'sizeClass', opt)}
                   className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                     companies[activeCompanyIndex].sizeClass === opt 
                     ? 'bg-blue-50 border-blue-500 text-blue-700' 
                     : 'border-slate-200 text-slate-600 hover:border-slate-300'
                   }`}
                 >
                   {opt}
                 </button>
               ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Numero Dipendenti</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              placeholder="Es. 45"
              value={companies[activeCompanyIndex].employeeCount}
              onChange={e => updateCompany(activeCompanyIndex, 'employeeCount', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={() => setStep(3)} className="text-slate-500 font-semibold hover:text-slate-800">Indietro</button>
        <button 
          onClick={() => {
            const allValid = companies.every(c => c.employeeCount && c.outputType && c.geoPresence && c.sizeClass);
            if (allValid) setStep(5);
            else alert("Compila i dettagli per tutte le aziende del gruppo.");
          }} 
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <span>Continua</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // Step 5: Roles Info (Static)
  const renderRolesInfo = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">I Ruoli in Wallnut</h2>
        <p className="text-slate-500 mt-2">Capire chi fa cosa è fondamentale per il successo del metodo LDE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl transform scale-105 border-2 border-blue-500">
          <Shield className="mb-4 text-blue-400" size={32} />
          <h3 className="text-xl font-bold mb-2">OWNER</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tu. Hai la visione completa, gestisci la strategia, inviti gli altri utenti e validi gli output finali.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Briefcase className="mb-4 text-indigo-500" size={32} />
          <h3 className="text-xl font-bold text-slate-800 mb-2">DELEGATO</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Responsabile di area (es. HR Manager). Carica documenti, assegna task e gestisce il suo blocco specifico.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Users className="mb-4 text-emerald-500" size={32} />
          <h3 className="text-xl font-bold text-slate-800 mb-2">ADVISOR</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Consulente esterno o specialista. Supporta nella compilazione e revisione tecnica dei contenuti.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <User className="mb-4 text-slate-400" size={32} />
          <h3 className="text-xl font-bold text-slate-800 mb-2">DIPENDENTE</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Contributore puntuale. Partecipa a survey, interviste video o focus group quando richiesto.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={() => setStep(4)} className="text-slate-500 font-semibold hover:text-slate-800">Indietro</button>
        <button onClick={() => setStep(6)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2">
          <span>Configura Team</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // Step 6: Functional Areas & Invites (Group Support Added)
  const renderAreas = () => {
    const activeCompany = companies[activeDeptCompanyIndex];
    const companyDepts = departments.filter(d => d.companyId === activeCompany.id);
    const otherCompanies = companies.filter(c => c.id !== activeCompany.id);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Mappa Organizzativa</h2>
          <p className="text-slate-500">Definisci i responsabili per ogni area funzionale.</p>
        </div>

        {structureType === 'GROUP' && (
          <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-100">
            {companies.map((c, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveDeptCompanyIndex(idx)}
                className={`px-4 py-2 rounded-t-xl text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeDeptCompanyIndex === idx 
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c.name || `Azienda ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 text-sm text-blue-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p>
              Tutte le aree funzionali sono <strong>obbligatorie</strong> per garantire una mappatura completa. 
              Se un'area è gestita da un consulente esterno, seleziona l'opzione apposita.
            </p>
          </div>

          {companyDepts.map((dept, index) => {
            const isDropdownOpen = openCopyDropdown === dept.id;

            return (
              <div key={dept.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-visible">
                <div className="p-5 flex items-center justify-between bg-slate-50/50 border-b border-slate-100 rounded-t-2xl relative">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                       <Layers size={20} />
                     </div>
                     <span className="font-bold text-lg text-slate-900">{dept.name}</span>
                  </div>
                  
                  {/* Copy Logic for Groups */}
                  {structureType === 'GROUP' && otherCompanies.length > 0 && (
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setOpenCopyDropdown(isDropdownOpen ? null : dept.id)}
                        className={`flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isDropdownOpen ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}
                      >
                        <Copy size={14} />
                        <span>Copia da...</span>
                        {isDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 mb-1">Seleziona Fonte</div>
                          {otherCompanies.map(oc => (
                            <button
                              key={oc.id}
                              type="button"
                              onClick={() => copyDelegateFromCompany(activeCompany.id, oc.id, dept.name)}
                              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center justify-between group"
                            >
                              <span>{oc.name}</span>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-blue-500" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Responsabile Area (Delegato)</p>
                    
                    <div className="flex items-center gap-3">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={dept.isExternal}
                          onChange={(e) => updateDeptOwner(activeCompany.id, dept.name, 'isExternal', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium text-slate-600">Gestito da Advisor Esterno</span>
                      </label>

                      <button 
                        type="button"
                        onClick={() => assignOwnerToDept(activeCompany.id, dept.name)}
                        className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <UserCheck size={14} />
                        <span>Assegna a me stesso</span>
                      </button>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${dept.isExternal ? 'opacity-90' : ''}`}>
                     <input 
                        type="text" 
                        placeholder="Nome"
                        className={`px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 ${dept.isExternal ? 'ring-2 ring-orange-100' : ''}`}
                        value={dept.owner?.firstName}
                        onChange={e => updateDeptOwner(activeCompany.id, dept.name, 'firstName', e.target.value)}
                     />
                     <input 
                        type="text" 
                        placeholder="Cognome"
                        className={`px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 ${dept.isExternal ? 'ring-2 ring-orange-100' : ''}`}
                        value={dept.owner?.lastName}
                        onChange={e => updateDeptOwner(activeCompany.id, dept.name, 'lastName', e.target.value)}
                     />
                     <input 
                        type="email" 
                        placeholder="Email Aziendale"
                        className={`px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 ${dept.isExternal ? 'ring-2 ring-orange-100' : ''}`}
                        value={dept.owner?.email}
                        onChange={e => updateDeptOwner(activeCompany.id, dept.name, 'email', e.target.value)}
                     />
                     <input 
                        type="text" 
                        placeholder={dept.isExternal ? "Ruolo (es. Consulente Esterno)" : "Ruolo (Job Title)"}
                        className={`px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 ${dept.isExternal ? 'ring-2 ring-orange-100' : ''}`}
                        value={dept.owner?.role}
                        onChange={e => updateDeptOwner(activeCompany.id, dept.name, 'role', e.target.value)}
                     />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-8">
          <button onClick={() => setStep(5)} className="text-slate-500 font-semibold hover:text-slate-800">Indietro</button>
          <button 
            onClick={() => {
              // Validate ALL departments for ALL companies
              const allFilled = departments.every(d => 
                d.owner?.firstName && d.owner?.lastName && d.owner?.email && d.owner?.role
              );
              
              if (allFilled) {
                setStep(7);
              } else {
                alert("Compila tutti i campi obbligatori per tutte le aree funzionali e per tutte le aziende.");
              }
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2"
          >
            <span>Vedi Riepilogo</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Step 7: Summary
  const renderSummary = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Riepilogo Configurazione</h2>
        <p className="text-slate-500 mt-2">Tutto pronto per lanciare il tuo workspace.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* User */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
               {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
             </div>
             <div>
               <h3 className="font-bold text-lg text-slate-900">{userData.firstName} {userData.lastName}</h3>
               <p className="text-slate-500 text-sm">{userData.role} • {userData.email}</p>
             </div>
             <div className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">OWNER</div>
          </div>
        </div>

        {/* Structure */}
        <div className="p-6 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Struttura {structureType === 'GROUP' ? 'Gruppo' : 'Azienda'}</h4>
          <div className="space-y-4">
            {companies.map((c, i) => (
              <div key={i} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="flex items-center space-x-2">
                    {c.logo && <img src={c.logo} alt="Logo" className="w-6 h-6 object-contain" />}
                    <span className="font-bold text-slate-800">{c.name}</span>
                    {c.isMain && <Shield size={14} className="text-blue-500" />}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {c.vat} • {c.geoPresence} • {c.sizeClass} ({c.employeeCount} dip.)
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  <FileText size={12} />
                  <span>{c.visuraFile}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments & Invites */}
        <div className="p-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Team & Aree Attive</h4>
          {companies.map((company) => {
            const companyDepts = departments.filter(d => d.companyId === company.id);
            return (
              <div key={company.id} className="mb-6 last:mb-0">
                <h5 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Building size={14} />
                  {company.name}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyDepts.map(d => (
                    <div key={d.id} className={`border rounded-xl p-4 flex items-start space-x-3 ${d.isExternal ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${d.isExternal ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Layers size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm text-slate-800 truncate">{d.name}</p>
                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {d.isExternal && <span className="text-orange-600 font-bold mr-1">[Advisor]</span>}
                            <span className="text-slate-700 font-medium">{d.owner?.firstName} {d.owner?.lastName}</span>
                          </p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(6)} className="text-slate-500 font-semibold hover:text-slate-800">Indietro</button>
        <button 
          onClick={handleFinalSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center space-x-3 disabled:opacity-70"
        >
          {loading ? (
             <span>Creazione workspace in corso...</span>
          ) : (
            <>
              <span>Conferma e Inizia</span>
              <CheckCircle2 size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar / Progress (Desktop) */}
      <div className="hidden md:flex w-80 bg-white border-r border-slate-200 flex-col p-8 fixed inset-y-0 left-0 z-10">
        <div className="mb-12">
           <Logo showText size={28} />
        </div>
        
        <div className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100 -z-0"></div>
          
          {STEPS.map((label, idx) => (
            <div key={idx} className="flex items-center space-x-4 relative z-10">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                idx === step 
                  ? 'border-blue-600 bg-blue-600 text-white scale-110' 
                  : idx < step 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-slate-200 bg-white text-slate-400'
              }`}>
                {idx < step ? <CheckCircle2 size={12} /> : idx + 1}
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${idx === step ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-80">
         {/* Mobile Header */}
         <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-20">
           <span className="font-bold">Step {step + 1} di {STEPS.length}</span>
           <div className="ml-auto w-32">
             <StepIndicator currentStep={step} totalSteps={STEPS.length} />
           </div>
         </div>

         <div className="p-6 md:p-12 lg:p-16 min-h-screen flex flex-col justify-center">
            {step === 0 && renderWelcome()}
            {step === 1 && renderLDE()}
            {step === 2 && renderUserData()}
            {step === 3 && renderStructure()}
            {step === 4 && renderDetails()}
            {step === 5 && renderRolesInfo()}
            {step === 6 && renderAreas()}
            {step === 7 && renderSummary()}
         </div>
      </div>
    </div>
  );
};