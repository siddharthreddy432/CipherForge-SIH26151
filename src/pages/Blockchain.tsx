import React, { useEffect, useState } from 'react';
import { Bitcoin, Activity, Shield, Network, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Blockchain() {
  const [data, setData] = useState<{wallets: any[], transactions: any[]}>({ wallets: [], transactions: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/blockchain')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] uppercase leading-none">
            BLOCKCHAIN<br /><span className="text-brand-muted">INTELLIGENCE</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Trace wallet relationships and transaction signals within the broader threat-actor intelligence graph.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 shrink-0 pb-2">
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">TOTAL WALLETS</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]">{data.wallets.length}</p>
           </div>
           <div className="w-px h-12 bg-brand-border hidden md:block"></div>
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">TRANSACTIONS</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]">{data.transactions.length}</p>
           </div>
           <div className="w-px h-12 bg-brand-border hidden md:block"></div>
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">WALLET RELATIONSHIPS</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]">
                {data.wallets.reduce((acc, curr) => acc + curr.relatedActors.length, 0)}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Wallet Directory */}
        <div className="space-y-8">
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] flex items-center gap-2 border-b border-brand-glow/30 pb-4">
            <Bitcoin className="w-4 h-4" /> WALLET DIRECTORY
          </h2>
          <div className="space-y-4">
             {data.wallets.length === 0 && <p className="text-xs text-brand-muted font-mono">No wallet records found.</p>}
             {data.wallets.map((item, idx) => (
               <div key={idx} className="border border-brand-border p-6 bg-[#0A0C0E]/80 backdrop-blur-md space-y-4 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-brand-glow/50 group-hover:bg-brand-glow transition-colors"></div>
                 <div className="flex justify-between items-start gap-4">
                   <div className="space-y-2 overflow-hidden">
                     <p className="text-[9px] uppercase tracking-widest text-brand-muted">WALLET ADDRESS</p>
                     <p className="text-lg font-mono text-brand-text truncate" title={item.wallet.value}>{item.wallet.value}</p>
                   </div>
                   <button onClick={() => navigate(`/graph?seed=${item.wallet.value}`)} className="shrink-0 p-2 border border-brand-border hover:bg-brand-border/20 text-brand-muted hover:text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] transition-colors" title="View on Graph">
                     <Network className="w-4 h-4" />
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border/50">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">RELATED ACTOR</p>
                      {item.relatedActors.length > 0 ? (
                        <p className="text-xs tracking-widest text-brand-text uppercase cursor-pointer hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" onClick={() => navigate('/actors')}>{item.relatedActors[0].value}</p>
                      ) : (
                        <p className="text-xs tracking-widest text-brand-muted uppercase">NONE</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">CONFIDENCE</p>
                      <p className={`text-xs tracking-widest uppercase font-semibold ${item.wallet.confidence === 'HIGH' ? 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]' : 'text-brand-muted'}`}>{item.wallet.confidence}</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">FIRST SEEN: <span className="text-brand-text font-mono">{new Date(item.wallet.first_seen).toLocaleDateString()}</span></p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">SRC: {item.wallet.source}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Transaction View */}
        <div className="space-y-8">
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] flex items-center gap-2 border-b border-brand-glow/30 pb-4">
            <Activity className="w-4 h-4" /> TRANSACTION SIGNALS
          </h2>
          <div className="space-y-4">
             {data.transactions.length === 0 && <p className="text-xs text-brand-muted font-mono">No transaction signals found.</p>}
             {data.transactions.map((item, idx) => (
               <div key={idx} className="border border-brand-border p-6 bg-[#0A0C0E]/80 backdrop-blur-md space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-1 h-full bg-brand-glow/50 group-hover:bg-brand-glow transition-colors"></div>
                 
                 <div className="flex justify-between items-center">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">TX: <span className="font-mono text-brand-text truncate block max-w-[200px]" title={item.transaction.value}>{item.transaction.value}</span></p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted font-mono">{new Date(item.transaction.first_seen).toLocaleDateString()}</p>
                 </div>

                 <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex-1 min-w-0">
                       <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1 text-center">FROM WALLET</p>
                       <div className="border border-brand-border p-2 bg-[#070809] text-center truncate">
                          <span className="text-[10px] font-mono text-brand-text" title={item.from?.value}>{item.from?.value || 'UNKNOWN'}</span>
                       </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center justify-center pt-4">
                       <ArrowRight className="w-4 h-4 text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1 text-center">TO WALLET</p>
                       <div className="border border-brand-border p-2 bg-[#070809] text-center truncate">
                          <span className="text-[10px] font-mono text-brand-text" title={item.to?.value}>{item.to?.value || 'UNKNOWN'}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-between items-center pt-2 border-t border-brand-border/50">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">SRC: {item.source}</p>
                    <p className={`text-[9px] uppercase tracking-widest font-semibold ${item.confidence === 'HIGH' ? 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]' : 'text-brand-muted'}`}>CONF: {item.confidence}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
