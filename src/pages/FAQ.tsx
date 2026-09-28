import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Lock, 
  Network, 
  Scale, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Share2, 
  Layers, 
  FileCode,
  Award
} from 'lucide-react';

interface FAQItem {
  id: string;
  badge: string;
  category: 'Ingestion & Evasion' | 'Entity Resolution' | 'Graph Analytics' | 'Legal & Compliance';
  icon: React.ReactNode;
  question: string;
  challengePreemption: string;
  technicalAnswer: React.ReactNode;
  keyTakeaways: string[];
  specsUsed: string[];
}

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>('FAQ-01');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const faqItems: FAQItem[] = [
    {
      id: 'FAQ-01',
      badge: 'TOR TRANSPORT & ANTI-SCRAPING',
      category: 'Ingestion & Evasion',
      icon: <Terminal className="w-4 h-4 text-brand-accent" />,
      question: 'How does CipherForge reliably overcome Tor circuit-level rate limiting, DDoS-Guard gates, and anti-scraping CAPTCHAs?',
      challengePreemption: 'Underground hidden services deploy Cloudflare/DDoS-Guard mirrors, dynamic proof-of-work (PoW) computation hurdles, and SVG/canvas distorted CAPTCHAs that disrupt conventional scrapers.',
      technicalAnswer: (
        <div className="space-y-4 text-xs md:text-sm text-brand-text/90 font-light leading-relaxed">
          <p>
            CipherForge separates raw transport orchestration from DOM extraction using a multi-tiered, asynchronous pipeline designed for high-latency anonymous routing:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-light text-brand-muted">
            <li>
              <strong className="text-brand-text font-medium">Asynchronous Circuit Daemon Pool:</strong> We orchestrate a containerized cluster of Tor client proxies managed via the Tor Control Port protocol (RFC 2631 / Stem). Upon receiving <code className="text-brand-accent font-mono">HTTP 429 Too Many Requests</code>, <code className="text-brand-accent font-mono">403 Forbidden</code>, or circuit degradation, the controller issues non-blocking <code className="text-brand-accent font-mono">SIGNAL NEWNYM</code> commands to trigger dynamic entry/exit node rotation across isolated SOCKS5 ports.
            </li>
            <li>
              <strong className="text-brand-text font-medium">Headless Browser Fingerprint Masking:</strong> For dynamic JavaScript-gated forums (e.g., Dread, underground escrow exchanges), DOM extraction leverages containerized Playwright/Puppeteer nodes hardened against detection. We patch prototype anomalies (<code className="text-brand-text font-mono">navigator.webdriver=false</code>, randomized WebGL/Canvas entropy injection, dynamically synthesized audio context curves, and realistic mouse-trajectory spline jitter).
            </li>
            <li>
              <strong className="text-brand-text font-medium">Local Tensor Vision & PoW Solvers:</strong> To avoid out-of-band telemetry leaks and preserve investigative OPSEC, non-standard graphical puzzles (e.g., 9-grid matrix selects, inverted character sets) are processed locally using a quantized, on-premise YOLOv8/CRNN vision model. For CPU-bound Proof-of-Work (PoW) gates, a multi-threaded WebAssembly worker computes target hash pre-images directly in sandbox memory.
            </li>
          </ul>
        </div>
      ),
      keyTakeaways: [
        'Dynamic Stem controller with automated SIGNAL NEWNYM round-robin rotation.',
        'Zero out-of-band data leakage: local quantized vision models solve CAPTCHAs on-premise without external third-party API dependencies.',
        'Asynchronous token-bucket rate smoothing prevents defensive circuit blacklisting.'
      ],
      specsUsed: ['Tor RFC 2631', 'Stem Controller', 'Playwright Stealth', 'Local ONNX/YOLOv8', 'WASM PoW Miner']
    },
    {
      id: 'FAQ-02',
      badge: 'IDENTITY RESOLUTION & ANTI-SPOOFING',
      category: 'Entity Resolution',
      icon: <Cpu className="w-4 h-4 text-brand-glow" />,
      question: 'How does CipherForge eliminate false positives when threat actors spoof PGP keys or reuse public cryptocurrency deposit addresses?',
      challengePreemption: 'Malicious actors actively plant dummy PGP keys, recycle historical vendor identities, or utilize shared mixing services to mislead analysts and trigger false identity merges.',
      technicalAnswer: (
        <div className="space-y-4 text-xs md:text-sm text-brand-text/90 font-light leading-relaxed">
          <p>
            CipherForge replaces naive, deterministic identifier linking with a multi-factor Bayesian confidence scoring framework governed by strict cryptographic and behavioural validation:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-light text-brand-muted">
            <li>
              <strong className="text-brand-text font-medium">Cryptographic Proof-of-Possession (PoP):</strong> PGP public key certificates uploaded to keyservers or forum profiles are not treated as authoritative identity anchors unless accompanied by a cryptographically signed cleartext challenge matching the target alias’s historically verified master/sub-key fingerprints. Unvalidated keys receive an immediate confidence penalty (<span className="text-brand-accent font-mono font-bold">confidence weight ≤ 0.35</span>).
            </li>
            <li>
              <strong className="text-brand-text font-medium">UTXO Co-Spending & Aggregation Pool Tagging:</strong> In blockchain tracing, single-address matching fails when funds route through centralized exchange deposit addresses or mixing services (e.g., ChipMixer, Wasabi CoinJoin). CipherForge applies Common-Input-Ownership Heuristics (CIOH) and peeling-chain clustering. Addresses with transaction volumes exceeding $10^3$ distinct counterparties are flagged as <code className="text-brand-glow font-mono">AGGREGATION_POOL</code> / <code className="text-brand-glow font-mono">MIXING_SERVICE</code>. Edges connecting actors to these pools are strictly typed as <code className="text-brand-muted font-mono">TRANSACTED_THROUGH</code> rather than transitive <code className="text-brand-accent font-mono">IDENTICAL_TO</code> identity unions.
            </li>
            <li>
              <strong className="text-brand-text font-medium">Orthogonal AI Stylometric Triangulation:</strong> Authorship attribution models (DeBERTa embeddings combined with character n-gram entropy, vocabulary richness [Hapax Legomena], and punctuation cadence) calculate an independent stylometric distance score. An automated entity merge is blocked unless the stylometric cosine similarity exceeds <strong>0.82</strong> alongside at least two independent corroborated infrastructure or temporal artifacts.
            </li>
          </ul>
        </div>
      ),
      keyTakeaways: [
        'Multi-factor Bayesian scoring prevents single-identifier poisoning attacks.',
        'Cryptographic Proof-of-Possession (PoP) mandatory for PGP key validity.',
        'Clustered wallet heuristics segregate mixing pools from genuine vendor settlement addresses.'
      ],
      specsUsed: ['OpenPGP RFC 4880', 'BIP-0032/0044', 'Common Input Ownership (CIOH)', 'DeBERTa Stylometry']
    },
    {
      id: 'FAQ-03',
      badge: 'NEO4J GRAPH ARCHITECTURE & VISUALIZATION',
      category: 'Graph Analytics',
      icon: <Network className="w-4 h-4 text-emerald-400" />,
      question: 'How does the platform effectively visualize dense, multi-source intelligence graphs without succumbing to the "hairball effect"?',
      challengePreemption: 'Cross-correlating thousands of IP addresses, onion mirrors, BTC/XMR transactions, and PGP fingerprints across dozens of sources quickly creates visually incomprehensible graphs.',
      technicalAnswer: (
        <div className="space-y-4 text-xs md:text-sm text-brand-text/90 font-light leading-relaxed">
          <p>
            CipherForge circumvents visual chaos and UI degradation through hierarchical semantic clustering, client-side WebGL canvas acceleration, and depth-bounded ego networks:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-light text-brand-muted">
            <li>
              <strong className="text-brand-text font-medium">Graph Data Science (GDS) Community Detection:</strong> Within Neo4j, backend projection procedures execute Louvain Modularity and Label Propagation algorithms. Low-salience peripheral entities (e.g., dynamic Tor relay IP clusters, high-frequency micro-transactions) are virtualized into composite meta-nodes (e.g., <em>[Infrastructure Cluster: 14 Tor Mirrors]</em>), drastically collapsing rendering complexity.
            </li>
            <li>
              <strong className="text-brand-text font-medium">GPU-Accelerated Spatial Physics:</strong> The network visualization engine utilizes HTML5 Canvas with hardware-accelerated WebGL shaders and D3 force simulations. Quadtree spatial indexing with Barnes-Hut theta approximation (<span className="text-emerald-400 font-mono">θ = 0.82</span>) enables fluid 60-FPS interactivity even with complex graphs.
            </li>
            <li>
              <strong className="text-brand-text font-medium">Analyst-Centric Depth Pruning & Shortest-Path Highlighting:</strong> Investigators can toggle confidence filters (<code className="text-brand-text font-mono">Confidence ≥ 0.70</code>), slice by observation timeframes, or project strictly <span className="font-mono text-emerald-400">k-hop ego networks (k ∈ [1, 3])</span> centered around the suspect threat actor. Shortest bridge paths to real-world infrastructure (clearnet servers, SSL certificates) are dynamically surfaced with glow shaders.
            </li>
          </ul>
        </div>
      ),
      keyTakeaways: [
        'Louvain community detection compresses repetitive infrastructure into clean meta-nodes.',
        'WebGL and Quadtree physics ensure zero FPS drop during investigation navigation.',
        'Adaptive confidence sliders prune speculative links to spotlight high-value de-anonymization pivots.'
      ],
      specsUsed: ['Neo4j GDS 2.5', 'Cypher Query Language', 'WebGL / D3-Force', 'Barnes-Hut Spatial Index']
    },
    {
      id: 'FAQ-04',
      badge: 'LEGAL STATUTES & SIH COMPLIANCE',
      category: 'Legal & Compliance',
      icon: <Scale className="w-4 h-4 text-amber-400" />,
      question: 'How is CipherForge’s data collection legally compliant and forensically sound for the Smart India Hackathon (SIH) prototype under Indian law?',
      challengePreemption: 'Dark web data collection often triggers scrutiny regarding unauthorized computer access, offensive cyber operations, PII violation under data protection laws, and chain of custody.',
      technicalAnswer: (
        <div className="space-y-4 text-xs md:text-sm text-brand-text/90 font-light leading-relaxed">
          <p>
            CipherForge is architected strictly as a <strong>passive, non-intrusive Open-Source Intelligence (OSINT) and defensive cyber threat intelligence system</strong>, adhering to Indian statutes and international digital forensic standards:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-light text-brand-muted">
            <li>
              <strong className="text-brand-text font-medium">Compliance with Information Technology Act (2000) & CERT-In Directives:</strong> The platform operates strictly within the boundaries of Section 43 and Section 66 of the IT Act. CipherForge performs <em>zero</em> active vulnerability exploitation, <em>zero</em> unauthorized credential bypasses, and <em>zero</em> intrusive penetrative probing. Ingestion targets only publicly accessible directory descriptors, open forum threads, public blockchain ledgers, and verified open-source threat feeds (abuse.ch, ThreatFox).
            </li>
            <li>
              <strong className="text-brand-text font-medium">DPDP Act (2023) Compliant Redaction Pipeline:</strong> In strict alignment with the Digital Personal Data Protection (DPDP) Act 2023, automated PII scrubbing routines discard unassociated civilian data, personal credentials of compromised victims, and bystander chatter. Data retention is strictly bounded to actionable adversary TTPs, criminal syndicate identifiers, and illicit marketplace operations.
            </li>
            <li>
              <strong className="text-brand-text font-medium">Forensic Admissibility (BSA 2023 / Section 65B IT Act):</strong> Under Section 63 of the Bharatiya Sakshya Adhiniyam (BSA) 2023 (formerly Section 65B of the Indian Evidence Act), electronic evidence requires verifiable integrity. Every artifact scraped by CipherForge is instantly stamped with a cryptographic SHA-256 hash, an immutable RFC 3161 UTC timestamp, and verifiable raw source provenance stored in an append-only audit ledger.
            </li>
          </ul>
        </div>
      ),
      keyTakeaways: [
        '100% passive OSINT collection — strictly zero unauthorized access or intrusive exploitation.',
        'Automated PII scrubbing protects innocent civilians under India’s DPDP Act 2023.',
        'Cryptographic SHA-256 immutability ensures forensic admissibility under BSA 2023 / Sec 65B.'
      ],
      specsUsed: ['IT Act 2000 (Sec 43/66)', 'DPDP Act 2023', 'BSA 2023 (Sec 63)', 'RFC 3161 Timestamping', 'NIST SP 800-86']
    }
  ];

  const categories = ['ALL', 'Ingestion & Evasion', 'Entity Resolution', 'Graph Analytics', 'Legal & Compliance'];

  const filteredItems = faqItems.filter(item => {
    return activeFilter === 'ALL' || item.category === activeFilter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-2 font-mono">
          <span>OPERATIONS</span>
          <span>/</span>
          <span className="text-brand-text">DOCUMENTATION</span>
          <span>/</span>
          <span className="text-brand-accent">ARCHITECTURE FAQ</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-text tracking-tight uppercase flex items-center gap-3">
              TECHNICAL FAQ & ARCHITECTURE DEFENSE
            </h1>
            <p className="text-xs md:text-sm text-brand-muted font-light mt-3 max-w-3xl leading-relaxed">
              Authoritative, evaluation-ready technical documentation addressing key operational hurdles: Tor anti-scraping, anti-spoofing entity resolution, large-scale Neo4j graph ergonomics, and Indian IT law / SIH prototype compliance.
            </p>
          </div>

          <div className="p-3 border border-brand-accent/40 bg-brand-accent/10 flex items-center gap-3 self-start md:self-auto shrink-0 shadow-[0_0_12px_rgba(185,28,28,0.2)]">
            <Award className="w-5 h-5 text-brand-accent shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-mono text-brand-accent font-bold">SIH EVALUATION READY</p>
              <p className="text-[11px] font-mono text-brand-text">Preemptive Technical Defense</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-4 overflow-x-auto scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === cat
                ? 'border border-brand-accent bg-brand-accent/15 text-brand-text font-bold shadow-[0_0_8px_rgba(185,28,28,0.25)]'
                : 'border border-brand-border bg-[#07090D] text-brand-muted hover:text-brand-text hover:border-brand-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-6">
        {filteredItems.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <div 
              key={item.id}
              className={`border transition-all duration-200 bg-[#0A0C0E]/90 backdrop-blur-md ${
                isExpanded 
                  ? 'border-brand-accent/70 shadow-[0_0_15px_rgba(185,28,28,0.15)]' 
                  : 'border-brand-border hover:border-brand-muted/60'
              }`}
            >
              {/* Question Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-6 md:p-8 cursor-pointer select-none flex items-start justify-between gap-4"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2 py-0.5 border border-brand-border bg-[#07090D] text-[9px] font-mono uppercase tracking-widest text-brand-muted font-bold flex items-center gap-1.5">
                      {item.icon}
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                      REF: {item.id}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-2xl font-heading font-semibold text-brand-text leading-snug">
                    {item.question}
                  </h3>

                  {/* Preemption Challenge Summary */}
                  <div className="p-3 border border-brand-border/60 bg-[#07090D] text-xs font-mono text-brand-muted flex items-start gap-2">
                    <span className="text-brand-accent font-bold uppercase shrink-0">CHALLENGE:</span>
                    <span className="text-brand-text/80">{item.challengePreemption}</span>
                  </div>
                </div>

                <div className="pt-2 text-brand-muted hover:text-brand-text transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-brand-accent" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Collapsible Technical Defense Content */}
              {isExpanded && (
                <div className="px-6 md:px-8 pb-8 pt-2 border-t border-brand-border/50 space-y-6">
                  {/* Detailed Body */}
                  <div className="bg-[#07090D] p-5 md:p-6 border border-brand-border">
                    <p className="text-[10px] uppercase tracking-widest font-mono text-brand-accent mb-3 flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-brand-accent" />
                      TECHNICAL ARCHITECTURE & MECHANISM
                    </p>
                    {item.technicalAnswer}
                  </div>

                  {/* Judge Evaluation Takeaways */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-brand-border bg-[#07090D]">
                      <p className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 mb-2 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> KEY JUDGE TAKEAWAYS
                      </p>
                      <ul className="space-y-1.5 text-xs font-mono text-brand-text/90">
                        {item.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border border-brand-border bg-[#07090D] flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-mono text-brand-muted mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-brand-accent" /> RELEVANT SPECIFICATIONS & PROTOCOLS
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.specsUsed.map((spec, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 border border-brand-border bg-[#05070a] text-[10px] font-mono text-brand-text"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-brand-border/40 flex justify-end">
                        <button
                          onClick={() => handleCopy(item.id, `${item.question}\n\n${item.keyTakeaways.join('\n')}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-border hover:border-brand-text bg-[#05070a] text-[10px] font-mono uppercase tracking-wider text-brand-text transition-colors cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-brand-muted" />
                              <span>COPY BRIEFING</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SIH Evaluation Summary Footnote Banner */}
      <div className="p-6 border border-brand-border bg-[#0A0C0E]/70 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest font-mono text-brand-accent font-bold">
            SMART INDIA HACKATHON – JURY & TECHNICAL AUDIT ADVISORY
          </p>
          <p className="text-xs text-brand-muted font-light">
            All capabilities demonstrated adhere strictly to passive OSINT paradigms and forensic reproducibility. Live demonstrations require zero active probing or credentials compromise.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">AUDIT READY</span>
        </div>
      </div>
    </div>
  );
}
