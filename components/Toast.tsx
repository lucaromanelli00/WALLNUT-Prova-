import React from 'react';
import { useApp } from '../store';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className={`pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-10 fade-in duration-300 ${
            notif.type === 'success' ? 'bg-white border-green-100 text-slate-800' :
            notif.type === 'error' ? 'bg-white border-red-100 text-slate-800' :
            'bg-slate-800 border-slate-700 text-white'
          }`}
        >
          <div className={`flex-shrink-0 ${
             notif.type === 'success' ? 'text-green-500' :
             notif.type === 'error' ? 'text-red-500' :
             'text-blue-400'
          }`}>
            {notif.type === 'success' && <CheckCircle size={20} />}
            {notif.type === 'error' && <XCircle size={20} />}
            {notif.type === 'info' && <Info size={20} />}
          </div>
          <p className="text-sm font-medium">{notif.message}</p>
          <button 
            onClick={() => removeNotification(notif.id)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={14} className="opacity-50" />
          </button>
        </div>
      ))}
    </div>
  );
};