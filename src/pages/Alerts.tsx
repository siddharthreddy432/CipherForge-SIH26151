import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, CheckCircle, Clock } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    setLoading(true);
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      });
  };

  const updateAlertStatus = (id: string, status: string) => {
    fetch(`/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    .then(() => fetchAlerts());
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
            INTELLIGENCE<br /><span className="text-brand-muted">ALERTS</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Newly detected intelligence signals and correlations.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <p className="text-5xl font-heading text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]">{unreadCount}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">UNREVIEWED EVENTS</p>
        </div>
      </div>

      {loading ? (
        <div className="text-[10px] text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] uppercase tracking-widest animate-pulse">LOADING ALERTS...</div>
      ) : (
        <div className="space-y-4">
          {alerts.length === 0 && (
             <div className="p-12 text-center border border-brand-border text-brand-muted text-[11px] uppercase tracking-widest font-mono">
               No active alerts
             </div>
          )}
          {alerts.map((alert, idx) => (
             <div 
               key={alert.id} 
               className={`p-6 border transition-all duration-300 ease-smooth animate-fade-up stagger-${Math.min(idx + 1, 6)} ${!alert.read ? 'border-brand-accent/50 bg-brand-accent/5' : 'border-brand-border bg-[#0A0C0E]/80 backdrop-blur-md'}`}
             >
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                 <div className="space-y-4">
                   <div className="flex items-center gap-4">
                     <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 ${!alert.read ? 'bg-brand-accent text-brand-bg' : 'bg-brand-border text-brand-muted'}`}>
                       {!alert.read ? 'NEW' : 'REVIEWED'}
                     </span>
                     <span className={`text-[9px] uppercase tracking-widest font-bold ${alert.severity === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>
                       {alert.severity} SEVERITY
                     </span>
                     <span className="text-[9px] uppercase tracking-widest text-brand-muted flex items-center gap-1 font-mono">
                       <Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleString()}
                     </span>
                   </div>
                   <p className="text-xl font-heading font-semibold text-brand-text break-all">{alert.message}</p>
                   {alert.evidence_id && (
                     <p className="text-[10px] uppercase tracking-widest text-brand-muted font-mono flex items-center gap-2 mt-2">
                       EVIDENCE: {alert.evidence_id}
                       <button onClick={() => navigate('/evidence')} className="text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] hover:text-brand-text transition-colors">VIEW →</button>
                     </p>
                   )}
                 </div>
                 <div className="flex items-center gap-4 shrink-0 mt-4 lg:mt-0">
                   {!alert.read ? (
                     <button 
                       onClick={() => updateAlertStatus(alert.id, 'REVIEWED')}
                       className="px-4 py-3.5 border border-brand-accent text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] hover:bg-brand-accent hover:text-brand-bg transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center gap-2 btn-motion"
                     >
                       <CheckCircle className="w-3 h-3" /> MARK REVIEWED
                     </button>
                   ) : (
                     <button 
                       onClick={() => updateAlertStatus(alert.id, 'NEW')}
                       className="px-4 py-3.5 border border-brand-border text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-widest font-semibold"
                     >
                       MARK NEW
                     </button>
                   )}
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
