import React, { useState } from 'react';
import { useApp } from '../store';
import { Check, ChevronRight, Building, User, Users } from 'lucide-react';

const steps = [
  { id: 1, title: 'Referente', icon: User },
  { id: 2, title: 'Azienda', icon: Building },
  { id: 3, title: 'Team', icon: Users },
];

export const Onboarding = () => {
  const { updateCompany, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    referentName: '',
    companyName: '',
    vat: '',
    sector: '',
    employees: ''
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateCompany({
        name: formData.companyName,
        vat: formData.vat,
        sector: formData.sector,
        employees: formData.employees
      });
      completeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-50 p-8 border-b border-slate-100">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-0"></div>
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isCompleted = s.id < step;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg scale-110' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold text-slate-800">Chi guida il progetto?</h2>
              <p className="text-slate-600">Identifica il Project Sponsor che avrà la visibilità completa.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Mario Rossi"
                    value={formData.referentName}
                    onChange={e => setFormData({...formData, referentName: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold text-slate-800">Dati Aziendali</h2>
              <p className="text-slate-600">Definiamo il perimetro dell'analisi.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ragione Sociale</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Acme S.r.l."
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="IT00000000000"
                    value={formData.vat}
                    onChange={e => setFormData({...formData, vat: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold text-slate-800">Contesto</h2>
              <p className="text-slate-600">Qualche informazione per calibrare gli agenti AI.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Settore</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value})}
                  >
                    <option value="">Seleziona...</option>
                    <option value="Manufacturing">Manifattura</option>
                    <option value="Services">Servizi</option>
                    <option value="IT">Technology</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Numero Dipendenti</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                    value={formData.employees}
                    onChange={e => setFormData({...formData, employees: e.target.value})}
                  >
                    <option value="">Seleziona...</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-end">
            <button 
              onClick={handleNext}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
            >
              <span>{step === 3 ? 'Completa Setup' : 'Continua'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
