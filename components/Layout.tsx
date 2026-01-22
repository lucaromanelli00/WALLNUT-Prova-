import React from 'react';
import { useApp } from '../store';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Users,
  Briefcase,
  Layers,
  Database,
  Info,
  ChevronRight,
  Lock,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-white shadow-lg shadow-violet-500/10 text-violet-700' 
        : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
    }`}
  >
    <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white' : 'bg-transparent group-hover:bg-slate-100'}`}>
       <Icon size={18} />
    </div>
    <span className={`font-semibold text-sm tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
  </Link>
);

const BlockNavItem = ({ id, label, status, active, accessible }: { id: number, label: string, status: string, active: boolean, accessible: boolean }) => {
  const isLocked = status === 'LOCKED';
  const isCompleted = status === 'COMPLETED';
  
  if (!accessible) {
    return (
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl opacity-40 cursor-not-allowed select-none">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border border-slate-200 bg-slate-50 text-slate-400">
            {id}
          </div>
          <span className="text-sm font-medium truncate max-w-[140px] text-slate-400">{label}</span>
        </div>
        <Lock size={14} className="text-slate-300" />
      </div>
    );
  }

  return (
    <Link 
      to={isLocked ? '#' : `/blocks/${id}`} 
      className={`relative overflow-hidden group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
        active ? 'bg-white shadow-lg shadow-violet-500/10' : 'hover:bg-white/50'
      } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center space-x-3 z-10">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          isCompleted ? 'bg-emerald-100 text-emerald-600' : 
          active ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md' :
          'bg-white border border-slate-200 text-slate-500 group-hover:border-violet-200'
        }`}>
          {isCompleted ? <CheckCircle size={14} /> : id}
        </div>
        <span className={`text-sm font-medium truncate max-w-[140px] transition-colors ${active ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{label}</span>
      </div>
      {isLocked && <Lock size={14} className="text-slate-300" />}
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-l-2xl"></div>}
    </Link>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, blocks, logout, resetApp } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isBlockActive = (id: number) => location.pathname === `/blocks/${id}`;

  const isOwner = user?.role === 'OWNER';

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* FLOATING SIDEBAR (Desktop) */}
      <aside className={`fixed inset-y-4 left-4 z-50 w-72 glass-panel rounded-[2rem] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
        
        {/* Header */}
        <div className="h-24 flex items-center px-8 flex-shrink-0">
          <Logo showText size={32} theme="dark" />
          {/* Mobile Close Button */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar">
          {/* Main Navigation */}
          <div className="space-y-1">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={isActive('/')} />
            <SidebarItem to="/documents" icon={FileText} label="Documenti" active={isActive('/documents')} />
            <SidebarItem to="/team" icon={Users} label="Team" active={isActive('/team')} />
            <SidebarItem to="/info" icon={Info} label="Info" active={isActive('/info')} />
          </div>

          {/* LDE Blocks Navigation */}
          <div>
            <div className="px-6 mb-3 flex items-center space-x-2">
              <Sparkles size={12} className="text-violet-500" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Percorso LDE</span>
            </div>
            <div className="space-y-1">
              <BlockNavItem 
                id={1} label="Profilo & Struttura" status={blocks[1].status} active={isBlockActive(1)} 
                accessible={isOwner || (user?.assignedBlocks?.includes(1) ?? false)}
              />
              <BlockNavItem 
                id={2} label="Dimensioni & Identità" status={blocks[2].status} active={isBlockActive(2)} 
                accessible={isOwner || (user?.assignedBlocks?.includes(2) ?? false)}
              />
              <BlockNavItem 
                id={3} label="Ambiente Esterno" status={blocks[3].status} active={isBlockActive(3)} 
                accessible={isOwner || (user?.assignedBlocks?.includes(3) ?? false)}
              />
              <BlockNavItem 
                id={4} label="Tecnologia" status={blocks[4].status} active={isBlockActive(4)} 
                accessible={isOwner || (user?.assignedBlocks?.includes(4) ?? false)}
              />
              <BlockNavItem 
                id={5} label="Execution & Processi" status={blocks[5].status} active={isBlockActive(5)} 
                accessible={isOwner || (user?.assignedBlocks?.includes(5) ?? false)}
              />
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 mx-4 mb-4 mt-2 bg-white/50 rounded-2xl border border-white/40 flex-shrink-0 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 border border-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
               {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="font-bold text-violet-600">{user?.name.charAt(0)}</span>}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[11px] font-medium text-slate-500 truncate uppercase tracking-wide">{user?.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={resetApp}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 py-2 border border-slate-200/60 rounded-xl hover:bg-white transition-colors"
            >
              RESET
            </button>
            <button 
              onClick={logout}
              className="flex items-center justify-center space-x-1 text-[10px] font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 py-2 border border-rose-100 rounded-xl transition-colors"
            >
              <span>ESCI</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT CENTER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative md:pl-80">
        {/* Mobile Header */}
        <header className="md:hidden h-20 flex items-center justify-between px-6 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <Logo showText size={24} />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 bg-white rounded-full shadow-sm">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-24 md:pt-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};