
import React, { useState } from 'react';
import { useApp } from '../store';
import { Sparkles, Copy, Check, X, ArrowRight } from 'lucide-react';

interface GroupInheritanceBarProps {
  blockId: number;
}

export const GroupInheritanceBar: React.FC<GroupInheritanceBarProps> = ({ blockId }) => {
  const { organization, activeCompanyId, copyBlockData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState('');

  // Only show if it's a group
  if (organization?.type !== 'GROUP') return null;

  const currentCompany = organization.companies.find(c => c.id === activeCompanyId);
  const otherCompanies = organization.companies.filter(c => c.id !== activeCompanyId);

  const handleCopy = () => {
    if (selectedSourceId) {
      if (confirm(`Sei sicuro di voler sovrascrivere i dati attuali con quelli di ${organization.companies.find(c => c.id === selectedSourceId)?.name}?`)) {
        copyBlockData(blockId, selectedSourceId);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl hover:shadow-md hover:border-violet-200 transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-violet-600 shadow-sm">
              <Sparkles size={20} className="fill-violet-100" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-violet-900">Suggerimento Smart</p>
              <p className="text-xs text-violet-600">I dati di questa sezione sono uguali a quelli di un'altra azienda del gruppo?</p>
            </div>
          </div>
          <div className="bg-white text-violet-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-2 group-hover:bg-violet-600 group-hover:text-white transition-colors">
            <Copy size={14} />
            <span>Copia Dati</span>
          </div>
        </button>
      ) : (
        <div className="bg-white p-6 rounded-2xl border-2 border-violet-100 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-violet-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Copy size={18} className="text-violet-500" />
                Importa Dati Esistenti
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 max-w-lg">
              Seleziona l'azienda da cui vuoi ereditare le risposte per questo blocco. 
              Questa azione sovrascriverà i dati attuali di <strong>{currentCompany?.name}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm font-medium"
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
              >
                <option value="">Seleziona azienda sorgente...</option>
                {otherCompanies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isMain ? '(Capogruppo)' : ''}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={handleCopy}
                disabled={!selectedSourceId}
                className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
              >
                <span>Importa Dati</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
