import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { Shield, Network, Bitcoin, Globe, Fingerprint } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data))
        .finally(() => setLoading(false));
    }
  }, [query]);

  const handleNavigate = (entity: any) => {
    if (entity.type === 'ACTOR') navigate('/actors');
    else if (entity.type === 'WALLET' || entity.type === 'TRANSACTION') navigate('/blockchain');
    else if (entity.type === 'DOMAIN' || entity.type === 'IP' || entity.type === 'ONION' || entity.type === 'CERTIFICATE') navigate('/infrastructure');
    else if (entity.type === 'ALIAS') navigate('/persona');
    else navigate('/investigate');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-24">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
          GLOBAL <span className="text-brand-muted">SEARCH</span>
        </h1>
        <p className="text-sm tracking-widest uppercase text-brand-muted max-w-2xl">
          QUERYING ACROSS ALL DATASETS FOR "{query}"
        </p>
      </div>

      {loading ? (
        <div className="text-[10px] text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] uppercase tracking-widest animate-pulse">SEARCHING...</div>
      ) : (
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-widest text-brand-muted font-semibold border-b border-brand-border pb-4">
            {results.length} RESULTS FOUND
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r: any, idx: number) => (
              <div 
                key={r.id} 
                onClick={() => handleNavigate(r)}
                className={`p-6 border border-brand-border bg-[#0A0C0E]/80 backdrop-blur-md hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-colors cursor-pointer group btn-motion ${shouldReduceMotion ? '' : 'animate-fade-up'}`}
                style={{ animationDelay: shouldReduceMotion ? '0ms' : `${idx * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-muted group-hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">
                    {r.type === 'ONION' || r.type === 'DOMAIN' || r.type === 'IP' ? <Globe className="w-3 h-3" /> : null}
                    {r.type === 'WALLET' || r.type === 'TRANSACTION' ? <Bitcoin className="w-3 h-3" /> : null}
                    {r.type === 'ALIAS' || r.type === 'ACTOR' ? <Fingerprint className="w-3 h-3" /> : null}
                    {r.type.replace('_', ' ')}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-brand-muted border border-brand-border px-2 py-1">
                    {r.confidence}
                  </span>
                </div>
                <p className="text-xl font-heading font-semibold text-brand-text break-all mb-4">{r.value}</p>
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-brand-muted">
                  <span>SRC: {r.source}</span>
                  <span>SEEN: {new Date(r.last_seen).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
