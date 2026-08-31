import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Shield } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      });
  }, []);

  const handleExport = (format: string, seed: string) => {
    window.open(`/api/export/${format}?seed=${encodeURIComponent(seed)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-32">
      <div className="space-y-6 max-w-3xl border-b border-brand-border pb-12">
        <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
          INTELLIGENCE<br /><span className="text-brand-muted">REPORTS</span>
        </h1>
        <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
          Generated case files and exported intelligence packages.
        </p>
      </div>

      {loading ? (
        <div className="text-[10px] text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] uppercase tracking-widest animate-pulse">LOADING REPORTS...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map(report => (
            <div key={report.id} className="border border-brand-border bg-[#0A0C0E]/80 backdrop-blur-md hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-colors p-8 space-y-6 flex flex-col btn-motion">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-brand-muted">REPORT ID</p>
                  <p className="text-lg font-mono text-brand-text">{report.id}</p>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] px-2 py-1 border border-brand-accent/30">
                  {report.status}
                </span>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">SEED ARTIFACT</p>
                  <p className="text-xl font-heading font-semibold text-brand-text truncate">{report.seed}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted mb-1">CONFIDENCE</p>
                    <p className={`text-sm font-mono ${report.confidence === 'HIGH' || parseInt(report.confidence) >= 80 ? 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)]' : 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)]'}`}>
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
                    <p className="text-lg font-sans text-brand-text">{report.entities_count}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">RELS</p>
                    <p className="text-lg font-sans text-brand-text">{report.relationships_count}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-brand-muted">SOURCES</p>
                    <p className="text-lg font-sans text-brand-text">{report.sources_count}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-border flex flex-col gap-3">
                <button 
                  onClick={() => handleExport('report', report.seed)}
                  className="w-full py-3 bg-brand-text text-brand-bg hover:bg-white transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  <FileText className="w-3 h-3" /> VIEW REPORT
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleExport('csv', report.seed)}
                    className="flex-1 py-3 border border-brand-border text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button 
                    onClick={() => handleExport('json', report.seed)}
                    className="flex-1 py-3 border border-brand-border text-brand-muted hover:text-brand-text transition-colors text-[9px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-3 h-3" /> JSON
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
