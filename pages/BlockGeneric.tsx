import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { BLOCK_TITLES } from '../constants';
import { ChevronLeft, Save, CheckCircle, AlertTriangle, Lock } from 'lucide-react';

const QUESTIONS = {
  1: [
    "L'organigramma formale riflette il funzionamento reale dell'azienda?",
    "Chi sono le 3–5 figure chiave per il funzionamento dell'azienda oggi?",
    "Esistono ruoli informali che influenzano decisioni o processi chiave?",
    "Quali team o funzioni collaborano maggiormente nella pratica?",
    "Quali competenze interne considerate oggi distintive o strategiche?"
  ],
  2: [
    "Quali sono stati gli step principali nel percorso di crescita?",
    "Ci sono state partnership strategiche che hanno cambiato il corso aziendale?",
    "Come viene immaginata l'azienda tra 3–5 anni?",
    "Quali sono i principali ostacoli o rischi per questi piani?"
  ],
  3: [
    "Chi è considerato oggi come competitor diretto?",
    "In cosa vi differenziate realmente da loro?",
    "Come viene percepita l'azienda all'esterno? (reputazione)",
    "Ci sono normative che influenzano direttamente le vostre attività?"
  ],
  4: [
    "L'azienda utilizza un sistema gestionale / ERP centrale?",
    "Esistono software sviluppati internamente?",
    "Quali sono gli scenari di rischio digitale che vi preoccupano di più?",
    "Quanto tempo passa mediamente tra un'idea digitale e la sua implementazione?"
  ]
};

export const BlockGeneric = () => {
  const { id } = useParams<{ id: string }>();
  const blockId = parseInt(id || '1');
  const navigate = useNavigate();
  const { user, answers, saveAnswer, updateBlockProgress } = useApp();
  
  const [localAnswers, setLocalAnswers] = useState<{ [key: string]: string }>({});
  const questions = QUESTIONS[blockId as keyof typeof QUESTIONS] || [];

  useEffect(() => {
    // Load existing answers
    const currentBlockAnswers: { [key: string]: string } = {};
    questions.forEach((_, idx) => {
      const key = `b${blockId}_q${idx}`;
      if (answers[key]) currentBlockAnswers[key] = answers[key];
    });
    setLocalAnswers(currentBlockAnswers);
  }, [blockId, answers]);

  // Security Check: Is user allowed to view this block?
  // Owner is always allowed.
  if (user && user.role !== 'OWNER' && !user.assignedBlocks.includes(blockId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Accesso Negato</h2>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          Non hai i permessi necessari per accedere a questo blocco strategico. 
          Contatta il Project Owner se ritieni si tratti di un errore.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Torna alla Dashboard
        </button>
      </div>
    );
  }

  const handleSave = () => {
    Object.entries(localAnswers).forEach(([key, value]) => {
      saveAnswer(key, value);
    });
    
    // Calculate progress based on filled answers
    // Fix: Cast Object.values to string[] to ensure .length property exists on elements
    const filledCount = (Object.values(localAnswers) as string[]).filter(v => v.length > 5).length;
    const progress = Math.round((filledCount / questions.length) * 100);
    updateBlockProgress(blockId, progress);
    
    alert('Bozza salvata con successo');
  };

  const handleComplete = () => {
    handleSave();
    updateBlockProgress(blockId, 100, 'COMPLETED');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft size={20} />
          <span className="font-medium">Torna alla Dashboard</span>
        </button>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Blocco {blockId}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{BLOCK_TITLES[blockId as keyof typeof BLOCK_TITLES]}</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Compila le informazioni richieste per costruire la baseline dell'organizzazione.
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <label className="block text-base font-semibold text-slate-800 mb-3">{q}</label>
            <textarea
              className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-colors text-slate-700 placeholder-slate-400"
              placeholder="Inserisci la tua risposta qui..."
              value={localAnswers[`b${blockId}_q${idx}`] || ''}
              onChange={(e) => setLocalAnswers(prev => ({ ...prev, [`b${blockId}_q${idx}`]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {/* Action Bar (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-between items-center z-40">
        <div className="text-sm text-slate-500 font-medium px-4">
          Modifiche non salvate: <span className="text-slate-800">{Object.keys(localAnswers).length > 0 ? 'Presenti' : 'Nessuna'}</span>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            <Save size={18} />
            <span>Salva Bozza</span>
          </button>
          <button 
            onClick={handleComplete}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle size={18} />
            <span>Completa Blocco</span>
          </button>
        </div>
      </div>
    </div>
  );
};