import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { DOCUMENTS_DB } from '../constants';
import { DocumentDefinition, Priority } from '../types';
import { 
  FileText, 
  Upload, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  Search,
  Filter,
  X,
  ShieldAlert,
  Ban,
  CheckSquare,
  Square,
  ArrowRight,
  ListFilter,
  MoreVertical
} from 'lucide-react';

const PRIORITY_COLORS: Record<Priority, string> = {
  MUST: 'bg-rose-50 text-rose-600 border-rose-100',
  SHOULD: 'bg-amber-50 text-amber-600 border-amber-100',
  COULD: 'bg-blue-50 text-blue-600 border-blue-100',
  WOULD: 'bg-slate-50 text-slate-500 border-slate-100',
};

const AREAS = [
  { id: 'all', label: 'Tutte le Aree' },
  { id: 'strategy', label: 'Strategy & Governance' },
  { id: 'afc', label: 'AFC' },
  { id: 'hr', label: 'Risorse Umane' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'it', label: 'IT & Digital' },
  { id: 'legal', label: 'Legal & IP' },
];

const PRIORITIES: { id: Priority | 'ALL', label: string }[] = [
  { id: 'ALL', label: 'Tutte' },
  { id: 'MUST', label: 'Must Have' },
  { id: 'SHOULD', label: 'Should Have' },
  { id: 'COULD', label: 'Could Have' },
  { id: 'WOULD', label: 'Would Have' },
];

