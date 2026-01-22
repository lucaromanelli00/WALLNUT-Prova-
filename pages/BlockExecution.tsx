import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hammer, Construction } from 'lucide-react';

export const BlockExecution = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-12 shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-slate-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-400">
            <Construction size={40} />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">In Sviluppo</h1>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Il modulo <strong>Execution & Processi</strong> sarà disponibile nel prossimo aggiornamento della piattaforma.
          </p>

          <div className="flex flex-col space-y-3 w-full">
            <button 
              onClick={() => navigate('/')} 
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <ChevronLeft size={18} />
              <span>Torna alla Dashboard</span>
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm font-medium">WALLNUT v1.0.2 (Beta)</p>
    </div>
  );
};
