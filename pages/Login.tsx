import React, { useState } from 'react';
import { useApp } from '../store';
import { Role } from '../types';
import { User, Shield, Briefcase, UserCircle, ArrowRight, Lock, Building2, Loader2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

const RoleCard = ({ role, title, desc, icon: Icon, onClick }: { role: Role, title: string, desc: string, icon: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-4 p-4 w-full bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 hover:border-violet-300 hover:bg-white hover:shadow-lg shadow-sm transition-all duration-300 text-left group"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-white flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
    </div>
    <div>
      <h3 className="font-bold text-slate-700 text-sm group-hover:text-slate-900">{title}</h3>
      <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
    </div>
  </button>
);

export const Login = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSSOLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsRedirecting(true);
    
    // Simulate Identity Provider Redirect
    setTimeout(() => {
      // For demo purposes, SSO logs you in as Owner
      login('OWNER');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/30 -z-20" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-200/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-200/40 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Main Glass Card */}
        <div className="glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          
          {/* Header */}
          <div className="px-10 pt-12 pb-8 text-center">
            <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-500">
              <Logo showText size={56} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Accesso Workspace</h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Inserisci la tua email aziendale per l'autenticazione SSO sicura.</p>
          </div>

          {/* SSO Form */}
          <div className="px-10 pb-12">
            {isRedirecting ? (
              <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Reindirizzamento...</h3>
                <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wide">Contatto Identity Provider</p>
              </div>
            ) : (
              <form onSubmit={handleSSOLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Aziendale</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-400" 
                      placeholder="nome@azienda.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!email}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-gradient-to-r hover:from-violet-600 hover:to-indigo-600 hover:shadow-xl hover:shadow-violet-500/20 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <Lock size={18} className="text-slate-400 group-hover:text-violet-200 transition-colors" />
                  <span>Accedi con SSO</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* SSO Provider Badges */}
                <div className="flex justify-center items-center gap-3 pt-2">
                  {['Microsoft', 'Google', 'Okta'].map(p => (
                    <div key={p} className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 bg-white/50 px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
                      <Globe size={10} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </form>
            )}
          </div>

          {/* Footer Link */}
          <div className="bg-slate-50/80 backdrop-blur-md px-10 py-5 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500">
              Non hai un account?{' '}
              <Link to="/register" className="text-violet-600 font-bold hover:underline decoration-2 underline-offset-2">
                Registra Azienda
              </Link>
            </p>
          </div>
        </div>

        {/* Developer / Demo Access Section */}
        <div className="mt-10 animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-center space-x-4 mb-6 opacity-60">
            <div className="h-px w-12 bg-slate-300"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Demo Mode</span>
            <div className="h-px w-12 bg-slate-300"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <RoleCard 
              role="OWNER" title="Owner" desc="CEO / Founder" icon={Shield}
              onClick={() => login('OWNER')}
            />
            <RoleCard 
              role="DELEGATE" title="Delegato" desc="Manager Area" icon={Briefcase}
              onClick={() => login('DELEGATE')}
            />
            <RoleCard 
              role="ADVISOR" title="Advisor" desc="Consulente" icon={UserCircle}
              onClick={() => login('ADVISOR')}
            />
            <RoleCard 
              role="EMPLOYEE" title="Dipendente" desc="Staff" icon={User}
              onClick={() => login('EMPLOYEE')}
            />
          </div>
        </div>

      </div>
    </div>
  );
};