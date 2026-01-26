import React, { useState } from 'react';
import { useApp } from '../store';
import { DepartmentConfig, TeamMember } from '../types';
import { Users, Layers, Shield, UserPlus, X, Trash2, Mail, Briefcase } from 'lucide-react';

export const Team = () => {
  const { organization, user, activeCompanyId, addTeamMember } = useApp();
  const [selectedDept, setSelectedDept] = useState<DepartmentConfig | null>(null);
  
  // For Invite Form
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  const allDepartments = organization?.departments || [];
  // Filter departments for the current active company context
  const companyDepartments = allDepartments.filter(d => d.companyId === activeCompanyId);

  // If user is delegate, find their department
  const delegateDept = user?.role === 'DELEGATE' 
    ? allDepartments.find(d => d.id === user.departmentId) 
    : null;

  // Handler for adding member
  const handleInvite = (deptId: string) => {
    if (newMember.firstName && newMember.email) {
      const member: TeamMember = {
        id: Date.now().toString(),
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        email: newMember.email,
        role: newMember.role,
        avatar: `https://ui-avatars.com/api/?name=${newMember.firstName}+${newMember.lastName}&background=random`
      };
      addTeamMember(deptId, member);
      setNewMember({ firstName: '', lastName: '', email: '', role: '' });
    }
  };

  // Render Modal for Owner
  const renderDeptModal = () => {
    if (!selectedDept) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/50 animate-in zoom-in-95">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{selectedDept.name}</h3>
              <p className="text-sm text-slate-500">Gestione membri e accessi</p>
            </div>
            <button onClick={() => setSelectedDept(null)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {/* Delegate Section */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Responsabile (Delegato)</h4>
              {selectedDept.owner?.firstName ? (
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedDept.owner.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{selectedDept.owner.firstName} {selectedDept.owner.lastName}</p>
                    <p className="text-sm text-slate-500">{selectedDept.owner.email} • {selectedDept.owner.role}</p>
                  </div>
                  <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Lead</span>
                </div>
              ) : (
                <p className="text-sm text-amber-600 italic">Nessun delegato assegnato.</p>
              )}
            </div>

            {/* Team Members List */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Membri del Team ({selectedDept.members?.length || 0})</h4>
              <div className="space-y-3">
                {selectedDept.members && selectedDept.members.length > 0 ? (
                  selectedDept.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img src={member.avatar} alt={member.firstName} className="w-10 h-10 rounded-full bg-slate-200" />
                        <div>
                          <p className="font-bold text-sm text-slate-800">{member.firstName} {member.lastName}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{member.role}</span>
                        <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    Nessun membro aggiunto al team.
                  </p>
                )}
              </div>
            </div>

            {/* Add Member Form */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                <UserPlus size={16} />
                Invita nuovo membro
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" placeholder="Nome" 
                  className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  value={newMember.firstName} onChange={e => setNewMember({...newMember, firstName: e.target.value})}
                />
                <input 
                  type="text" placeholder="Cognome" 
                  className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  value={newMember.lastName} onChange={e => setNewMember({...newMember, lastName: e.target.value})}
                />
                <input 
                  type="email" placeholder="Email aziendale" 
                  className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})}
                />
                <input 
                  type="text" placeholder="Ruolo (es. Specialist)" 
                  className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}
                />
              </div>
              <button 
                onClick={() => handleInvite(selectedDept.id)}
                disabled={!newMember.firstName || !newMember.email}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Invia Invito
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="pb-20 relative animate-in fade-in duration-500">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Team & Organizzazione</h1>
        <p className="text-slate-500 font-medium">Gestisci la struttura e invita i collaboratori.</p>
      </div>

      {/* User Info Card (Visible to everyone) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
          {user?.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-full tracking-wide border border-slate-200">
              {user?.role}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail size={14} /> {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* OWNER VIEW */}
      {user?.role === 'OWNER' && (
        <>
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Layers size={20} className="text-violet-500" />
            Aree Funzionali
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyDepartments.map(dept => (
              <div key={dept.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <div className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">
                    {dept.members?.length || 0} Membri
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-slate-900 mb-1">{dept.name}</h4>
                <p className="text-sm text-slate-500 mb-6 truncate">
                  Responsabile: {dept.owner?.firstName ? `${dept.owner.firstName} ${dept.owner.lastName}` : 'N/A'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2 overflow-hidden">
                    {dept.members && dept.members.slice(0, 3).map((m, i) => (
                      <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200" src={m.avatar} alt={m.firstName} />
                    ))}
                    {(dept.members?.length || 0) > 3 && (
                      <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 ring-2 ring-white">
                        +{dept.members!.length - 3}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedDept(dept)}
                    className="text-sm font-bold text-violet-600 hover:text-violet-800 hover:bg-violet-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    Gestisci Team
                  </button>
                </div>
              </div>
            ))}
          </div>
          {renderDeptModal()}
        </>
      )}

      {/* DELEGATE VIEW */}
      {user?.role === 'DELEGATE' && delegateDept && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            <div className="p-8 bg-gradient-to-r from-violet-500 to-indigo-600 text-white">
              <h3 className="text-2xl font-bold mb-2">{delegateDept.name}</h3>
              <p className="opacity-90">Gestisci il tuo team operativo per questa area.</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Members List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Membri del Team</h4>
                  <div className="space-y-4">
                    {(delegateDept.members?.length || 0) > 0 ? (
                      delegateDept.members.map(member => (
                        <div key={member.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <img src={member.avatar} alt={member.firstName} className="w-12 h-12 rounded-full bg-slate-200" />
                          <div>
                            <p className="font-bold text-slate-800">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-slate-500">{member.role}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Ancora nessun membro nel team.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invite Form */}
                <div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                    <h4 className="text-lg font-bold text-slate-800 mb-6 relative z-10">Aggiungi Collaboratore</h4>
                    
                    <div className="space-y-4 relative z-10">
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" placeholder="Nome" 
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-all"
                          value={newMember.firstName} onChange={e => setNewMember({...newMember, firstName: e.target.value})}
                        />
                        <input 
                          type="text" placeholder="Cognome" 
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-all"
                          value={newMember.lastName} onChange={e => setNewMember({...newMember, lastName: e.target.value})}
                        />
                      </div>
                      <input 
                        type="email" placeholder="Email aziendale" 
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-all"
                        value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Ruolo" 
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-all"
                        value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}
                      />
                      
                      <button 
                        onClick={() => handleInvite(delegateDept.id)}
                        disabled={!newMember.firstName || !newMember.email}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                      >
                        <UserPlus size={18} />
                        <span>Invia Invito</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
