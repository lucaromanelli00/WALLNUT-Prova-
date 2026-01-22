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
  ArrowRight
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

export const Documents = () => {
  const { user, documents, uploadDocument, assignDocument, markDocumentAsNotAvailable } = useApp();
  const [activeArea, setActiveArea] = useState('all');
  
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

      // 2. Permission Check
      if (user?.role === 'OWNER') return true; // Owners see everything

      // For non-owners:
      // Check if directly assigned
      const assignment = documents[doc.id]?.assignedTo;
      const isDirectlyAssigned = assignment?.email === user?.email;
      
      // Check if belongs to their department (Delegate logic)
      const isDepartmentResponsibility = user?.role === 'DELEGATE' && user.departmentId === doc.areaId;

      return isDirectlyAssigned || isDepartmentResponsibility;
    });
  }, [activeArea, user, documents]);

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

  const handleFileUpload = (docId: string) => {
    const fileName = "documento_caricato.pdf";
    uploadDocument(docId, fileName);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Documenti</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestisci la raccolta dati per l'analisi LDE.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
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

      {/* Empty State / Table */}
      {filteredDocs.length === 0 ? (
        <div className="glass-panel rounded-[2rem] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400 rotate-3">
            <ShieldAlert size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Nessun documento disponibile</h3>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Non hai permessi per visualizzare documenti in questa sezione o non ti sono stati ancora assegnati task dall'Owner.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-[2.5rem] shadow-sm overflow-hidden border border-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-8 py-6">Documento</th>
                  <th className="px-8 py-6">Priorità</th>
                  <th className="px-8 py-6">Requisiti</th>
                  <th className="px-8 py-6">Stato</th>
                  <th className="px-8 py-6 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDocs.map((doc) => {
                  const state = documents[doc.id];
                  const isUploaded = state?.status === 'UPLOADED';
                  const isAssigned = state?.status === 'ASSIGNED';
                  const isNotAvailable = state?.status === 'NOT_AVAILABLE';

                  return (
                    <tr key={doc.id} className="hover:bg-white/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${isNotAvailable ? 'bg-slate-100 text-slate-400' : 'bg-white border border-slate-100 text-slate-600'}`}>
                            {doc.code}
                          </div>
                          <div>
                            <div className={`font-bold text-base ${isNotAvailable ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{doc.name}</div>
                            <div className="text-xs font-semibold text-slate-400 mt-0.5">{doc.areaName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border ${PRIORITY_COLORS[doc.priority]}`}>
                          {doc.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">
                        {doc.versionReq}
                      </td>
                      <td className="px-8 py-5">
                        {isUploaded ? (
                          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                            <CheckCircle2 size={16} />
                            <span>Caricato</span>
                          </div>
                        ) : isAssigned ? (
                          <div className="flex items-center space-x-2 text-amber-600 font-bold text-sm bg-amber-50 px-3 py-1.5 rounded-full w-fit">
                            <Clock size={16} />
                            <span>In corso: {state.assignedTo?.name}</span>
                          </div>
                        ) : isNotAvailable ? (
                          <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-full w-fit">
                            <Ban size={16} />
                            <span>N/A</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-slate-400 text-sm px-3 py-1.5">
                            <AlertCircle size={16} />
                            <span>Mancante</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {!isUploaded && !isNotAvailable && (
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <div className="relative">
                              <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                onChange={() => handleFileUpload(doc.id)}
                              />
                              <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all" title="Carica File">
                                <Upload size={18} />
                              </button>
                            </div>
                            
                            {/* Only owners or department heads can assign to others */}
                            {(user?.role === 'OWNER' || (user?.role === 'DELEGATE' && user.departmentId === doc.areaId)) && (
                              <button 
                                onClick={() => setAssignModalOpen(doc.id)}
                                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 hover:scale-110 transition-all" 
                                title="Assegna a..."
                              >
                                <UserPlus size={18} />
                              </button>
                            )}

                            {/* Mark as Not Available - Only for NON-MUST documents */}
                            {doc.priority !== 'MUST' && (
                              <button
                                onClick={() => markDocumentAsNotAvailable(doc.id)}
                                className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:scale-110 transition-all"
                                title="Segna come Non Disponibile"
                              >
                                <Ban size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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