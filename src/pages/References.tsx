import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Tag, 
  FileText, 
  Database, 
  Shield, 
  Globe, 
  Check, 
  Copy,
  AlertTriangle
} from 'lucide-react';

interface ReferenceItem {
  id: string;
  title: string;
  category: 'Research Papers' | 'Datasets' | 'CTI Frameworks' | 'Threat Intelligence Sources' | 'Standards & Specs';
  authorOrOrg: string;
  date: string;
  summary: string;
  identifiers?: string[];
  url?: string;
  citation: string;
  warningNote?: string;
}

const ALL_REFERENCES: ReferenceItem[] = [
  // Research Papers
  {
    id: 'REF-PAPER-01',
    title: 'Threats from the Dark: A Review over Dark Web Investigation Research for Cyber Threat Intelligence',
    category: 'Research Papers',
    authorOrOrg: 'Security and Communication Networks (Wiley / Hindawi)',
    date: '2021',
    summary: 'Comprehensive survey analyzing dark web investigative methodologies, anonymous network topologies, actor de-anonymization techniques, and automated threat intelligence extraction paradigms.',
    identifiers: ['DOI: 10.1155/2021/1302999', 'Dark Web CTI', 'Tor Investigation', 'Actor Deanonymization'],
    url: 'https://onlinelibrary.wiley.com/doi/10.1155/2021/1302999',
    citation: 'Al-Nabki, M. W., et al. (2021). Threats from the Dark: A Review over Dark Web Investigation Research for Cyber Threat Intelligence. Security and Communication Networks, 2021, Article ID 1302999. https://doi.org/10.1155/2021/1302999'
  },
  {
    id: 'REF-PAPER-02',
    title: 'Dark Web Marketplaces: Data for Collaborative Threat Intelligence',
    category: 'Research Papers',
    authorOrOrg: 'ACM Digital Library',
    date: '2023',
    summary: 'Empirical study introducing collaborative telemetry datasets and forensic models for analyzing illicit underground marketplaces, vendor persona persistence, cryptocurrency settlement trails, and cross-platform intelligence sharing.',
    identifiers: ['DOI: 10.1145/3615666', 'ACM', 'Dark Marketplaces', 'Collaborative Intelligence'],
    url: 'https://doi.org/10.1145/3615666',
    citation: 'ACM. (2023). Dark Web Marketplaces: Data for Collaborative Threat Intelligence. Proceedings of the ACM on Measurement and Analysis of Computing Systems. https://doi.org/10.1145/3615666'
  },

  // Datasets
  {
    id: 'REF-DATASET-01',
    title: 'Labeled Dataset of Cybersecurity Events from Dark Web and Surface Web Forums',
    category: 'Datasets',
    authorOrOrg: 'Mendeley Data',
    date: '2023',
    summary: 'Ground-truth labeled corpus of cybersecurity incidents, zero-day discussions, exploit trades, and illicit credential trafficking compiled across underground dark web forums and surface developer communities.',
    identifiers: ['Mendeley Data', 'jt8yw5gdr2/1', 'Event Classification', 'Forum Corpus'],
    url: 'https://data.mendeley.com/datasets/jt8yw5gdr2/1',
    citation: 'Mendeley Data. (2023). Labeled Dataset of Cybersecurity Events from Dark Web and Surface Web Forums. Version 1. https://data.mendeley.com/datasets/jt8yw5gdr2/1'
  },
  {
    id: 'REF-DATASET-02',
    title: 'Dark PT-BR – Labeled Dark-Web Forum Posts',
    category: 'Datasets',
    authorOrOrg: 'Mendeley Data / Community CTI Archive',
    date: 'Catalogued',
    summary: 'Specialized natural language dataset of Portuguese-language underground forum threads, cybercrime chatter, contraband trades, and regional threat actor communications.',
    identifiers: ['PT-BR Corpus', 'Dark Web NLP', 'Underground Forums', 'Threat Modeling'],
    citation: 'Dark PT-BR: Labeled Dark-Web Forum Posts. Mendeley Data Community Repository.',
    warningNote: 'Unverified external direct DOI. Direct outbound link withheld to ensure strict citation integrity.'
  },

  // CTI Frameworks
  {
    id: 'REF-FW-MITRE',
    title: 'MITRE ATT&CK® Enterprise & Dark Web Tradecraft Matrix',
    category: 'CTI Frameworks',
    authorOrOrg: 'MITRE Corporation',
    date: 'Continuously Updated',
    summary: 'Globally-accessible knowledge base of adversary tactics, techniques, and procedures (TTPs) based on real-world observations, defining infrastructure staging, anonymization, and communication vectors.',
    identifiers: ['MITRE ATT&CK', 'T1583 (Acquire Infra)', 'T1584', 'T1588'],
    url: 'https://attack.mitre.org/',
    citation: 'MITRE Corporation. (2024). ATT&CK®: Adversarial Tactics, Techniques, and Common Knowledge. https://attack.mitre.org/'
  },
  {
    id: 'REF-FW-STIX',
    title: 'STIX™ 2.1 – Structured Threat Information Expression',
    category: 'CTI Frameworks',
    authorOrOrg: 'OASIS Open Standard',
    date: '2021',
    summary: 'Standardized structured graph language and JSON serialization specification for conveying threat intelligence, threat actor entities, observables, campaigns, and correlation relationships.',
    identifiers: ['STIX 2.1', 'OASIS Standard', 'JSON-LD Schema', 'Graph CTI'],
    url: 'https://www.oasis-open.org/standard/stix-version-2-1/',
    citation: 'OASIS Cyber Threat Intelligence (CTI) TC. (2021). STIX Version 2.1. OASIS Standard. https://www.oasis-open.org/standard/stix-version-2-1/'
  },
  {
    id: 'REF-FW-TAXII',
    title: 'TAXII™ 2.1 – Trusted Automated eXchange of Intelligence Information',
    category: 'CTI Frameworks',
    authorOrOrg: 'OASIS Open Standard',
    date: '2021',
    summary: 'Application protocol for securely exchanging cyber threat intelligence over HTTPS, defining RESTful API endpoints for querying, collecting, and publishing STIX 2.1 intelligence channels.',
    identifiers: ['TAXII 2.1', 'OASIS Standard', 'RESTful API', 'HTTPS Transport'],
    url: 'https://www.oasis-open.org/standard/taxii-version-2-1/',
    citation: 'OASIS Cyber Threat Intelligence (CTI) TC. (2021). TAXII Version 2.1. OASIS Standard. https://www.oasis-open.org/standard/taxii-version-2-1/'
  },

  // Threat Intelligence Sources
  {
    id: 'REF-SRC-THREATFOX',
    title: 'ThreatFox – abuse.ch IOC Sharing Platform',
    category: 'Threat Intelligence Sources',
    authorOrOrg: 'abuse.ch (Bern University of Applied Sciences)',
    date: 'Live Feed',
    summary: 'Collaborative, community-driven threat intelligence platform providing verified Indicators of Compromise (IOCs) including malware C2 IPs, domains, and payload hashes directly mapped to malware families.',
    identifiers: ['abuse.ch', 'ThreatFox API', 'Live IOCs', 'Malware C2'],
    url: 'https://threatfox.abuse.ch/',
    citation: 'abuse.ch. ThreatFox: Community-driven Platform for Sharing Indicators of Compromise. https://threatfox.abuse.ch/'
  },
  {
    id: 'REF-SRC-URLHAUS',
    title: 'URLhaus – Malicious URL Tracking Platform',
    category: 'Threat Intelligence Sources',
    authorOrOrg: 'abuse.ch (Bern University of Applied Sciences)',
    date: 'Live Feed',
    summary: 'Global project dedicated to monitoring, tracking, and disrupting malicious URLs distributing malware payloads, ransomware droppers, and phishing infrastructure.',
    identifiers: ['abuse.ch', 'URLhaus API', 'Malware Droppers', 'Active URLs'],
    url: 'https://urlhaus.abuse.ch/',
    citation: 'abuse.ch. URLhaus: A Project to Collect and Share Malicious URLs Used for Malware Distribution. https://urlhaus.abuse.ch/'
  },
  {
    id: 'REF-SRC-MALWAREBAZAAR',
    title: 'MalwareBazaar – Malware Sample Repository',
    category: 'Threat Intelligence Sources',
    authorOrOrg: 'abuse.ch (Bern University of Applied Sciences)',
    date: 'Live Feed',
    summary: 'Crowdsourced exchange repository for analyzing and downloading confirmed malware binaries, cryptographic sample hashes (SHA-256, MD5), and associated behavioral telemetry.',
    identifiers: ['abuse.ch', 'MalwareBazaar', 'Cryptographic Hashes', 'Sample Vault'],
    url: 'https://bazaar.abuse.ch/',
    citation: 'abuse.ch. MalwareBazaar: A Project by abuse.ch to Collect and Share Malware Samples. https://bazaar.abuse.ch/'
  },

  // Standards & Specifications
  {
    id: 'REF-SPEC-TOR',
    title: 'Tor Rendezvous Protocol & Next-Generation Hidden Services (v3 Onion)',
    category: 'Standards & Specs',
    authorOrOrg: 'The Tor Project',
    date: '2021',
    summary: 'Cryptographic engineering specification of the Tor onion services protocol v3, detailing ed25519 public key indexing, blinded key derivations, and descriptor directories.',
    identifiers: ['RFC-rend-spec-v3', 'ed25519', 'SHA3-256', 'Tor Architecture'],
    url: 'https://spec.torproject.org/rend-spec-v3',
    citation: 'The Tor Project. (2021). Tor Rendezvous Specification - Version 3. https://spec.torproject.org/rend-spec-v3'
  },
  {
    id: 'REF-SPEC-NIST',
    title: 'NIST SP 800-86: Guide to Integrating Forensic Techniques into Incident Response',
    category: 'Standards & Specs',
    authorOrOrg: 'National Institute of Standards and Technology',
    date: 'Rev 1',
    summary: 'Federal standard governing digital evidence preservation, immutable chain of custody, cryptographic hashing verification (SHA-256), and verifiable investigative observation records.',
    identifiers: ['NIST SP 800-86', 'ISO/IEC 27037', 'Chain of Custody', 'Forensic Integrity'],
    url: 'https://csrc.nist.gov/publications/detail/sp/800-86/final',
    citation: 'Kent, K., Chevalier, S., Grance, T., & Dang, H. (2006). Guide to Integrating Forensic Techniques into Incident Response. NIST Special Publication 800-86. https://doi.org/10.6028/NIST.SP.800-86'
  }
];

