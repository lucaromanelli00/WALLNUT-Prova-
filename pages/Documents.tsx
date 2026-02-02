
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { DOCUMENTS_DB, NA_WARNINGS } from '../constants';
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
  MoreVertical,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Users
} from 'lucide-react';

const PRIORITY_STYLES: Record<Priority, string> = {
  MUST: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100',
  SHOULD: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
  COULD: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
  WOULD: 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-100',
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
  const { user, documents, uploadDocument, assignDocument, markDocumentAsNotAvailable, organization, activeCompanyId } = useApp();
  const [activeArea, setActiveArea] = useState('all');
  const [activePriority, setActivePriority] = useState<Priority | 'ALL'>('ALL');
  
  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState<string | null>(null); // Doc ID
  const [modalStep, setModalStep] = useState<'FORM' | 'BATCH'>('FORM');
  const [assignForm, setAssignForm] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [selectedBatchDocs, setSelectedBatchDocs] = useState<string[]>([]);

  // Warning Modal State
  const [warningDoc, setWarningDoc] = useState<{ id: string, name: string, warning: typeof NA_WARNINGS[0] } | null>(null);

  // Retrieve available team members for the dropdown
  const availableMembers = useMemo(() => {
    if (!organization || !activeCompanyId) return [];
    
    const companyDepts = organization.departments.filter(d => d.companyId === activeCompanyId);
    const membersList: { firstName: string; lastName: string; email: string; role: string }[] = [];

    companyDepts.forEach(dept => {
      // Add Dept Owner/Delegate
      if (dept.owner && dept.owner.email) {
        membersList.push({
          firstName: dept.owner.firstName,
          lastName: dept.owner.lastName,
          email: dept.owner.email,
          role: dept.owner.role
        });
      }
      // Add Team Members
      if (dept.members) {
        dept.members.forEach(m => {
          membersList.push({
            firstName: m.firstName,
            lastName: m.lastName,
            email: m.email,
            role: m.role
          });
        });
      }
    });

    // Remove duplicates based on email
    return Array.from(new Map(membersList.map(item => [item.email, item])).values());
  }, [organization, activeCompanyId]);

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

  const handleMarkAsNA = (doc: DocumentDefinition) => {
    const warning = NA_WARNINGS[doc.id];
    if (warning) {
      setWarningDoc({ id: doc.id, name: doc.name, warning });
    } else {
      markDocumentAsNotAvailable(doc.id);
    }
  };

  const confirmNA = () => {
    if (warningDoc) {
      markDocumentAsNotAvailable(warningDoc.id);
      setWarningDoc(null);
    }
  };

  // Assign Modal Handlers
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

  const handleSelectMember = (email: string) => {
    const member = availableMembers.find(m => m.email === email);
    if (member) {
      setAssignForm({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        role: member.role
      });
    }
  };

  return (
    <div className="pb-20 relative animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Documenti & Fonti dati</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestisci la raccolta dati per l'analisi strategica.</p>
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
            <span className="text-xs font-bold uppercase tracking-wider ml-2">Filtra per</span>
         </div>
         {PRIORITIES.map(p => {
           const isActive = activePriority === p.id;
           const styleClass = p.id !== 'ALL' ? PRIORITY_STYLES[p.id as Priority] : 'bg-slate-100 text-slate-600 border-slate-200';
           
           return (
             <button
               key={p.id}
               onClick={() => setActivePriority(p.id)}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                 isActive 
                   ? (p.id === 'ALL' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : `${styleClass} ring-1 shadow-sm`)
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
                className={`bg-white border border-slate-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 group gap-4 relative overflow-hidden ${isNotAvailable ? 'opacity-70 bg-slate-50' : ''}`}
              >
                {/* Left Side: ID & Info */}
                <div className="flex items-start space-x-5 flex-1 relative z-10">
                  {/* ID Box */}
                  <div className={`h-14 w-16 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm shrink-0 transition-colors border ${
                    isNotAvailable 
                      ? 'bg-slate-100 text-slate-400 border-slate-200' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-blue-200 group-hover:text-blue-600 group-hover:bg-blue-50'
                  }`}>
                    {doc.code}
                  </div>
                  
                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${PRIORITY_STYLES[doc.priority]}`}>
                          {doc.priority}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.areaName}</span>
                    </div>
                    
                    <h3 className={`font-bold text-lg leading-tight mb-1 truncate ${isNotAvailable ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-900'}`}>
                      {doc.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-medium">
                      Richiesto: <span className="text-slate-700">{doc.versionReq}</span>
                    </p>
                  </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pl-20 md:pl-0 relative z-10">
                  
                  {/* Status Badge */}
                  <div>
                    {isUploaded ? (
                      <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                        <CheckCircle2 size={16} className="fill-emerald-200" />
                        <span className="text-xs font-bold">Caricato</span>
                      </div>
                    ) : isAssigned ? (
                      <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm">
                        <Clock size={16} />
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] font-bold opacity-60 uppercase">In carico a</span>
                          <span className="text-xs font-bold truncate max-w-[100px]">{state.assignedTo?.name.split(' ')[0]}</span>
                        </div>
                      </div>
                    ) : isNotAvailable ? (
                      <div className="flex items-center space-x-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <Ban size={16} />
                        <span className="text-xs font-bold">Non Disponibile</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <AlertCircle size={16} />
                        <span className="text-xs font-bold">Mancante</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                     {!isUploaded && !isNotAvailable && (
                        <>
                          <div className="relative group/upload">
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                              onChange={(e) => handleFileUpload(doc.id, e)}
                            />
                            <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200 hover:scale-105 active:scale-95">
                              <Upload size={18} />
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/upload:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Carica File
                            </div>
                          </div>
                          
                          {/* Assign Button */}
                          {(user?.role === 'OWNER' || (user?.role === 'DELEGATE' && user.departmentId === doc.areaId)) && (
                            <button 
                              onClick={() => setAssignModalOpen(doc.id)}
                              className="p-2.5 bg-white text-slate-500 rounded-xl border border-slate-200 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
                              title="Assegna a..."
                            >
                              <UserPlus size={18} />
                            </button>
                          )}

                          {/* N/A Button */}
                          <button
                            onClick={() => handleMarkAsNA(doc)}
                            className="p-2.5 bg-white text-slate-400 rounded-xl border border-slate-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                            title="Segna come non disponibile"
                          >
                            <Ban size={18} />
                          </button>
                        </>
                     )}
                     
                     {/* If uploaded or N/A, allow reset/view (Placeholder for future features) */}
                     {(isUploaded || isNotAvailable) && (
                        <button className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                          <MoreVertical size={18} />
                        </button>
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

                {/* Team Selection Dropdown */}
                {availableMembers.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2">
                      <Users size={14} /> Seleziona dal Team
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-medium transition-all"
                      onChange={(e) => handleSelectMember(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Scegli un collaboratore --</option>
                      {availableMembers.map(m => (
                        <option key={m.email} value={m.email}>{m.firstName} {m.lastName} ({m.role})</option>
                      ))}
                    </select>
                    
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Oppure nuovo utente</span></div>
                    </div>
                  </div>
                )}

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
                          <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold border ${PRIORITY_STYLES[doc.priority]}`}>
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

      {/* Strategic Warning Modal for N/A */}
      {warningDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 border border-white/20 relative">
            
            {/* Header with Gradient */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-8 flex items-start gap-6 border-b border-amber-100/50">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10 shrink-0 rotate-3 border border-white/50">
                <AlertTriangle size={32} className="fill-current" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-extrabold text-amber-900 tracking-tight leading-none mb-2">Impatto Strategico</h3>
                <p className="text-amber-800/80 font-medium leading-snug">
                  Il documento <span className="font-extrabold text-amber-900">"{warningDoc.name}"</span> è critico per l'analisi Wallnut.
                </p>
              </div>
              <button 
                onClick={() => setWarningDoc(null)} 
                className="absolute top-6 right-6 p-2 text-amber-900/40 hover:text-amber-900 hover:bg-amber-100/50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8">
              
              {/* Notification Box */}
              <div className="bg-slate-50 border-l-4 border-amber-400 p-6 rounded-r-2xl mb-8 shadow-sm">
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-slate-700 font-medium leading-relaxed text-lg">
                    {warningDoc.warning.notification}
                  </p>
                </div>
              </div>

              {/* Actions Stack */}
              <div className="flex flex-col gap-3">
                {/* Primary Action (Upload) */}
                <button 
                  onClick={() => setWarningDoc(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 group"
                >
                  <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                    <FileCheck size={20} />
                  </div>
                  <span className="text-lg">{warningDoc.warning.cta}</span>
                </button>
                
                {/* Secondary Action (Confirm N/A) */}
                <button 
                  onClick={confirmNA}
                  className="w-full py-3 text-slate-400 font-semibold hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all text-sm mt-2"
                >
                  Confermo che il documento non è disponibile
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
