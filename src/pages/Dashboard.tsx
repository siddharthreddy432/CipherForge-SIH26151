import React, { useEffect, useState } from 'react';
import { Network, Globe, Activity, Shield, Bitcoin, Fingerprint, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NumberCounter } from '../components/NumberCounter';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
      
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.slice(0, 4)));
  }, []);

  if (!stats) return <div className="p-8 text-[10px] text-brand-muted uppercase tracking-widest animate-pulse">Initializing Interface...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-24">
      <div className="space-y-6 max-w-4xl animate-fade-up stagger-1">
        <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
          THREAT ACTOR<br /><span className="text-brand-muted">INTELLIGENCE</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-muted font-sans font-light max-w-2xl leading-relaxed">
          Correlating infrastructure, identity, blockchain and behavioural signals to produce evidence-backed attribution leads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-up stagger-2">
         {/* 01 Infrastructure */}
         <div className="space-y-8 border-t border-brand-border pt-8 group cursor-pointer" onClick={() => navigate('/infrastructure')}>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-mono text-brand-muted group-hover:text-brand-text transition-colors">01</span>
               <Globe className="w-4 h-4 text-brand-muted group-hover:text-brand-text transition-colors" />
            </div>
            <div className="block space-y-2 group-hover:translate-x-2 transition-transform">
               <h2 className="text-xl font-heading font-semibold text-brand-text uppercase tracking-widest">INFRASTRUCTURE<br /><span className="text-brand-muted">INTELLIGENCE</span></h2>
            </div>
            <div className="space-y-4 pt-4 border-t border-brand-border/30">
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">HIDDEN SERVICES</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={stats.hidden_services} /></span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">CERTIFICATES</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={stats.certificates} /></span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">INDICATORS</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text">{stats.infrastructure}</span>
               </div>
            </div>
         </div>

         {/* 02 Threat Actor */}
         <div className="space-y-8 border-t border-brand-accent pt-8 group cursor-pointer" onClick={() => navigate('/actors')}>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-mono text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">02</span>
               <Shield className="w-4 h-4 text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" />
            </div>
            <div className="block space-y-2 group-hover:translate-x-2 transition-transform">
               <h2 className="text-xl font-heading font-semibold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] uppercase tracking-widest">ACTOR<br /><span className="text-brand-muted">CORRELATION</span></h2>
            </div>
            <div className="space-y-4 pt-4 border-t border-brand-accent/30">
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">ACTORS & ALIASES</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text">{stats.total_actors + stats.total_aliases}</span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">PGP KEYS</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text">{stats.pgp_keys}</span>
               </div>
               <div className="flex justify-between items-end hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" onClick={(e) => { e.stopPropagation(); navigate('/persona'); }}>
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2"><Fingerprint className="w-3 h-3"/> PERSONA LINKS</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={stats.persona_links} /></span>
               </div>
            </div>
         </div>

         {/* 03 Blockchain */}
         <div className="space-y-8 border-t border-brand-glow pt-8 group cursor-pointer" onClick={() => navigate('/blockchain')}>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-mono text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] transition-colors">03</span>
               <Bitcoin className="w-4 h-4 text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] transition-colors" />
            </div>
            <div className="block space-y-2 group-hover:translate-x-2 transition-transform">
               <h2 className="text-xl font-heading font-semibold text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] uppercase tracking-widest">BLOCKCHAIN<br /><span className="text-brand-muted">INTELLIGENCE</span></h2>
            </div>
            <div className="space-y-4 pt-4 border-t border-brand-glow/30">
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">WALLETS</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={stats.wallets} /></span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">TRANSACTIONS</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={stats.transactions} /></span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-brand-muted">RELATIONSHIPS</span>
                 <span className="text-2xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={stats.wallets + stats.transactions} /></span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 border-t border-brand-border pt-16 animate-fade-up stagger-3">
        
        {/* Active Investigation flow */}
        <div className="space-y-20">
           <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted flex items-center gap-3">
             <Activity className="w-4 h-4" /> ACTIVE INVESTIGATION
           </h3>
           <div className="border border-brand-border p-8 bg-[#0A0C0E]/80 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-4">
                 <p className="text-[10px] uppercase tracking-widest text-brand-muted w-24">SEED</p>
                 <p className="text-lg font-mono text-brand-text">demo.onion</p>
              </div>
              <div className="pl-28 flex flex-col gap-2">
                 <ArrowRight className="w-4 h-4 text-brand-muted rotate-90" />
                 <p className="text-lg font-mono text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]">ShadowByte</p>
                 <ArrowRight className="w-4 h-4 text-brand-muted rotate-90" />
                 <p className="text-lg font-mono text-brand-text">0x3A2...9F1</p>
                 <ArrowRight className="w-4 h-4 text-brand-muted rotate-90" />
                 <p className="text-lg font-mono text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]">Shadow_Byte</p>
              </div>
              <div className="pt-6 border-t border-brand-border/50">
                <button onClick={() => navigate('/investigate', { state: { artifact: 'demo.onion' } })} className="text-[10px] uppercase tracking-widest font-semibold text-brand-text hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">
                  RESUME INVESTIGATION →
                </button>
              </div>
           </div>
        </div>

        {/* Correlation Assessment */}
        <div className="space-y-20">
           <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted flex items-center gap-3">
             <Shield className="w-4 h-4" /> CORRELATION ASSESSMENT
           </h3>
           <div className="space-y-8">
              <div className="flex items-end justify-between border-b border-brand-border pb-6">
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-2">OVERALL CONFIDENCE</p>
                   <p className="text-5xl md:text-6xl font-sans font-semibold leading-none text-brand-text"><NumberCounter value={86} suffix="%" /></p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] uppercase tracking-widest text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] font-bold mb-2">HIGH PROBABILITY</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm border-b border-brand-border/30 pb-3">
                    <span className="text-brand-text font-sans">PGP Continuity</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]">HIGH</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-brand-border/30 pb-3">
                    <span className="text-brand-text font-sans">Infrastructure Relationship</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]">MEDIUM</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-brand-border/30 pb-3">
                    <span className="text-brand-text font-sans">Wallet Relationship</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]">HIGH</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-brand-border/30 pb-3">
                    <span className="text-brand-text font-sans">Persona Similarity</span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]">HIGH</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="border-t border-brand-border pt-16 animate-fade-up stagger-4">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted flex items-center gap-3">
            <Network className="w-4 h-4" /> RECENT INTELLIGENCE
          </h3>
          <button onClick={() => navigate('/alerts')} className="text-[10px] uppercase tracking-widest font-semibold text-brand-text hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">
            VIEW ALL →
          </button>
        </div>
        
        <div className="space-y-4">
          {alerts.length === 0 ? (
             <p className="text-xs text-brand-muted font-mono uppercase">No recent observations.</p>
          ) : (
            alerts.map((alert, idx) => (
              <div key={idx} className={`animate-fade-up stagger-${Math.min(idx + 1, 6)} flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#0A0C0E]/80 backdrop-blur-md border border-[#1A1C20] gap-6 group hover:border-brand-accent/50 transition-colors`}>
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                     <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 border ${alert.severity === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] border-brand-accent/30' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] border-brand-glow/30'}`}>
                       NEW OBSERVATION
                     </span>
                     <span className="text-[10px] font-mono text-brand-muted">{new Date(alert.timestamp).toLocaleDateString('en-GB')}</span>
                   </div>
                   <p className="text-lg font-sans tracking-wide text-brand-text group-hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">{alert.message}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0 mt-2 md:mt-0">
                   {alert.evidence_id && (
                     <button onClick={() => navigate('/evidence')} className="text-[9px] uppercase tracking-widest font-semibold text-brand-text hover:text-brand-muted transition-colors">VIEW EVIDENCE</button>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
