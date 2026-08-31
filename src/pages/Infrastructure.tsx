import React, { useEffect, useState } from 'react';
import { Server, Globe, Shield, Lock, AlertTriangle, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Infrastructure() {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/infrastructure')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
            INFRASTRUCTURE<br /><span className="text-brand-muted">INTELLIGENCE</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Correlate observable hidden-service indicators with infrastructure intelligence.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 shrink-0 pb-2">
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">HIDDEN SERVICES</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-text">{data.length}</p>
           </div>
           <div className="w-px h-12 bg-brand-border hidden md:block"></div>
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">IP INDICATORS</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-text">
                {data.reduce((acc, curr) => acc + curr.related.filter((r:any) => r.entity.type === 'IP').length, 0)}
              </p>
           </div>
           <div className="w-px h-12 bg-brand-border hidden md:block"></div>
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">CERTIFICATES</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-text">
                {data.reduce((acc, curr) => acc + curr.related.filter((r:any) => r.entity.type === 'CERTIFICATE').length, 0)}
              </p>
           </div>
        </div>
      </div>

      <div className="space-y-32">
        {data.length === 0 && (
          <div className="text-brand-muted tracking-widest text-xs uppercase text-center py-12">No infrastructure records found.</div>
        )}

        {data.map((item, idx) => {
          const { onion, related } = item;
          const actors = related.filter((r:any) => r.entity.type === 'ACTOR');
          const certificates = related.filter((r:any) => r.entity.type === 'CERTIFICATE');
          const domains = related.filter((r:any) => r.entity.type === 'DOMAIN');
          const ips = related.filter((r:any) => r.entity.type === 'IP');

          return (
            <div key={idx} className="border border-brand-border overflow-hidden">
              <div className="bg-brand-border/10 p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-start gap-6 border-b border-brand-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-brand-muted" />
                    <h2 className="text-2xl md:text-3xl font-heading text-brand-text tracking-tight">{onion.value}</h2>
                    <span className="px-2 py-1 border border-brand-border text-[9px] uppercase tracking-widest text-brand-muted bg-[#070809]/50">
                      HIDDEN SERVICE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">CATEGORY</p>
                        <p className="text-xs tracking-widest text-brand-text uppercase">{onion.category}</p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">FIRST SEEN</p>
                        <p className="text-xs font-mono tracking-widest text-brand-text uppercase">{new Date(onion.first_seen).toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">LAST SCANNED</p>
                        <p className="text-xs font-mono tracking-widest text-brand-text uppercase">{new Date(onion.last_scanned).toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">SOURCE</p>
                        <p className="text-xs tracking-widest text-brand-text uppercase">{onion.source}</p>
                     </div>
                  </div>
                </div>
                
                <div className="shrink-0 flex flex-col gap-3">
                  <button 
                    onClick={() => navigate(`/graph?seed=${onion.value}`)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-text text-brand-bg hover:bg-white text-[10px] uppercase tracking-widest font-semibold transition-colors"
                  >
                    <Network className="w-3.5 h-3.5" /> GRAPH ANALYSIS
                  </button>
                  <button 
                    onClick={() => navigate('/investigate', { state: { artifact: onion.value } })}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-brand-border hover:border-brand-muted text-brand-text text-[10px] uppercase tracking-widest transition-colors"
                  >
                    <Server className="w-3.5 h-3.5" /> INVESTIGATE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-brand-border">
                {/* Linked Actors */}
                <div className="p-6 md:p-8 space-y-6">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted flex items-center gap-2 border-b border-brand-border pb-4">
                    <Shield className="w-4 h-4" /> RELATED THREAT ACTORS
                  </h3>
                  <div className="space-y-4">
                    {actors.length === 0 && <p className="text-xs text-brand-muted font-mono">No actors linked.</p>}
                    {actors.map((a:any, i:number) => (
                      <div key={i} className="flex flex-col gap-1 border border-brand-border p-4 bg-[#0A0C0E]/80 backdrop-blur-md">
                        <span className="text-lg font-sans text-brand-text cursor-pointer hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" onClick={() => navigate('/actors')}>{a.entity.value}</span>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-[9px] uppercase tracking-widest text-brand-muted">{a.relationship.relationship_type.replace(/_/g, ' ')}</span>
                           <span className={`text-[9px] uppercase tracking-widest font-semibold ${a.relationship.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-muted'}`}>{a.relationship.confidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates */}
                <div className="p-6 md:p-8 space-y-6">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted flex items-center gap-2 border-b border-brand-border pb-4">
                    <Lock className="w-4 h-4" /> CERTIFICATE RELATIONSHIPS
                  </h3>
                  <div className="space-y-6">
                    {certificates.length === 0 && <p className="text-xs text-brand-muted font-mono">No certificate indicators.</p>}
                    {certificates.map((c:any, i:number) => (
                      <div key={i} className="space-y-4">
                        <div className="border border-brand-border p-4 bg-[#0A0C0E]/80 backdrop-blur-md">
                          <p className="text-xs text-brand-muted mb-2">Observed certificate metadata associated with:</p>
                          <span className="text-sm font-mono text-brand-text break-all">{c.entity.value}</span>
                          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-brand-border/50">
                            <div>
                               <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">CONFIDENCE</p>
                               <p className="text-[10px] tracking-widest text-brand-text uppercase">{c.relationship.confidence}</p>
                            </div>
                            <div>
                               <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">OBSERVED</p>
                               <p className="text-[10px] tracking-widest text-brand-text uppercase font-mono">{new Date(c.entity.first_seen).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#070809] border border-brand-border p-4">
                           <p className="text-[9px] uppercase tracking-widest font-semibold text-brand-text mb-2">WHY THIS MATTERS</p>
                           <p className="text-xs text-brand-muted leading-relaxed">
                             Shared TLS certificates between Tor hidden services and clearnet IPs can deanonymize hosting infrastructure.
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Infrastructure Links */}
                <div className="p-6 md:p-8 space-y-6">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted flex items-center gap-2 border-b border-brand-border pb-4">
                    <AlertTriangle className="w-4 h-4" /> CLEARNET INDICATORS
                  </h3>
                  <div className="space-y-4">
                    {domains.length === 0 && ips.length === 0 && <p className="text-xs text-brand-muted font-mono">No clearnet indicators.</p>}
                    
                    {domains.map((d:any, i:number) => (
                      <div key={'d'+i} className="border border-brand-border p-4 bg-[#0A0C0E]/80 backdrop-blur-md">
                        <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">DOMAIN RELATIONSHIP</p>
                        <span className="text-sm font-mono text-brand-text">{d.entity.value}</span>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-brand-border/50">
                           <span className="text-[9px] uppercase tracking-widest text-brand-muted">SRC: {d.entity.source}</span>
                           <span className="text-[9px] uppercase tracking-widest text-brand-text">{d.relationship.confidence}</span>
                        </div>
                      </div>
                    ))}
                    
                    {ips.map((ip:any, i:number) => (
                      <div key={'ip'+i} className="border border-brand-border p-4 bg-[#0A0C0E]/80 backdrop-blur-md">
                        <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">IP OBSERVATION</p>
                        <span className="text-sm font-mono text-brand-text">{ip.entity.value}</span>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-brand-border/50">
                           <span className="text-[9px] uppercase tracking-widest text-brand-muted">SRC: {ip.entity.source}</span>
                           <span className="text-[9px] uppercase tracking-widest text-brand-text">{ip.relationship.confidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
