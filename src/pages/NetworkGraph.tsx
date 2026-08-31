import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { Shield, Fingerprint, Globe, Bitcoin, Network, ArrowRight } from 'lucide-react';

export default function NetworkGraph() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const seed = searchParams.get('seed');
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [allData, setAllData] = useState<{ entities: any[], relationships: any[] }>({ entities: [], relationships: [] });
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [graphFilter, setGraphFilter] = useState('ALL');

  useEffect(() => {
    if (seed) {
       fetch(`/api/export/json?seed=${encodeURIComponent(seed)}`)
         .then(res => res.json())
         .then(data => {
            setAllData({ entities: data.entities, relationships: data.relationships });
         });
    } else {
       Promise.all([
         fetch('/api/entities').then(res => res.json()),
         fetch('/api/relationships').then(res => res.json())
       ]).then(([entities, relationships]) => {
         setAllData({ entities, relationships });
       });
    }
  }, [seed]);

  useEffect(() => {
      const { entities, relationships } = allData;
      if (!entities.length) return;
      
      let filteredEntities = entities;
      let filteredRels = relationships;

      if (graphFilter !== 'ALL') {
        filteredEntities = filteredEntities.filter((e: any) => {
          if (graphFilter === 'CYBER') return e.type === 'ACTOR' || e.type === 'PGP_FINGERPRINT' || e.type === 'ACCOUNT';
          if (graphFilter === 'BLOCKCHAIN') return e.type === 'WALLET' || e.type === 'TRANSACTION' || e.type === 'ACTOR';
          if (graphFilter === 'INFRASTRUCTURE') return e.type === 'DOMAIN' || e.type === 'IP' || e.type === 'ONION' || e.type === 'CERTIFICATE' || e.type === 'ACTOR';
          if (graphFilter === 'PERSONA') return e.type === 'ALIAS' || e.type === 'ACTOR';
          return true;
        });
        const validIds = new Set(filteredEntities.map((e: any) => e.id));
        filteredRels = filteredRels.filter((r: any) => validIds.has(r.source_id) && validIds.has(r.target_id));
      }
      
      const nodes = filteredEntities.map((e: any) => ({ ...e, id: e.id, group: e.type }));
      const links = filteredRels.map((r: any) => ({
        source: r.source_id,
        target: r.target_id,
        type: r.relationship_type,
        confidence: r.confidence,
        raw: r
      }));
      setData({ nodes, links });
  }, [allData, graphFilter, seed]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.nodes.length === 0) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    svg.attr("viewBox", [0, 0, width, height]);
    
    const g = svg.append("g");
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
      
    svg.call(zoom);
    
    // Initial zoom to center
    svg.call(zoom.transform, d3.zoomIdentity.translate(width/2, height/2).scale(0.8));

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide().radius(60));

    // Links
    const link = g.append("g").attr("class", "links")
      .attr("stroke", "#1f1f1f")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line").attr("class", "link-line")
      .attr("stroke-width", (d: any) => d.confidence === 'HIGH' ? 2 : 1)
      .attr("stroke-dasharray", (d: any) => d.confidence === 'HIGH' ? '0' : '4,4')
      .style("cursor", "pointer")
      .on("click", (event, d) => {
         setSelectedLink(d);
         setSelectedNode(null);
      });

    // Link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(data.links)
      .join("text")
      .attr("font-size", 8)
      .attr("font-family", "Inter")
      .attr("letter-spacing", "0.2em")
      .attr("fill", "#666666")
      .attr("text-anchor", "middle")
      .text((d: any) => d.type.replace(/_/g, ' '));

    const getColor = (type: string) => {
      switch (type) {
        case 'ACTOR': 
        case 'ALIAS': return '#b91c1c'; // brand-accent
        case 'PGP_FINGERPRINT': 
        case 'CERTIFICATE': return '#8c8c8c'; // muted
        case 'WALLET': 
        case 'TRANSACTION': return '#ea580c'; // brand-glow
        case 'ONION': 
        case 'DOMAIN':
        case 'IP':
        case 'INFRASTRUCTURE': return '#f5f5f5'; // text
        default: return '#333333';
      }
    };

    // Nodes
    const node = g.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .join("g").attr("class", "node-group")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("circle")
      .attr("r", (d: any) => {
        if (seed && d.value.toLowerCase() === seed.toLowerCase()) return 18;
        return d.type === 'ACTOR' ? 14 : 10;
      })
      .attr("fill", (d: any) => seed && d.value.toLowerCase() === seed.toLowerCase() ? "#1a1a1a" : "#050505")
      .attr("stroke", (d: any) => getColor(d.type))
      .attr("stroke-width", (d: any) => seed && d.value.toLowerCase() === seed.toLowerCase() ? 3 : 1.5)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
        setSelectedLink(null);
      });
      
    // Auto-select seed
    if (seed) {
      const seedNode = data.nodes.find(n => n.value.toLowerCase() === seed.toLowerCase());
      if (seedNode && !selectedNode && !selectedLink) {
        setSelectedNode(seedNode);
      }
    }

    node.append("text")
      .attr("class", "node-label")
      .attr("dy", (d: any) => (seed && d.value.toLowerCase() === seed.toLowerCase()) ? 32 : (d.type === 'ACTOR' ? 26 : 22))
      .attr("text-anchor", "middle")
      .attr("fill", (d: any) => seed && d.value.toLowerCase() === seed.toLowerCase() ? getColor(d.type) : "#f5f5f5")
      .attr("font-size", (d: any) => seed && d.value.toLowerCase() === seed.toLowerCase() ? 12 : 10)
      .attr("font-weight", (d: any) => seed && d.value.toLowerCase() === seed.toLowerCase() ? "bold" : "normal")
      .attr("font-family", "Inter")
      .attr("letter-spacing", "0.1em")
      .text((d: any) => d.value.length > 20 ? d.value.substring(0, 17) + '...' : d.value);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
        
      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2 - 5);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, seed]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll('.node-group');
    const links = svg.selectAll('.link-line');
    const linkLabels = svg.selectAll('.links text');
    
    if (selectedNode) {
      // Find connected nodes
      const connected = new Set();
      connected.add(selectedNode.id);
      data.links.forEach((l: any) => {
        if (l.source.id === selectedNode.id) connected.add(l.target.id);
        if (l.target.id === selectedNode.id) connected.add(l.source.id);
      });

      nodes.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", (d: any) => connected.has(d.id) ? 1 : 0.2);
        
      nodes.selectAll('circle').transition().duration(300).ease(d3.easeCubicOut)
        .attr("transform", (d: any) => d.id === selectedNode.id ? "scale(1.3)" : "scale(1)");
        
      links.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", (d: any) => (d.source.id === selectedNode.id || d.target.id === selectedNode.id) ? 1 : 0.1);
        
      linkLabels.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", (d: any) => (d.source.id === selectedNode.id || d.target.id === selectedNode.id) ? 1 : 0.1);
    } else if (selectedLink) {
      nodes.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", (d: any) => (d.id === selectedLink.source.id || d.id === selectedLink.target.id) ? 1 : 0.2);
        
      nodes.selectAll('circle').transition().duration(300).ease(d3.easeCubicOut)
        .attr("transform", "scale(1)");
        
      links.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", (d: any) => d === selectedLink ? 1 : 0.1);
        
      linkLabels.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", (d: any) => d === selectedLink ? 1 : 0.1);
    } else {
      nodes.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", 1);
      nodes.selectAll('circle').transition().duration(300).ease(d3.easeCubicOut)
        .attr("transform", "scale(1)");
      links.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", 1);
      linkLabels.transition().duration(300).ease(d3.easeCubicOut)
        .style("opacity", 1);
    }
  }, [selectedNode, selectedLink, data.links]);

  return (
    <div className="h-full flex flex-col lg:flex-row w-full overflow-hidden bg-transparent">
      
      {/* Left Panel: Filters & Legend */}
      <div className="w-full lg:w-64 xl:w-72 border-b lg:border-b-0 lg:border-r border-[#1a1f26]/50 flex flex-col shrink-0 bg-[#05070A]/90 backdrop-blur-md z-10">
         <div className="p-6 border-b border-[#1a1f26]/50">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6">INTELLIGENCE FILTERS</h2>
            <div className="space-y-1">
              {['ALL', 'CYBER', 'BLOCKCHAIN', 'INFRASTRUCTURE', 'PERSONA'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setGraphFilter(filter)}
                  className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all duration-200 ease-smooth ${graphFilter === filter ? 'bg-[#f2f2f2] text-[#05070A]' : 'text-[#8A8F96] hover:text-[#D1D5DB] hover:bg-white/[0.03]'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
         </div>
         <div className="p-6 flex-1">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-6">LEGEND</h2>
            <div className="space-y-4 text-[9px] uppercase tracking-[0.15em] text-brand-muted font-sans">
              <div className="flex items-center gap-4"><div className="w-2 h-2 border border-[#b91c1c]"></div> THREAT ACTOR / ALIAS</div>
              <div className="flex items-center gap-4"><div className="w-2 h-2 border border-[#ea580c]"></div> BLOCKCHAIN / TX</div>
              <div className="flex items-center gap-4"><div className="w-2 h-2 border border-[#f5f5f5]"></div> INFRASTRUCTURE</div>
              <div className="flex items-center gap-4"><div className="w-2 h-2 border border-[#8c8c8c]"></div> IDENTIFIER / CERT</div>
            </div>
         </div>
      </div>

      {/* Center Panel: Graph Canvas */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0 bg-transparent" ref={containerRef}>
         <svg ref={svgRef} className="w-full h-full" />
         
         <div className="absolute top-6 left-6 pointer-events-none">
            <h1 className="text-3xl font-heading font-semibold text-[#F2F2F2] tracking-tight uppercase">
              RELATIONSHIP <span className="text-[#8A8F96]">MAP</span>
            </h1>
         </div>
      </div>

      {/* Right Panel: Inspector */}
      {(selectedNode || selectedLink) && (
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-[#1a1f26]/50 flex flex-col shrink-0 bg-[#05070A]/90 backdrop-blur-md z-10 overflow-y-auto" style={{
          animation: 'slideInRight 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>
           {selectedNode && (
             <div className="p-6 md:p-8 space-y-8">
               <div className="flex justify-between items-start">
                 <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">ENTITY INSPECTOR</h2>
                 <button onClick={() => setSelectedNode(null)} className="text-brand-muted hover:text-brand-text text-lg leading-none">&times;</button>
               </div>
               
               <div>
                 <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">{selectedNode.type.replace(/_/g, ' ')}</p>
                 <p className="text-2xl font-heading font-semibold text-brand-text break-all">{selectedNode.value}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 border-t border-brand-border pt-6">
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">CONFIDENCE</p>
                   <p className={`text-[11px] tracking-widest font-bold ${selectedNode.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>{selectedNode.confidence}</p>
                 </div>
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">SOURCE</p>
                   <p className="text-[10px] text-brand-text uppercase font-mono truncate">{selectedNode.source}</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 border-t border-brand-border pt-6">
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">FIRST SEEN</p>
                   <p className="text-[10px] font-mono text-brand-text">{new Date(selectedNode.first_seen).toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
                 </div>
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">LAST SEEN</p>
                   <p className="text-[10px] font-mono text-brand-text">{new Date(selectedNode.last_seen).toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
                 </div>
               </div>

               {selectedNode.description && (
                 <div className="border-t border-brand-border pt-6">
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">REMARKS</p>
                   <p className="text-sm text-brand-muted font-heading italic leading-relaxed">{selectedNode.description}</p>
                 </div>
               )}
               
               <div className="border-t border-brand-border pt-6 space-y-4">
                 <button onClick={() => navigate('/investigate', { state: { artifact: selectedNode.value } })} className="w-full py-3 bg-brand-text text-brand-bg hover:bg-white transition-colors text-[9px] uppercase tracking-[0.2em] font-bold">
                   INVESTIGATE ARTIFACT
                 </button>
                 <button onClick={() => navigate('/evidence')} className="w-full py-3 border border-brand-border text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-[0.2em] font-bold">
                   VIEW EVIDENCE
                 </button>
               </div>
             </div>
           )}
           
           {selectedLink && (
             <div className="p-6 md:p-8 space-y-8">
               <div className="flex justify-between items-start">
                 <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">RELATIONSHIP INSPECTOR</h2>
                 <button onClick={() => setSelectedLink(null)} className="text-brand-muted hover:text-brand-text text-lg leading-none">&times;</button>
               </div>
               
               <div>
                 <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">NATURE</p>
                 <p className="text-xl font-heading font-semibold text-brand-text break-all">{selectedLink.type.replace(/_/g, ' ')}</p>
               </div>
               
               <div className="space-y-4 border-t border-brand-border pt-6">
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-1">SOURCE NODE</p>
                   <p className="text-sm font-sans text-brand-text break-all cursor-pointer hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" onClick={() => setSelectedNode(selectedLink.source)}>{selectedLink.source.value}</p>
                 </div>
                 <ArrowRight className="w-4 h-4 text-brand-muted rotate-90 my-2 ml-2" />
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-1">TARGET NODE</p>
                   <p className="text-sm font-sans text-brand-text break-all cursor-pointer hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors" onClick={() => setSelectedNode(selectedLink.target)}>{selectedLink.target.value}</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 border-t border-brand-border pt-6">
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">CONFIDENCE</p>
                   <p className={`text-[11px] tracking-widest font-bold ${selectedLink.confidence === 'HIGH' ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>{selectedLink.confidence}</p>
                 </div>
                 <div>
                   <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted mb-2">SOURCE</p>
                   <p className="text-[10px] text-brand-text uppercase font-mono truncate">{selectedLink.raw.source}</p>
                 </div>
               </div>
               
               <div className="border-t border-brand-border pt-6 space-y-4">
                 <button onClick={() => navigate('/evidence')} className="w-full py-3 border border-brand-border text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-[0.2em] font-bold">
                   VIEW EVIDENCE LEDGER
                 </button>
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