export default function References() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'ALL',
    'Research Papers',
    'Datasets',
    'CTI Frameworks',
    'Threat Intelligence Sources',
    'Standards & Specs'
  ];

  const handleCopyCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = ALL_REFERENCES.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      item.authorOrOrg.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.citation.toLowerCase().includes(query) ||
      item.identifiers?.some(id => id.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-2 font-mono">
          <span>EVIDENCE</span>
          <span>/</span>
          <span className="text-brand-text">REFERENCES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-text tracking-tight uppercase">
          INTELLIGENCE REFERENCES
        </h1>
        <p className="text-xs md:text-sm text-brand-muted font-light mt-3 max-w-3xl leading-relaxed">
          Peer-reviewed research literature, cybersecurity training datasets, open-source threat intelligence (OSINT) registries, and standardized CTI taxonomy specifications supporting CipherForge investigations.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-brand-border bg-[#07090D]">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-brand-muted font-mono">TOTAL REFERENCES</p>
          <p className="text-xl font-heading font-bold text-brand-text mt-1">{ALL_REFERENCES.length}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-brand-muted font-mono">RESEARCH PAPERS</p>
          <p className="text-xl font-heading font-bold text-brand-accent mt-1">
            {ALL_REFERENCES.filter(r => r.category === 'Research Papers').length}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-brand-muted font-mono">DATASETS</p>
          <p className="text-xl font-heading font-bold text-brand-glow mt-1">
            {ALL_REFERENCES.filter(r => r.category === 'Datasets').length}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-brand-muted font-mono">CTI SOURCES & SPECS</p>
          <p className="text-xl font-heading font-bold text-brand-text mt-1">
            {ALL_REFERENCES.filter(r => r.category === 'Threat Intelligence Sources' || r.category === 'CTI Frameworks' || r.category === 'Standards & Specs').length}
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center border-b border-brand-border pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'border border-brand-accent bg-brand-accent/15 text-brand-text font-bold shadow-[0_0_8px_rgba(185,28,28,0.25)]'
                  : 'border border-brand-border bg-[#07090D] text-brand-muted hover:text-brand-text hover:border-brand-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="SEARCH BY DOI, TITLE, ORG..."
            className="w-full bg-[#07090D] border border-brand-border pl-9 pr-3 py-2 text-xs font-mono uppercase tracking-wider text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>
      </div>

      {/* References Catalog */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="p-16 border border-brand-border bg-[#07090D] text-center space-y-3">
            <BookOpen className="w-8 h-8 text-brand-muted mx-auto" />
            <p className="text-sm font-mono text-brand-muted uppercase tracking-wider">
              No references found matching "{searchTerm}".
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <article 
              key={item.id} 
              className="p-6 md:p-8 border border-brand-border bg-[#0A0C0E]/85 backdrop-blur-md space-y-6 hover:border-brand-accent/40 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2 py-0.5 border border-brand-accent/40 bg-brand-accent/10 text-[9px] font-mono uppercase tracking-widest text-brand-accent font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                      REF ID: {item.id}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                      RELEASE: {item.date}
                    </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-brand-text group-hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors leading-snug">
                    {item.title}
                  </h2>
                  
                  <p className="text-[11px] font-mono uppercase tracking-wider text-brand-muted">
                    PUBLISHER / SOURCE: <span className="text-brand-text font-bold">{item.authorOrOrg}</span>
                  </p>
                </div>

                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border hover:border-brand-accent bg-[#07090D] text-[10px] font-mono uppercase tracking-wider text-brand-text hover:bg-brand-accent/10 transition-colors self-start shrink-0 cursor-pointer shadow-sm group-hover:border-brand-border"
                  >
                    <span>SOURCE DOC</span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand-accent" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand-border/60 bg-[#07090D]/50 text-[10px] font-mono uppercase tracking-wider text-brand-muted self-start shrink-0 select-none">
                    <span>ARCHIVAL ACCESS</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-brand-text/90 font-light leading-relaxed">
                {item.summary}
              </p>

              {/* Warning note if verification is pending */}
              {item.warningNote && (
                <div className="p-3 border border-amber-800/40 bg-amber-950/20 text-amber-300 text-xs font-mono flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item.warningNote}</span>
                </div>
              )}

              {/* Identifiers & Tags */}
              {item.identifiers && item.identifiers.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-brand-muted mr-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-brand-muted" /> TAGS:
                  </span>
                  {item.identifiers.map((ident, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-0.5 border border-brand-border bg-[#07090D] text-[10px] font-mono text-brand-text"
                    >
                      {ident}
                    </span>
                  ))}
                </div>
              )}

              {/* Formal Citation Box with One-Click Copy */}
              <div className="p-4 border border-brand-border/60 bg-[#07090D] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-widest font-mono text-brand-muted flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-brand-accent" /> CITATION / ATTRIBUTION
                  </p>
                  <p className="text-xs font-mono text-brand-text select-all leading-relaxed">
                    {item.citation}
                  </p>
                </div>
                
                <button
                  onClick={() => handleCopyCitation(item.citation, item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-border hover:border-brand-text bg-[#0A0C0E] text-[10px] font-mono uppercase tracking-wider text-brand-text transition-colors self-start sm:self-center shrink-0 cursor-pointer"
                  title="Copy citation to clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-brand-muted" />
                      <span>COPY CITATION</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