export const Documents = () => {
  const { user, documents, uploadDocument, assignDocument, markDocumentAsNotAvailable } = useApp();
  const [activeArea, setActiveArea] = useState('all');
  const [activePriority, setActivePriority] = useState<Priority | 'ALL'>('ALL');
  
  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState<string | null>(null); // Doc ID
  const [modalStep, setModalStep] = useState<'FORM' | 'BATCH'>('FORM');
  const [assignForm, setAssignForm] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [selectedBatchDocs, setSelectedBatchDocs] = useState<string[]>([]);

  // PERMISSION LOGIC & FILTERING
  const filteredDocs = useMemo(() => {
    return DOCUMENTS_DB.filter(doc => {
      // 1. Area Filter Check
      if (activeArea !== 'all' && doc.areaId !== activeArea) return false;

      // 2. Priority Filter Check
      if (activePriority !== 'ALL' && doc.priority !== activePriority) return false;

      // 3. Permission Check
      if (user?.role === 'OWNER') return true; // Owners see everything

      // For non-owners:
      // Check if directly assigned
      const assignment = documents[doc.id]?.assignedTo;
      const isDirectlyAssigned = assignment?.email === user?.email;
      
      // Check if belongs to their department (Delegate logic)
      const isDepartmentResponsibility = user?.role === 'DELEGATE' && user.departmentId === doc.areaId;

      return isDirectlyAssigned || isDepartmentResponsibility;
    });
  }, [activeArea, activePriority, user, documents]);

  // Get unassigned docs for batch selection (excluding current one)
  const unassignedDocs = useMemo(() => {
    return filteredDocs.filter(doc => {
      const state = documents[doc.id];
      // Exclude the one currently being assigned (assignModalOpen)
      if (doc.id === assignModalOpen) return false;
      // Exclude already processed docs
      if (state?.status === 'UPLOADED' || state?.status === 'ASSIGNED' || state?.status === 'NOT_AVAILABLE') return false;
      return true;
    });
  }, [filteredDocs, documents, assignModalOpen]);

  const handleFileUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadDocument(docId, file.name);
    }
  };

  const handleCloseModal = () => {
    setAssignModalOpen(null);
    setModalStep('FORM');
    setAssignForm({ firstName: '', lastName: '', email: '', role: '' });
    setSelectedBatchDocs([]);
  };

  const handleInitialAssign = () => {
    if (assignModalOpen && assignForm.email) {
      // Assign the first document
      assignDocument(assignModalOpen, {
        name: `${assignForm.firstName} ${assignForm.lastName}`,
        email: assignForm.email,
        role: assignForm.role
      });

      // If there are other unassigned docs, move to step 2
      if (unassignedDocs.length > 0) {
        setModalStep('BATCH');
      } else {
        handleCloseModal();
      }
    }
  };

  const handleBatchAssign = () => {
    if (selectedBatchDocs.length > 0) {
      selectedBatchDocs.forEach(docId => {
        assignDocument(docId, {
          name: `${assignForm.firstName} ${assignForm.lastName}`,
          email: assignForm.email,
          role: assignForm.role
        });
      });
    }
    handleCloseModal();
  };

  const toggleBatchSelect = (docId: string) => {
    setSelectedBatchDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="pb-20 relative animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Documenti</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestisci la raccolta dati per l'analisi LDE.</p>
        </div>
      </div>

      {/* Main Filter: Areas */}
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {AREAS.map(area => (
          <button
            key={area.id}
            onClick={() => setActiveArea(area.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeArea === area.id 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-105' 
                : 'bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200'
            }`}
          >
            {area.label}
          </button>
        ))}
      </div>

      {/* Secondary Filter: Priorities */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-4 no-scrollbar">
         <div className="flex items-center text-slate-400 mr-2 px-2 shrink-0">
            <ListFilter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider ml-2">Priorità</span>
         </div>
         {PRIORITIES.map(p => {
           const isActive = activePriority === p.id;
           const colorClass = p.id !== 'ALL' ? PRIORITY_COLORS[p.id as Priority] : 'bg-slate-100 text-slate-600 border-slate-200';
           
           return (
             <button
               key={p.id}
               onClick={() => setActivePriority(p.id)}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                 isActive 
                   ? (p.id === 'ALL' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : `${colorClass} ring-2 ring-offset-1 ring-slate-200 shadow-sm`)
                   : (p.id === 'ALL' ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 opacity-60 hover:opacity-100')
               }`}
             >
               {p.label}
             </button>
           );
         })}
      </div>

      {/* Content List */}
      {filteredDocs.length === 0 ? (
        <div className="glass-panel rounded-[2rem] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400 rotate-3">
            <ShieldAlert size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Nessun documento trovato</h3>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Non ci sono documenti che corrispondono ai filtri selezionati o non hai i permessi necessari per visualizzarli.
          </p>
          {(activeArea !== 'all' || activePriority !== 'ALL') && (
            <button 
              onClick={() => { setActiveArea('all'); setActivePriority('ALL'); }}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Rimuovi filtri
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const state = documents[doc.id];
            const isUploaded = state?.status === 'UPLOADED';
            const isAssigned = state?.status === 'ASSIGNED';
            const isNotAvailable = state?.status === 'NOT_AVAILABLE';

            return (
              <div 
                key={doc.id} 
                className="bg-white/80 border border-slate-100 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg hover:border-slate-200 hover:bg-white transition-all duration-300 group gap-4"
              >
                {/* Left Side: ID & Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* ID Box */}
                  <div className={`h-12 w-16 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm shrink-0 transition-colors ${
                    isNotAvailable 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                      : 'bg-white border border-slate-200 text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600'
                  }`}>
                    {doc.code}
                  </div>
                  
                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-lg leading-tight mb-1 truncate ${isNotAvailable ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-900'}`}>
                      {doc.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                       <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{doc.areaName}</span>
                       <span className="text-slate-300">•</span>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${PRIORITY_COLORS[doc.priority]}`}>
                          {doc.priority}
                       </span>
                       <span className="hidden sm:inline text-slate-300">•</span>
                       <span className="hidden sm:inline text-xs text-slate-500">{doc.versionReq}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 pl-20 md:pl-0">
                  
                  {/* Status Badge */}
                  <div>
                    {isUploaded ? (
                      <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <CheckCircle2 size={14} />
                        <span>Caricato</span>
                      </div>
                    ) : isAssigned ? (
                      <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                        <Clock size={14} />
                        <span className="truncate max-w-[100px]">In corso: {state.assignedTo?.name.split(' ')[0]}</span>
                      </div>
                    ) : isNotAvailable ? (
                      <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Ban size={14} />
                        <span>N/A</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400 text-xs px-3 py-1.5 font-medium">
                        <AlertCircle size={14} />
                        <span>Mancante</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                     {!isUploaded && !isNotAvailable && (
                        <>
                          <div className="relative">
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              onChange={(e) => handleFileUpload(doc.id, e)}
                            />
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all border border-blue-100 shadow-sm" title="Carica File">
                              <Upload size={18} />
                            </button>
                          </div>
                          
                          {/* Assign Button */}
                          {(user?.role === 'OWNER' || (user?.role === 'DELEGATE' && user.departmentId === doc.areaId)) && (
                            <button 
                              onClick={() => setAssignModalOpen(doc.id)}
                              className="p-2 bg-white text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-all border border-slate-200 shadow-sm" 
                              title="Assegna a..."
                            >
                              <UserPlus size={18} />
                            </button>
                          )}

                          {/* N/A Button */}
                          {doc.priority !== 'MUST' && (
                            <button
                              onClick={() => markDocumentAsNotAvailable(doc.id)}
                              className="p-2 bg-white text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all border border-slate-200 shadow-sm"
                              title="Non Disponibile"
                            >
                              <Ban size={18} />
                            </button>
                          )}
                        </>
                     )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg p-0 overflow-hidden animate-in zoom-in-95 border border-white/50">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h3 className="text-xl font-bold text-slate-900">
                {modalStep === 'FORM' ? 'Assegna Documento' : 'Assegnazione Multipla'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* STEP 1: FORM */}
            {modalStep === 'FORM' && (
              <div className="p-8">
                <div className="bg-blue-50/50 p-4 rounded-2xl mb-8 border border-blue-100">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">Documento Selezionato</p>
                  <p className="font-bold text-slate-800 text-lg">{DOCUMENTS_DB.find(d => d.id === assignModalOpen)?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nome</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                      placeholder="Mario"
                      value={assignForm.firstName}
                      onChange={e => setAssignForm({...assignForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Cognome</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                      placeholder="Rossi"
                      value={assignForm.lastName}
                      onChange={e => setAssignForm({...assignForm, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Aziendale</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="mario.rossi@azienda.com"
                    value={assignForm.email}
                    onChange={e => setAssignForm({...assignForm, email: e.target.value})}
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Ruolo</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="Es. Responsabile Amministrativo"
                    value={assignForm.role}
                    onChange={e => setAssignForm({...assignForm, role: e.target.value})}
                  />
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={handleCloseModal}
                    className="flex-1 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    Annulla
                  </button>
                  <button 
                    onClick={handleInitialAssign}
                    disabled={!assignForm.email || !assignForm.firstName || !assignForm.lastName}
                    className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-[1.02] shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Assegna</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BATCH SELECTION */}
            {modalStep === 'BATCH' && (
              <div className="p-8">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-6 flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Primo documento assegnato!</p>
                    <p className="text-xs font-medium text-emerald-700 mt-1 leading-relaxed">
                      Vuoi assegnare altri documenti mancanti a <br/><span className="font-bold">{assignForm.firstName} {assignForm.lastName}</span>?
                    </p>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto mb-8 border border-slate-100 rounded-2xl divide-y divide-slate-50 bg-slate-50/50">
                  {unassignedDocs.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm font-medium">Nessun altro documento da assegnare in questa vista.</div>
                  ) : (
                    unassignedDocs.map(doc => (
                      <div 
                        key={doc.id} 
                        onClick={() => toggleBatchSelect(doc.id)}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${selectedBatchDocs.includes(doc.id) ? 'bg-blue-50/50' : 'hover:bg-white'}`}
                      >
                        <div className="flex items-center space-x-4 overflow-hidden">
                          <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold border ${PRIORITY_COLORS[doc.priority]}`}>
                            {doc.priority.charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="text-sm font-bold text-slate-700 truncate">{doc.name}</div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase">{doc.areaName}</div>
                          </div>
                        </div>
                        <div className={`text-blue-600 flex-shrink-0 transition-all duration-300 ${selectedBatchDocs.includes(doc.id) ? 'opacity-100 scale-110' : 'opacity-20 scale-100'}`}>
                          {selectedBatchDocs.includes(doc.id) ? <CheckSquare size={22} /> : <Square size={22} />}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={handleCloseModal}
                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl text-sm transition-all"
                  >
                    No, ho finito
                  </button>
                  <button 
                    onClick={handleBatchAssign}
                    disabled={selectedBatchDocs.length === 0}
                    className="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-[1.02] disabled:opacity-50 transition-all text-sm shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>Assegna {selectedBatchDocs.length} Documenti</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};