import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, Network, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';

export default function Actors() {
  const [actors, setActors] = useState<any[]>([]);
  const [filteredActors, setFilteredActors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [actorDetails, setActorDetails] = useState<any | null>(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const res = await fetch('/api/actors');
      const data = await res.json();
      setActors(data);
      setFilteredActors(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActorDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/actors/${id}`);
      const data = await res.json();
      setActorDetails(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredActors(
      actors.filter(a => 
        a.value.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, actors]);

  const handleActorClick = (id: string) => {
    setSelectedActorId(id);
    fetchActorDetails(id);
  };

  const handleBack = () => {
    setSelectedActorId(null);
    setActorDetails(null);
  };

  if (selectedActorId && actorDetails) {
    const { actor, related, evidence } = actorDetails;
    
    // Group related entities
    const aliases = related.filter((r: any) => r.entity.type === 'ALIAS');
    const pgps = related.filter((r: any) => r.entity.type === 'PGP_FINGERPRINT');
    const wallets = related.filter((r: any) => r.entity.type === 'WALLET');
    const hiddenServices = related.filter((r: any) => r.entity.type === 'ONION');
    const accounts = related.filter((r: any) => r.entity.type === 'ACCOUNT');

    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
        <button onClick={handleBack} className="text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-text flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO DIRECTORY
        </button>

        {/* Dossier Header */}
        <div className="border-b border-brand-border pb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> THREAT ACTOR DOSSIER
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text mb-8 leading-none">
            {actor.value}
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">CATEGORY</p>
                <p className="text-sm tracking-widest text-brand-text uppercase">{actor.category}</p>
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">CONFIDENCE</p>
                <p className="text-sm tracking-widest text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] uppercase">{actor.confidence}</p>
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">FIRST SEEN</p>
                <p className="text-sm tracking-widest text-brand-text uppercase">{new Date(actor.first_seen).toLocaleDateString()}</p>
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">SOURCE</p>
                <p className="text-sm tracking-widest text-brand-text uppercase">{actor.source}</p>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate(`/graph?seed=${actor.value}`)}
            className="inline-flex items-center gap-3 px-4 py-3.5 border border-brand-border hover:border-brand-muted text-brand-text text-[11px] uppercase tracking-widest transition-colors"
          >
            <Network className="w-4 h-4" /> VIEW NETWORK GRAPH
          </button>
          <button 
             onClick={() => navigate('/investigate', { state: { artifact: actor.value } })}
            className="inline-flex items-center gap-3 px-4 py-3.5 bg-brand-text text-brand-bg hover:bg-white text-[11px] uppercase tracking-widest font-semibold transition-colors"
          >
            <Search className="w-4 h-4" /> INVESTIGATE ACTOR
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
          {/* Identifiers Column */}
          <div className="lg:col-span-2 space-y-24">
            
            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6 border-b border-brand-border pb-4">KNOWN ALIASES</h3>
              <div className="space-y-4">
                {aliases.length === 0 && <p className="text-xs text-brand-muted font-mono">No aliases recorded.</p>}
                {aliases.map((a: any) => (
                  <div key={a.entity.id} className="flex justify-between items-center p-4 bg-brand-border/10 border border-brand-border">
                    <span className="text-lg font-sans text-brand-text">{a.entity.value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted">{a.relationship.confidence} CONFIDENCE</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6 border-b border-brand-border pb-4">PGP FINGERPRINTS</h3>
              <div className="space-y-4">
                {pgps.length === 0 && <p className="text-xs text-brand-muted font-mono">No PGP keys recorded.</p>}
                {pgps.map((p: any) => (
                  <div key={p.entity.id} className="p-4 bg-brand-border/10 border border-brand-border space-y-2">
                    <span className="text-sm font-mono tracking-widest text-brand-text break-all block">{p.entity.value}</span>
                    <div className="flex justify-between items-center mt-2">
                       <span className="text-[10px] uppercase tracking-widest text-brand-muted">SOURCE: {p.entity.source}</span>
                       <span className="text-[10px] uppercase tracking-widest text-brand-muted">{p.relationship.confidence} CONFIDENCE</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] mb-6 border-b border-brand-border pb-4">BLOCKCHAIN WALLETS</h3>
              <div className="space-y-4">
                {wallets.length === 0 && <p className="text-xs text-brand-muted font-mono">No wallets recorded.</p>}
                {wallets.map((w: any) => (
                  <div key={w.entity.id} className="p-4 bg-brand-border/10 border border-brand-glow/20 space-y-2">
                    <span className="text-sm font-mono tracking-widest text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] break-all block">{w.entity.value}</span>
                    <div className="flex justify-between items-center mt-2">
                       <span className="text-[10px] uppercase tracking-widest text-brand-muted">SOURCE: {w.entity.source}</span>
                       <span className="text-[10px] uppercase tracking-widest text-brand-muted">{w.relationship.confidence} CONFIDENCE</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6 border-b border-brand-border pb-4">HIDDEN SERVICES</h3>
              <div className="space-y-4">
                {hiddenServices.length === 0 && <p className="text-xs text-brand-muted font-mono">No hidden services recorded.</p>}
                {hiddenServices.map((hs: any) => (
                  <div key={hs.entity.id} className="flex justify-between items-center p-4 bg-brand-border/10 border border-brand-border">
                    <span className="text-sm font-mono tracking-widest text-brand-text">{hs.entity.value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted">{hs.relationship.relationship_type}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6 border-b border-brand-border pb-4">LINKED ACCOUNTS</h3>
              <div className="space-y-4">
                {accounts.length === 0 && <p className="text-xs text-brand-muted font-mono">No accounts recorded.</p>}
                {accounts.map((acc: any) => (
                  <div key={acc.entity.id} className="flex justify-between items-center p-4 bg-brand-border/10 border border-brand-border">
                    <span className="text-sm font-mono tracking-widest text-brand-text">{acc.entity.value}</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted">{acc.entity.source}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Context Column */}
          <div className="space-y-24">
            <section className="p-6 border border-brand-border bg-[#070809]/50 space-y-6">
               <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-text border-b border-brand-border pb-4">WHY IS THIS PERSONA LINKED?</h3>
               <div className="space-y-4">
                 {related.slice(0, 5).map((r: any, idx: number) => (
                   <div key={idx} className="flex justify-between items-start">
                     <div>
                       <p className="text-xs text-brand-text">{r.relationship.relationship_type.replace(/_/g, ' ')}</p>
                       <p className="text-[10px] text-brand-muted mt-1 uppercase tracking-widest">{r.entity.type}</p>
                     </div>
                     <span className={`text-[10px] tracking-widest uppercase font-semibold ${r.relationship.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-muted'}`}>
                       {r.relationship.confidence}
                     </span>
                   </div>
                 ))}
               </div>
            </section>

            <section className="space-y-6">
               <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-4 flex justify-between items-center">
                 EVIDENCE PREVIEW
                 <button onClick={() => navigate('/evidence')} className="text-[9px] hover:text-brand-text transition-colors">VIEW ALL</button>
               </h3>
               <div className="space-y-4">
                 {evidence.length === 0 && <p className="text-xs text-brand-muted font-mono">No evidence records found.</p>}
                 {evidence.map((ev: any) => (
                   <div key={ev.id} className="p-4 border border-brand-border bg-[#0A0C0E]/80 backdrop-blur-md space-y-4">
                     <div className="flex items-center gap-2">
                       <LinkIcon className="w-3 h-3 text-brand-muted" />
                       <span className="text-[10px] font-mono text-brand-muted">{ev.hash.substring(0, 16)}...</span>
                     </div>
                     <p className="text-sm text-brand-text font-heading leading-relaxed">{ev.description}</p>
                     <p className="text-[9px] uppercase tracking-widest text-brand-muted pt-2 border-t border-brand-border/50">SRC: {ev.source}</p>
                   </div>
                 ))}
               </div>
            </section>

            <section className="space-y-6">
               <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted border-b border-brand-border pb-4">OBSERVATION TIMELINE</h3>
               <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-border before:to-transparent">
                 {related.sort((a: any, b: any) => new Date(a.entity.first_seen).getTime() - new Date(b.entity.first_seen).getTime()).slice(0, 5).map((r: any, idx: number) => (
                   <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active ${shouldReduceMotion ? '' : 'animate-fade-up'}`} style={{ animationDelay: shouldReduceMotion ? '0ms' : `${idx * 50}ms` }}>
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-brand-border bg-[#070809] group-[.is-active]:border-brand-text text-brand-muted group-[.is-active]:text-brand-text shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-brand-border bg-[#070809]/50">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-brand-text text-[10px] uppercase tracking-widest">{r.entity.type}</div>
                          <time className="font-mono text-brand-muted text-[10px]">{new Date(r.entity.first_seen).toLocaleDateString()}</time>
                        </div>
                        <div className="text-brand-muted text-xs break-all">{r.entity.value}</div>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
            THREAT<br /><span className="text-brand-muted">ACTORS</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Contextualized digital personas assembled from correlated identifiers, observations and evidence.
          </p>
        </div>
        
        <div className="flex items-center gap-8 shrink-0 pb-2">
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">TOTAL ACTORS</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-text">{actors.length}</p>
           </div>
           <div className="w-px h-12 bg-brand-border"></div>
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">HIGH CONFIDENCE</p>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]">{actors.filter(a => a.confidence === 'HIGH').length}</p>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-brand-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-[#070809] border border-brand-border text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-text transition-colors text-[11px] uppercase tracking-widest font-semibold"
            placeholder="SEARCH ACTORS, CATEGORIES OR SOURCES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Directory List */}
      <div className="space-y-8">
         {filteredActors.length === 0 && (
            <div className="text-brand-muted tracking-widest text-xs uppercase text-center py-12">No actors found matching criteria.</div>
         )}
         
         <div className="grid grid-cols-1 gap-4">
           {filteredActors.map((actor) => (
             <div 
               key={actor.id} 
               onClick={() => handleActorClick(actor.id)}
               className="border border-brand-border p-6 hover:bg-brand-border/10 cursor-pointer transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6 row-motion"
             >
               <div className="space-y-2 md:w-1/3">
                 <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-heading font-semibold text-brand-text group-hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">{actor.value}</h3>
                    <span className="px-2 py-1 border border-brand-border text-[9px] uppercase tracking-widest text-brand-muted bg-[#070809]/50">{actor.category}</span>
                 </div>
                 <p className="text-[10px] uppercase tracking-widest text-brand-muted">SRC: {actor.source}</p>
               </div>

               <div className="grid grid-cols-4 gap-4 md:flex-1">
                  <div className="text-center border-r border-brand-border/50">
                    <p className="text-lg font-sans text-brand-text">{actor.aliases}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mt-1">ALIASES</p>
                  </div>
                  <div className="text-center border-r border-brand-border/50">
                    <p className="text-lg font-sans text-brand-text">{actor.pgp}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mt-1">PGP KEYS</p>
                  </div>
                  <div className="text-center border-r border-brand-border/50">
                    <p className="text-lg font-sans text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]">{actor.wallets}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] mt-1">WALLETS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-sans text-brand-text">{actor.hidden_services}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mt-1">ONIONS</p>
                  </div>
               </div>

               <div className="flex items-center justify-between md:justify-end gap-8 md:w-1/4">
                 <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">CONFIDENCE</p>
                    <p className={`text-sm tracking-widest uppercase font-semibold ${actor.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-text'}`}>{actor.confidence}</p>
                 </div>
                 <div className="text-right hidden xl:block">
                    <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">LAST SEEN</p>
                    <p className="text-xs tracking-widest uppercase text-brand-text font-mono">{new Date(actor.last_seen).toLocaleDateString()}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
