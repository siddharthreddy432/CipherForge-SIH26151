import React, { useEffect, useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function Evidence() {
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => setEvidence(data));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setUploadStatus({ type: 'success', message: data.message });
      } else {
        setUploadStatus({ type: 'error', message: data.error });
      }
    } catch (err: any) {
      setUploadStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
            EVIDENCE<br /><span className="text-brand-muted">LEDGER</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Immutable records of ingested intelligence and derived relationships.
          </p>
        </div>
        
        <div className="relative shrink-0">
          <input
            type="file"
            id="file-upload"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-3 px-6 lg:px-10 py-4 bg-brand-text text-brand-bg hover:bg-white cursor-pointer transition-colors font-semibold tracking-widest text-[11px] uppercase"
          >
            <Upload className="w-4 h-4" /> IMPORT DATASET
          </label>
        </div>
      </div>

      {uploadStatus && (
        <div className={`p-6 border text-[11px] uppercase tracking-widest font-semibold ${uploadStatus.type === 'success' ? 'text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] border-brand-glow/30' : 'text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] border-brand-accent/30'}`}>
          {uploadStatus.message}
        </div>
      )}

      <div className="space-y-32">
        {evidence.length === 0 && (
            <div className="text-brand-muted tracking-widest text-xs uppercase">No evidence records found.</div>
        )}
        
        {evidence.map((item, idx) => (
          <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-brand-border pb-16">
            <div className="lg:col-span-3">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-2">EVIDENCE RECORD</h3>
              <p className="text-4xl font-sans font-semibold leading-none text-brand-text">{String(idx + 1).padStart(3, '0')}</p>
            </div>
            
            <div className="lg:col-span-9 space-y-8">
              <div>
                 <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-3">OBSERVATION / DESCRIPTION</p>
                 <p className="text-2xl font-heading font-semibold text-brand-text leading-tight">{item.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-brand-border">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">PROVENANCE</p>
                   <p 
                     className="text-[11px] tracking-wider text-brand-text uppercase cursor-pointer hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors flex items-center gap-1"
                     onClick={() => navigate('/sources')}
                   >
                     {item.source} <ArrowRight className="w-3 h-3" />
                   </p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">TIMESTAMP</p>
                   <p className="text-[11px] tracking-wider text-brand-text uppercase">{new Date(item.timestamp).toLocaleString('en-GB')}</p>
                </div>
                <div className="col-span-2 md:col-span-2">
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">CHAIN HASH</p>
                   <p className="text-[10px] font-mono tracking-widest text-brand-muted break-all">{item.hash}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
