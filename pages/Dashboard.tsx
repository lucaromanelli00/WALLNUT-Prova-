import React from 'react';
import { useApp } from '../store';
import { Link } from 'react-router-dom';
import { DOCUMENTS_DB } from '../constants';
import { DocumentState, BlockStatus } from '../types';
import { 
  CheckCircle, 
  ArrowRight, 
  AlertCircle,
  FileText,
  Users,
  PieChart,
  BarChart3,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export const Dashboard = () => {
  const { user, company, blocks, documents } = useApp();

  // Calculate stats
  const totalDocs = DOCUMENTS_DB.length;
  // Fix: Cast Object.values to DocumentState[] to avoid 'unknown' type error
  const uploadedDocs = (Object.values(documents) as DocumentState[]).filter(d => d.status === 'UPLOADED').length;
  const missingDocs = totalDocs - uploadedDocs;
  const progress = Math.round((uploadedDocs / totalDocs) * 100);

  // Calculate total block progress
  // Fix: Cast Object.values to BlockStatus[] to avoid 'unknown' type error
  const totalBlockProgress = (Object.values(blocks) as BlockStatus[]).reduce((acc, curr) => acc + curr.progress, 0) / 5;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Premium Hero Section */}
      <div className="relative rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl group transition-all duration-500 hover:shadow-violet-500/20">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600"></div>
        
        {/* Animated Noise/Grain */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-900 opacity-40 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-8 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-400"></span>
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-white">Digital Twin Active</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight leading-tight drop-shadow-sm">
            Bentornato, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-violet-100">{user?.name}</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            {user?.role === 'OWNER' 
              ? 'Il tuo Digital Twin sta elaborando i dati. Completa i moduli LDE per sbloccare le previsioni strategiche AI.' 
              : 'Collabora alla costruzione del modello. I tuoi input sono fondamentali.'}
          </p>

          <div className="mt-10 flex space-x-4">
             <Link to="/assessment" className="bg-white text-violet-700 px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-black/10 hover:scale-105 transition-transform flex items-center space-x-2">
               <Zap size={20} className="fill-current" />
               <span>Analisi Rapida</span>
             </Link>
             <button className="bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition-colors backdrop-blur-md flex items-center space-x-2">
               <Target size={20} />
               <span>Vedi Obiettivi</span>
             </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Documenti */}
        <div className="glass-card rounded-[2rem] p-8 hover:-translate-y-1 transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{progress}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Documenti</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{uploadedDocs} <span className="text-xl text-slate-400">/ {totalDocs}</span></h3>
          </div>
          <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Card 2: Strategia */}
        <div className="glass-card rounded-[2rem] p-8 hover:-translate-y-1 transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
            <Sparkles size={16} className="text-violet-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Analisi LDE</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{Math.round(totalBlockProgress)}%</h3>
          </div>
          <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${totalBlockProgress}%` }}></div>
          </div>
        </div>

        {/* Card 3: Missing */}
        <div className="glass-card rounded-[2rem] p-8 hover:-translate-y-1 transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <AlertCircle size={28} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">In Sospeso</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{missingDocs}</h3>
          </div>
          <p className="mt-4 text-xs font-bold text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded-lg">Richiede Azione</p>
        </div>

        {/* Card 4: Team */}
        <div className="glass-card rounded-[2rem] p-8 hover:-translate-y-1 transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-500/20 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Aree Attive</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{user?.assignedBlocks.length || 0}</h3>
          </div>
          <div className="flex -space-x-2 mt-5">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-100"></div>
             ))}
             <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+2</div>
          </div>
        </div>
      </div>

      {/* Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Actions List (Left) */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-2xl font-bold text-slate-900 flex items-center px-2">
             <Clock className="mr-3 text-slate-400" size={24}/> 
             Attività in Evidenza
           </h3>
           
           <div className="space-y-4">
             {/* NEW ASSESSMENT CARD */}
             <div className="glass-panel p-6 rounded-3xl hover:bg-white transition-colors group cursor-pointer flex items-center justify-between border-l-8 border-l-emerald-500 bg-gradient-to-r from-emerald-50/50 to-white">
               <div className="flex items-center space-x-6">
                 <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                   <BarChart3 size={24} />
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Nuovi Insight Disponibili</h4>
                   <p className="text-slate-500 text-sm mt-1">L'IA ha elaborato 6 nuove analisi strategiche per la tua azienda.</p>
                 </div>
               </div>
               <Link to="/assessment" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center space-x-2">
                 <span>Vedi Report</span>
                 <ArrowRight size={16} />
               </Link>
             </div>

             {blocks[1].progress < 100 && (
               <div className="glass-panel p-6 rounded-3xl hover:bg-white transition-colors group cursor-pointer flex items-center justify-between border-l-8 border-l-violet-500">
                 <div className="flex items-center space-x-6">
                   <div className="h-12 w-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold">1</div>
                   <div>
                     <h4 className="text-lg font-bold text-slate-800 group-hover:text-violet-700 transition-colors">Completa Profilo & Struttura</h4>
                     <p className="text-slate-500 text-sm mt-1">Fondamentale per calibrare il modello.</p>
                   </div>
                 </div>
                 <Link to="/blocks/1" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                   <ArrowRight size={20} />
                 </Link>
               </div>
             )}
             
             {missingDocs > 0 && (
                <div className="glass-panel p-6 rounded-3xl hover:bg-white transition-colors group cursor-pointer flex items-center justify-between border-l-8 border-l-amber-400">
                  <div className="flex items-center space-x-6">
                    <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">!</div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Carica Documenti ({missingDocs})</h4>
                      <p className="text-slate-500 text-sm mt-1">Necessari per l'analisi documentale.</p>
                    </div>
                  </div>
                  <Link to="/documents" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </Link>
                </div>
             )}
           </div>
        </div>

        {/* Company Card (Right) */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 px-2">Organizzazione</h3>
          <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden text-center">
             {/* Decorative blob */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full blur-3xl opacity-60"></div>

             <div className="relative z-10 flex flex-col items-center">
               {company?.logo ? (
                 <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                   <img src={company.logo} alt="Company Logo" className="w-full h-full object-contain" />
                 </div>
               ) : (
                 <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-bold text-violet-700 mb-6 transform rotate-3">
                   {company?.name.charAt(0) || 'W'}
                 </div>
               )}
               
               <h4 className="font-extrabold text-2xl text-slate-900">{company?.name || 'Nome Azienda'}</h4>
               <p className="text-slate-500 font-medium mb-6">{company?.vat || 'P.IVA non presente'}</p>
               
               <div className="w-full space-y-3">
                 <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-white/50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Settore</span>
                    <span className="font-semibold text-slate-800">{company?.sector || '-'}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-white/50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Dipendenti</span>
                    <span className="font-semibold text-slate-800">{company?.employees || '-'}</span>
                 </div>
               </div>

               <div className="mt-8 px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 rounded-full text-xs font-extrabold uppercase tracking-widest">
                 Enterprise Plan
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};