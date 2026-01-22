import React from 'react';
import { useApp } from '../store';
import { Users, Layers, Shield } from 'lucide-react';

export const Team = () => {
  const { organization, user } = useApp();
  const departments = organization?.departments || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Il Tuo Team</h1>
        <p className="text-slate-500 mt-1">Struttura organizzativa e responsabilità.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Owner Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <Shield className="mb-4 text-blue-400" size={32} />
            <h3 className="text-xl font-bold mb-1">Project Owner</h3>
            <div className="text-slate-300 text-sm mb-4">Responsabile Strategico</div>
            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                 {user?.role === 'OWNER' ? user.name.charAt(0) : 'O'}
              </div>
              <div>
                <div className="font-bold text-sm">{user?.role === 'OWNER' ? user.name : 'Nome Owner'}</div>
                <div className="text-xs text-slate-400">{user?.role === 'OWNER' ? user.email : 'email@owner.com'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Departments */}
        {departments.filter(d => d.enabled).map(dept => (
           <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <h3 className="font-bold text-slate-800">{dept.name}</h3>
              </div>
              
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Delegato (Responsabile)</p>
                {dept.owner?.firstName ? (
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                        {dept.owner.firstName.charAt(0)}
                     </div>
                     <div>
                       <div className="font-bold text-sm text-slate-800">{dept.owner.firstName} {dept.owner.lastName}</div>
                       <div className="text-xs text-slate-500">{dept.owner.email}</div>
                     </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-sm font-medium border border-amber-100 text-center">
                    In attesa di assegnazione
                  </div>
                )}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};
