import React, { useEffect, useState, useRef } from 'react';
import { Upload, Database, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Sources() {
  const [sources, setSources] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', data });
        fetchSources(); // Refresh sources after import
      } else {
        setUploadStatus({ type: 'error', message: data.error || 'Upload failed' });
      }
    } catch (err: any) {
      setUploadStatus({ type: 'error', message: err.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-32 space-y-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-brand-border pb-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight text-brand-text uppercase leading-none">
            INTELLIGENCE<br /><span className="text-brand-muted">SOURCES</span>
          </h1>
          <p className="text-xl text-brand-muted font-sans font-light max-w-xl leading-relaxed">
            Track the origin, collection and provenance of every intelligence record entering CipherForge.
          </p>
        </div>
        
        <div className="relative shrink-0 flex flex-col items-end gap-4">
          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.json"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center gap-3 px-6 lg:px-10 py-4 bg-brand-text text-brand-bg hover:bg-white cursor-pointer transition-colors font-semibold tracking-widest text-[11px] uppercase ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Upload className="w-4 h-4" /> {isUploading ? 'IMPORTING...' : 'IMPORT INTELLIGENCE'}
          </label>
        </div>
      </div>

      {uploadStatus && uploadStatus.type === 'success' && (
        <div className="p-8 border border-brand-glow/30 bg-[#070809] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-glow"></div>
          <h3 className="text-brand-glow drop-shadow-[0_0_8px_rgba(234,88,12,0.15)] tracking-[0.2em] uppercase font-semibold text-[11px] mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> IMPORT COMPLETE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
             <div>
                <p className="text-[10px] text-brand-muted tracking-widest uppercase mb-1">Records Rcvd</p>
                <p className="text-xl font-heading font-semibold text-brand-text">{uploadStatus.data.records_received}</p>
             </div>
             <div>
                <p className="text-[10px] text-brand-muted tracking-widest uppercase mb-1">Valid</p>
                <p className="text-xl font-heading font-semibold text-brand-text">{uploadStatus.data.valid_records}</p>
             </div>
             <div>
                <p className="text-[10px] text-brand-muted tracking-widest uppercase mb-1">Duplicates</p>
                <p className="text-xl font-heading font-semibold text-brand-text">{uploadStatus.data.duplicates}</p>
             </div>
             <div>
                <p className="text-[10px] text-brand-muted tracking-widest uppercase mb-1">Invalid</p>
                <p className="text-xl font-heading font-semibold text-brand-text">{uploadStatus.data.invalid_records}</p>
             </div>
             <div>
                <p className="text-[10px] text-brand-muted tracking-widest uppercase mb-1">New Entities</p>
                <p className="text-xl font-heading font-semibold text-brand-text">{uploadStatus.data.new_entities}</p>
             </div>
             <div>
                <p className="text-[10px] text-brand-muted tracking-widest uppercase mb-1">New Rels</p>
                <p className="text-xl font-heading font-semibold text-brand-text">{uploadStatus.data.new_relationships}</p>
             </div>
          </div>
        </div>
      )}

      {uploadStatus && uploadStatus.type === 'error' && (
        <div className="p-8 border border-brand-accent/30 bg-[#070809] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent btn-motion"></div>
          <h3 className="text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] tracking-[0.2em] uppercase font-semibold text-[11px] mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> INVALID RECORD
          </h3>
          <p className="text-sm text-brand-muted font-mono">{uploadStatus.message}</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-brand-border pb-16">
        <div>
           <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-3">TOTAL SOURCES</p>
           <p className="text-5xl font-heading text-brand-text">{sources.length}</p>
        </div>
        <div>
           <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-3">TOTAL RECORDS</p>
           <p className="text-5xl font-heading text-brand-text">{sources.reduce((acc, s) => acc + s.record_count, 0).toLocaleString()}</p>
        </div>
        <div>
           <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-3">TOTAL ENTITIES</p>
           <p className="text-5xl font-heading text-brand-text">{sources.reduce((acc, s) => acc + s.entity_count, 0).toLocaleString()}</p>
        </div>
        <div>
           <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-3">ACTIVE SOURCES</p>
           <p className="text-5xl font-heading text-brand-text">{sources.filter(s => s.status === 'AVAILABLE').length}</p>
        </div>
      </div>

      {/* Source Table */}
      <div className="space-y-32">
        {sources.length === 0 && (
            <div className="text-brand-muted tracking-widest text-xs uppercase">No intelligence sources found.</div>
        )}
        
        {sources.map((item, idx) => (
          <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-brand-border pb-16 hover:bg-[#0A0C0E]/80 backdrop-blur-md transition-colors p-4 -mx-4 group cursor-pointer">
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                 <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-2">SOURCE NAME</h3>
                 <p className="text-xl md:text-2xl font-heading font-semibold text-brand-text leading-tight group-hover:text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] transition-colors">{item.name}</p>
              </div>
              <div className="mt-8">
                 <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">STATUS</p>
                 <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-border text-brand-text text-[9px] uppercase tracking-widest rounded-sm border border-brand-muted/20">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {item.status}
                 </span>
              </div>
            </div>
            
            <div className="lg:col-span-9 space-y-8">
              <div>
                 <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-muted mb-3">DESCRIPTION / TYPE</p>
                 <p className="text-lg font-sans font-light text-brand-muted leading-relaxed max-w-2xl">{item.description}</p>
                 <p className="text-[11px] mt-4 tracking-[0.2em] text-brand-text uppercase border border-brand-border inline-block px-3 py-1 bg-[#070809]/50">{item.type}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-brand-border">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">RECORDS</p>
                   <p className="text-lg font-sans text-brand-text">{item.record_count.toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">ENTITIES</p>
                   <p className="text-lg font-sans text-brand-text">{item.entity_count.toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">LAST IMPORTED</p>
                   <p className="text-[11px] tracking-wider text-brand-text uppercase">{new Date(item.last_imported).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-brand-muted mb-1">LAST SCANNED</p>
                   <p className="text-[11px] tracking-wider text-brand-text uppercase">{new Date(item.last_scanned).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
