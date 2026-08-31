import { NumberCounter } from "../components/NumberCounter";
import React, { useState } from 'react';
import { User, Fingerprint, Activity, FileText, ArrowRight, ShieldAlert, Network, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PersonaAnalysis() {
  const [actorValue, setActorValue] = useState('ShadowByte');
  const [candidateValue, setCandidateValue] = useState('Shadow_Byte');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch('/api/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorValue, candidateValue })
      });
      const data = await res.json();
      setTimeout(() => {
        setResult(data);
        setIsAnalyzing(false);
      }, 1500); // simulate analysis delay
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-brand-accent/50 bg-brand-accent/10 text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] mb-2 btn-motion">
            <AlertTriangle className="w-3 h-3" /> DEMO / RESEARCH MODE
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
            PERSONA<br /><span className="text-brand-muted">ANALYSIS</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Compare behavioural and linguistic signals to identify potential continuity between digital personas.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
         <div className="space-y-8 p-8 border border-brand-border bg-[#070809]/50">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-4">ANALYSIS INPUT</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2">KNOWN ACTOR</label>
                <input 
                  type="text" 
                  value={actorValue}
                  onChange={e => setActorValue(e.target.value)}
                  className="w-full bg-[#070809] border border-brand-border px-4 py-3 text-brand-text font-heading text-lg focus:outline-none focus:border-brand-text transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2">CANDIDATE PERSONA</label>
                <input 
                  type="text" 
                  value={candidateValue}
                  onChange={e => setCandidateValue(e.target.value)}
                  className="w-full bg-[#070809] border border-brand-border px-4 py-3 text-brand-text font-heading text-lg focus:outline-none focus:border-brand-text transition-colors"
                />
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full py-4 text-[11px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-3 ${isAnalyzing ? 'bg-brand-border text-brand-muted pointer-events-none' : 'bg-brand-text text-brand-bg hover:bg-white'}`}
            >
              {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
              {isAnalyzing ? 'ANALYZING SIGNALS...' : 'EXTRACT & COMPARE SIGNALS'}
            </button>
            <p className="text-[10px] text-brand-muted font-mono leading-relaxed text-center">
              MVP Note: Using controlled dataset text samples for stylometric comparison.
            </p>
         </div>

         <div className="space-y-8 pl-0 lg:pl-12 border-l-0 lg:border-l border-brand-border">
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 bg-brand-border/10 border border-brand-border">
                <FileText className="w-5 h-5 text-brand-muted" />
              </div>
              <div>
                 <h4 className="text-sm font-semibold tracking-widest text-brand-text uppercase mb-2">STYLOMETRIC ANALYSIS</h4>
                 <p className="text-xs text-brand-muted font-light leading-relaxed">Extracts features such as writing style, average sentence length, vocabulary patterns, punctuation, and formatting habits from historical text samples.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 bg-brand-border/10 border border-brand-border">
                <Activity className="w-5 h-5 text-brand-muted" />
              </div>
              <div>
                 <h4 className="text-sm font-semibold tracking-widest text-brand-text uppercase mb-2">BEHAVIOURAL ANALYSIS</h4>
                 <p className="text-xs text-brand-muted font-light leading-relaxed">Compares dataset-derived behavioural signals such as posting frequency, activity timing, category preferences, and identifier continuity.</p>
              </div>
            </div>
         </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-24 animate-in fade-in duration-700 pt-8 border-t border-brand-border">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto border border-brand-accent p-8 bg-brand-accent/5 btn-motion">
            <ShieldAlert className="w-8 h-8 text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] mx-auto mb-4" />
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted">PERSONA RESULT</h2>
            <div className="flex items-center justify-center gap-6 py-4">
               <span className="text-3xl font-heading text-brand-text">{result.candidate}</span>
               <ArrowRight className="w-6 h-6 text-brand-muted" />
               <span className="text-3xl font-heading text-brand-text">{result.linked_to}</span>
            </div>
            <p className="text-sm tracking-widest text-brand-muted uppercase">POTENTIALLY LINKED TO</p>
            <div className="pt-4 mt-4 border-t border-brand-border/50">
               <p className="text-5xl font-heading text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] mb-2"><NumberCounter value={parseInt(result.confidence)} suffix="%" /></p>
               <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">OVERALL PERSONA CORRELATION</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Correlation Breakdown */}
            <div className="space-y-6 p-8 border border-brand-border">
               <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-text border-b border-brand-border pb-4">CORRELATION SIGNALS</h3>
               <div className="space-y-6 pt-2">
                 {result.signals.map((signal: any, idx: number) => (
                   <div key={idx} className="flex justify-between items-end border-b border-brand-border/30 pb-3">
                     <div>
                       <p className="text-sm font-heading text-brand-text mb-1">{signal.name}</p>
                       <p className="text-[9px] uppercase tracking-widest text-brand-muted">
                         {signal.score ? `Similarity Score: ${signal.score}` : 'Categorical Match'}
                       </p>
                     </div>
                     <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 border ${signal.level === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] border-brand-accent/30 bg-brand-accent/10' : 'text-brand-muted border-brand-border bg-[#070809]/50'}`}>
                       {signal.level}
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Evidence & Details */}
            <div className="space-y-8">
               <div className="p-8 border border-brand-border bg-[#0A0C0E]/80 backdrop-blur-md space-y-6">
                 <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-text border-b border-brand-border pb-4">PERSONA EVIDENCE</h3>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">STYLOMETRIC SIMILARITY</p>
                       <p className="text-2xl font-heading font-semibold text-brand-text"><NumberCounter value={82} suffix="%" /></p>
                       <p className="text-[10px] text-brand-muted font-light mt-1">Potential stylistic similarity observed in vocabulary patterns. Does not definitively prove identity.</p>
                    </div>
                    <div className="pt-4 border-t border-brand-border/30">
                       <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">BEHAVIOURAL SIMILARITY</p>
                       <p className="text-2xl font-heading font-semibold text-brand-text"><NumberCounter value={76} suffix="%" /></p>
                       <p className="text-[10px] text-brand-muted font-light mt-1">Overlapping activity timing and category preferences.</p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-brand-border flex justify-between items-center">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">SOURCE</p>
                      <p className="text-xs text-brand-text tracking-widest uppercase">Research Persona Dataset</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">OBSERVED</p>
                      <p className="text-xs text-brand-text tracking-widest uppercase font-mono">{new Date().toLocaleDateString()}</p>
                    </div>
                 </div>
               </div>

               <div className="p-6 border border-brand-border flex items-center justify-between bg-[#070809] hover:bg-[#0A0C0E]/80 backdrop-blur-md transition-colors cursor-pointer group" onClick={() => navigate(`/graph?seed=${result.candidate}`)}>
                 <div className="space-y-2">
                   <p className="text-[11px] uppercase tracking-widest font-semibold text-brand-text">ADD TO GRAPH</p>
                   <p className="text-xs text-brand-muted font-light">Visualize potential linkage in unified investigation graph.</p>
                 </div>
                 <Network className="w-5 h-5 text-brand-muted group-hover:text-brand-text transition-colors" />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
