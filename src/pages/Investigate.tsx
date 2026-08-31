import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { Network, Search, Globe, Shield, Bitcoin, Fingerprint, Download, ArrowDown, Database, CheckCircle2 } from 'lucide-react';

export default function Investigate() {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const initialArtifact = location.state?.artifact || '';

  
  const [artifact, setArtifact] = useState(initialArtifact);
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const STAGES = [
    { id: 'artifact', label: 'ARTIFACT INPUT' },
    { id: 'discovery', label: 'ENTITY DISCOVERY' },
    { id: 'infrastructure', label: 'INFRASTRUCTURE' },
    { id: 'actor', label: 'ACTOR CORRELATION' },
    { id: 'blockchain', label: 'BLOCKCHAIN' },
    { id: 'persona', label: 'PERSONA' },
    { id: 'evidence', label: 'EVIDENCE' },
    { id: 'confidence', label: 'CONFIDENCE' }
  ];

  useEffect(() => {
    if (initialArtifact && !result && !loading) {
      handleInvestigate(new Event('submit') as any);
    }
  }, [initialArtifact]);

  const handleInvestigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artifact) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    setPipelineStep(0);
    
    // Simulate pipeline visually
    for (let i = 0; i < STAGES.length; i++) {
       await new Promise(r => setTimeout(r, 200));
       setPipelineStep(i);
    }
    
    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifact })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPipelineStep(-1);
    }
  };

  const handleExport = (format: string) => {
    window.open(`/api/export/${format}?seed=${encodeURIComponent(artifact)}`, '_blank');
  };

  const PipelineProgress = () => {
    if (pipelineStep === -1 && !loading) return null;
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-border p-6 bg-[#0A0C0E]/80 backdrop-blur-md">
        {STAGES.map((stage, idx) => (
           <React.Fragment key={stage.id}>
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${idx <= pipelineStep ? 'bg-brand-accent' : 'bg-brand-border'}`}></div>
                <span className={`text-[9px] uppercase tracking-widest font-semibold ${idx <= pipelineStep ? 'text-brand-text' : 'text-brand-muted'}`}>
                  {stage.label}
                </span>
             </div>
             {idx < STAGES.length - 1 && (
               <div className="hidden md:block h-px flex-1 bg-brand-border"></div>
             )}
           </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      
      {/* Header */}
      <div className="space-y-6 max-w-4xl border-b border-brand-border pb-12">
        <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
          DIGITAL<br /><span className="text-brand-muted">INVESTIGATION</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-muted font-sans font-light max-w-2xl leading-relaxed">
          Input an observable artifact to trace its infrastructure, identity, and blockchain relationships.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleInvestigate} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 border border-brand-border bg-[#070809] flex items-center px-6 focus-within:border-brand-accent transition-colors">
           <Search className="w-5 h-5 text-brand-muted mr-4" />
           <input 
             type="text" 
             value={artifact}
             onChange={e => setArtifact(e.target.value)}
             placeholder="ENTER .ONION, DOMAIN, IP, WALLET, PGP FINGERPRINT, HANDLE..."
             className="w-full bg-transparent border-none py-6 text-sm uppercase tracking-widest text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-0"
             disabled={loading}
           />
        </div>
        <button 
          type="submit" 
          disabled={loading || !artifact}
          className="px-12 py-6 bg-brand-text text-brand-bg hover:bg-white text-[11px] uppercase tracking-[0.2em] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-3 shrink-0"
        >
          {loading ? 'PROCESSING...' : 'INVESTIGATE'}
        </button>
      </form>

      {error && (
        <div className="p-6 border border-brand-accent/50 bg-brand-accent/5 flex items-start gap-4 btn-motion">
          <Shield className="w-5 h-5 text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] font-bold mb-1">INVESTIGATION FAILED</p>
            <p className="text-sm font-sans text-brand-text">{error}</p>
          </div>
        </div>
      )}

      {loading && <PipelineProgress />}

      {result && !loading && (
        <div className="space-y-32 animate-in fade-in duration-700 pt-8 border-t border-brand-border">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">PRIMARY ARTIFACT</p>
              <h2 className="text-4xl font-heading text-brand-text break-all">{artifact}</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate(`/graph?seed=${artifact}`)} className="flex items-center gap-2 px-4 py-3.5 border border-brand-border hover:border-brand-accent hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors text-[9px] uppercase tracking-widest font-semibold text-brand-muted">
                <Network className="w-3.5 h-3.5" /> VIEW GRAPH
              </button>
              <button onClick={() => handleExport('report')} className="flex items-center gap-2 px-4 py-3.5 bg-brand-text text-brand-bg hover:bg-white transition-colors text-[9px] uppercase tracking-widest font-semibold">
                <Download className="w-3.5 h-3.5" /> GENERATE REPORT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Flow */}
            {result.entities.length > 0 && (
            <div className="lg:col-span-4 space-y-24">
              <div className="border border-brand-border p-6 bg-[#0A0C0E]/80 backdrop-blur-md space-y-8">
                 <div>
                   <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-3 mb-4">
                     CORRELATION CONFIDENCE
                   </h3>
                   <div className="flex items-end gap-3">
                     <span className={`text-5xl font-heading ${result.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>{result.confidence}</span>
                     <span className="text-[10px] uppercase tracking-widest text-brand-muted mb-2">OVERALL RATING</span>
                   </div>
                 </div>
                 
                 <div>
                   <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-3 mb-4">
                     SUPPORTING SIGNALS
                   </h3>
                   <div className="space-y-4">
                     {result.confidence_summary.map((sig: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-sans text-brand-text">{sig.name}</span>
                            <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${sig.level === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>{sig.level}</span>
                          </div>
                          <p className="text-[9px] text-brand-muted font-mono uppercase">SRC: {sig.source}</p>
                        </div>
                     ))}
                   </div>
                 </div>
              </div>
            </div>
            )}
            
            {/* Right Column: Entities */}
            <div className={`${result.entities.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-24`}>
              {result.entities.length > 0 && (
                <div>
                   <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-4 mb-6">
                     CORRELATED IDENTIFIERS
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {result.entities.map((entity: any) => (
                     <div 
                        key={entity.id} 
                        onClick={() => {
                          if (entity.type === 'WALLET' || entity.type === 'TRANSACTION') navigate('/blockchain');
                          else if (entity.type === 'ONION' || entity.type === 'DOMAIN' || entity.type === 'IP' || entity.type === 'CERTIFICATE') navigate('/infrastructure');
                          else if (entity.type === 'ALIAS') navigate('/persona');
                          else if (entity.type === 'ACTOR' || entity.type === 'PGP_FINGERPRINT') navigate('/actors');
                          else navigate('/search?q=' + encodeURIComponent(entity.value));
                        }}
                        className="p-5 border border-brand-border hover:border-brand-muted cursor-pointer transition-colors group bg-[#070809] flex flex-col justify-between h-32"
                      >
                       <div className="flex justify-between items-start">
                         <p className="text-[9px] text-brand-muted uppercase tracking-[0.2em] font-bold group-hover:text-brand-text transition-colors">
                           {entity.type.replace(/_/g, ' ')}
                         </p>
                         <span className={`text-[9px] uppercase tracking-widest font-bold ${entity.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>
                           {entity.confidence}
                         </span>
                       </div>
                       <div>
                         <p className="text-xl font-heading font-semibold text-brand-text break-all truncate group-hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" title={entity.value}>{entity.value}</p>
                         <p className="text-[9px] uppercase tracking-widest text-brand-muted font-mono mt-2 truncate">SRC: {entity.source}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
              )}
              
              
              {result.externalIntelligence && (
                <div className="pt-8 border-t border-brand-border">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-4 mb-6">
                    EXTERNAL INTELLIGENCE
                  </h3>
                  <div className="border border-brand-border p-6 bg-[#0A0C0E]/80 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-6">
                      <p className="text-[10px] text-brand-muted uppercase font-bold tracking-[0.2em]">ThreatFox</p>
                      <span className={`text-[9px] uppercase tracking-widest font-bold ${result.externalIntelligence.status === 'FOUND' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-muted'}`}>
                        {result.externalIntelligence.status}
                      </span>
                    </div>
                    {result.externalIntelligence.status === 'FOUND' && (
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">IOC</p>
                          <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.ioc}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">IOC TYPE</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.iocType}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">THREAT TYPE</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.threatTypeDescription || result.externalIntelligence.threatType}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">MALWARE</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.malwarePrintable || result.externalIntelligence.malware}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">CONFIDENCE</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">FIRST SEEN</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.firstSeen}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">LAST SEEN</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.lastSeen || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">REPORTER</p>
                            <p className="text-sm font-heading text-brand-text">{result.externalIntelligence.reporter}</p>
                          </div>
                        </div>
                        {result.externalIntelligence.reference && (
                           <div className="pt-2">
                             <p className="text-[9px] text-brand-muted uppercase tracking-widest font-mono">REFERENCE</p>
                             <a href={result.externalIntelligence.reference} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-accent hover:underline break-all">
                               {result.externalIntelligence.reference}
                             </a>
                           </div>
                        )}
                        <div className="pt-4 border-t border-brand-border/50">
                          <p className="text-[9px] text-brand-muted font-mono">RETRIEVED: {result.externalIntelligence.retrievedAt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

{result.timeline.length > 0 && (
              <div className="pt-8 border-t border-brand-border">
                 <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-4 mb-6">
                   INVESTIGATION TIMELINE
                 </h3>
                 <div className="space-y-0">
                    {result.timeline.map((t: any, idx: number) => (
                      <div key={t.id} className={`flex group ${shouldReduceMotion ? '' : 'animate-fade-up'}`} style={{ animationDelay: shouldReduceMotion ? '0ms' : `${idx * 50}ms` }}>
                        <div className="w-24 md:w-32 shrink-0 py-6 text-[10px] text-brand-muted font-mono tracking-widest">
                          {new Date(t.timestamp).toLocaleDateString('en-GB').replace(/\//g, '.')}
                        </div>
                        <div className="relative flex-1 border-l border-brand-border pl-6 md:pl-8 py-6 group-last:pb-0">
                           <div className="absolute w-2 h-2 bg-[#070809] border border-brand-border rounded-none -left-[4.5px] top-[1.7rem] group-hover:border-brand-accent transition-colors"></div>
                           <p className="text-brand-text font-heading text-lg md:text-xl mb-1">{t.description}</p>
                           <p className="text-[11px] tracking-widest text-brand-muted uppercase font-mono break-all">{t.value}</p>
                           <p className="text-[9px] tracking-widest text-brand-muted uppercase mt-3 inline-block font-mono border-b border-brand-border/50 pb-1">{t.source}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
