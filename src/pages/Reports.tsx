import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Shield, X, Network, CheckCircle2, ArrowRight } from 'lucide-react';
import { IntelligenceService } from '../services/intelligenceService';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReportSeed, setActiveReportSeed] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    IntelligenceService.getReports()
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenReport = (seed: string) => {
    const details = IntelligenceService.getReportDetails(seed);
    setReportDetails(details);
    setActiveReportSeed(seed);
  };

  const handleDownloadCsv = (seed: string) => {
    IntelligenceService.downloadCsv(seed);
  };

  const handleDownloadJson = (seed: string) => {
    IntelligenceService.downloadJson(seed);
  };

  const handleDownloadTxt = (seed: string) => {
    IntelligenceService.downloadTextReport(seed);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-24 space-y-16">
      {/* Header */}
      <div className="space-y-6 max-w-3xl border-b border-brand-border pb-12">
        <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
          INTELLIGENCE<br /><span className="text-brand-muted">REPORTS</span>
        </h1>
        <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
          Generated case dossiers and exportable intelligence packages.
        </p>
      </div>

      {loading ? (
        <div className="text-[10px] text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] uppercase tracking-widest animate-pulse">
          LOADING REPORTS...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map(report => (
            <div 
              key={report.id} 
              className="border border-brand-border bg-[#0A0C0E] hover:border-brand-accent/40 transition-colors p-8 space-y-6 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-muted">REPORT ID</p>
                  <p className="text-lg font-mono text-brand-text font-bold">{report.id}</p>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] px-2.5 py-1 border border-brand-accent/30 bg-brand-accent/5">
                  {report.status}
                </span>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">SEED ARTIFACT</p>
                  <p className="text-xl font-heading font-semibold text-brand-text truncate" title={report.seed}>
                    {report.seed}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">CONFIDENCE</p>
                    <p className={`text-sm font-mono font-bold ${report.confidence === 'HIGH' || parseInt(report.confidence) >= 80 ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>
                      {report.confidence}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">CREATED</p>
                    <p className="text-sm font-mono text-brand-text">
                      {new Date(report.created).toLocaleDateString('en-GB').replace(/\//g, '.')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-brand-border pt-4 mt-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">ENTITIES</p>
                    <p className="text-lg font-sans font-bold text-brand-text">{report.entities_count}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">RELS</p>
                    <p className="text-lg font-sans font-bold text-brand-text">{report.relationships_count}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">SOURCES</p>
                    <p className="text-lg font-sans font-bold text-brand-text">{report.sources_count}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-border flex flex-col gap-3">
                <button 
                  onClick={() => handleOpenReport(report.seed)}
                  className="w-full py-3 bg-brand-text text-brand-bg hover:bg-white transition-colors text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" /> VIEW REPORT
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDownloadCsv(report.seed)}
                    className="flex-1 py-2.5 border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-brand-muted"
                  >
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button 
                    onClick={() => handleDownloadJson(report.seed)}
                    className="flex-1 py-2.5 border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-brand-muted"
                  >
                    <Download className="w-3 h-3" /> JSON
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive In-App Case Report Modal */}
      {activeReportSeed && reportDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0C0E] border border-brand-border flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border bg-[#07090D]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-accent" />
                <div>
                  <h2 className="text-base font-heading font-bold uppercase tracking-wider text-brand-text">
                    CASE DOSSIER // {reportDetails.reportId}
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-brand-muted font-mono">
                    SEED: {reportDetails.seed} &bull; CONFIDENCE: {reportDetails.confidence}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setActiveReportSeed(null); setReportDetails(null); }}
                className="p-2 text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Executive Summary Card */}
              <div className="border border-brand-border bg-[#05070A] p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-border pb-3">
                  <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">
                    EXECUTIVE SUMMARY
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-brand-accent border border-brand-accent/30 px-2 py-0.5">
                    DEMO / RESEARCH MODE
                  </span>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Deanonymization inquiry anchored on target artifact <span className="text-brand-text font-mono font-semibold">{reportDetails.seed}</span>. 
                  Heuristic and multi-source graph correlation resolved <span className="text-brand-text font-semibold">{reportDetails.entities.length} related entities</span> across <span className="text-brand-text font-semibold">{reportDetails.relationships.length} validated edges</span> with an overall confidence score of <span className="text-brand-accent font-semibold">{reportDetails.confidence}</span>.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="border border-brand-border/60 p-3 bg-[#080A0D]">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">TOTAL NODES</p>
                    <p className="text-xl font-mono text-brand-text font-bold">{reportDetails.entities.length}</p>
                  </div>
                  <div className="border border-brand-border/60 p-3 bg-[#080A0D]">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">TOTAL EDGES</p>
                    <p className="text-xl font-mono text-brand-text font-bold">{reportDetails.relationships.length}</p>
                  </div>
                  <div className="border border-brand-border/60 p-3 bg-[#080A0D]">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">IDENTIFIED ACTORS</p>
                    <p className="text-xl font-mono text-brand-accent font-bold">{reportDetails.actors.length}</p>
                  </div>
                  <div className="border border-brand-border/60 p-3 bg-[#080A0D]">
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">WALLETS</p>
                    <p className="text-xl font-mono text-brand-glow font-bold">{reportDetails.wallets.length}</p>
                  </div>
                </div>
              </div>

              {/* Identified Threat Actors */}
              {reportDetails.actors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">
                    IDENTIFIED THREAT ACTORS
                  </h3>
                  <div className="space-y-2">
                    {reportDetails.actors.map((actor: any) => (
                      <div key={actor.id} className="border border-brand-border p-4 bg-[#07090D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-heading font-bold text-brand-text">{actor.value}</p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-muted mt-1 font-mono">
                            CATEGORY: {actor.category} &bull; SOURCE: {actor.source}
                          </p>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-brand-accent border border-brand-accent/40 px-2 py-1 self-start sm:self-auto">
                          CONFIDENCE: {actor.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correlated Entities Breakdown */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">
                  CORRELATED INDICATORS & INFRASTRUCTURE
                </h3>
                <div className="border border-brand-border overflow-x-auto bg-[#07090D]">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="border-b border-brand-border bg-[#05070A] text-brand-muted uppercase text-[9px] tracking-widest">
                      <tr>
                        <th className="p-3">TYPE</th>
                        <th className="p-3">VALUE</th>
                        <th className="p-3">SOURCE</th>
                        <th className="p-3">CONFIDENCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40">
                      {reportDetails.entities.slice(0, 10).map((e: any) => (
                        <tr key={e.id} className="hover:bg-brand-border/20 transition-colors">
                          <td className="p-3 text-brand-accent font-semibold">{e.type}</td>
                          <td className="p-3 text-brand-text break-all">{e.value}</td>
                          <td className="p-3 text-brand-muted truncate max-w-[150px]">{e.source}</td>
                          <td className="p-3 text-brand-muted">{e.confidence || 'HIGH'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-brand-border bg-[#07090D]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/graph?seed=${encodeURIComponent(reportDetails.seed)}`)}
                  className="px-4 py-2 border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer text-brand-muted"
                >
                  <Network className="w-3.5 h-3.5" /> OPEN IN GRAPH
                </button>
                <button
                  onClick={() => navigate(`/investigate`, { state: { artifact: reportDetails.seed } })}
                  className="px-4 py-2 border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer text-brand-muted"
                >
                  INVESTIGATE SEED <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadCsv(reportDetails.seed)}
                  className="px-4 py-2 border border-brand-border hover:border-brand-text text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> CSV
                </button>
                <button
                  onClick={() => handleDownloadJson(reportDetails.seed)}
                  className="px-4 py-2 border border-brand-border hover:border-brand-text text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> JSON
                </button>
                <button
                  onClick={() => handleDownloadTxt(reportDetails.seed)}
                  className="px-4 py-2 bg-brand-text text-brand-bg hover:bg-white transition-colors text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> TXT REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
