import React from 'react';

export const Info = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Informazioni Piattaforma</h1>
        <p className="text-slate-500 mt-1">Dettagli su Wallnut e metodologia LDE.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Versione</h2>
          <p className="text-slate-600">Wallnut v1.0.2 (Beta)</p>
        </div>
        
        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Supporto</h2>
          <p className="text-slate-600 mb-4">Per assistenza tecnica o metodologica, contatta il tuo Advisor di riferimento o scrivi a:</p>
          <a href="mailto:support@wallnut.ai" className="text-blue-600 font-bold hover:underline">support@wallnut.ai</a>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Sicurezza Dati</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            I tuoi dati sono crittografati e archiviati in server sicuri conformi al GDPR. 
            L'accesso ai documenti sensibili è limitato esclusivamente agli utenti autorizzati della tua organizzazione.
          </p>
        </div>
      </div>
    </div>
  );
};
