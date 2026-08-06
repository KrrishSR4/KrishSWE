import { useState, useEffect } from "react";
import { usePortfolio } from "@/lib/portfolio-store";
import { Reveal, SectionHeader } from "./primitives";
import type { Certificate } from "@/lib/portfolio-data";

function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certificate | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (cert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cert]);

  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[1000px] h-full max-h-[90vh] flex flex-col border-2 border-border-strong bg-background shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-border-strong bg-surface px-4 py-3 shrink-0">
          <div className="min-w-0">
            <span className="label-xs text-primary">PREVIEW</span>
            <p className="truncate font-semibold text-sm">{cert.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="label-xs shrink-0 border-2 border-border-strong px-4 py-2 transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            aria-label="Close Preview"
          >
            CLOSE
          </button>
        </div>

        {/* Iframe Container */}
        <div className="relative flex-1 w-full h-full bg-surface-2 overflow-hidden">
          {cert.driveUrl ? (
            <iframe 
              src={cert.driveUrl} 
              className="absolute inset-0 w-full h-full border-none" 
              allow="autoplay"
              title={cert.title}
            >
              Loading preview...
            </iframe>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <p className="text-muted-foreground">No preview link available.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4 border-t-2 border-border-strong bg-surface px-4 py-3 shrink-0">
          <span className="label-xs text-muted-foreground">ISSUER: <span className="text-foreground">{cert.issuer}</span></span>
          <span className="label-xs text-muted-foreground hidden sm:block">|</span>
          <span className="label-xs text-muted-foreground">DATE: <span className="text-foreground">{cert.date}</span></span>
          <a 
            href={cert.driveUrl.replace("/preview", "/view")} 
            target="_blank" 
            rel="noreferrer"
            className="label-xs ml-auto border-2 border-primary bg-primary px-4 py-2 text-primary-foreground hover:bg-transparent hover:text-primary transition-colors"
          >
            OPEN IN DRIVE ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export function Certificates() {
  const { content } = usePortfolio();
  const certificates = content.certificates || [];
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  return (
    <section className="section-pad border-t-2 border-border-strong bg-surface min-h-[50vh]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeader
          id="certificates"
          index="03"
          title="Certificates"
          meta="achievements · credentials · learning"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.length === 0 ? (
            <Reveal>
              <div className="col-span-full border-2 border-border-strong bg-background p-8 text-center sm:p-12">
                <h3 className="text-xl font-bold uppercase tracking-tighter text-muted-foreground">
                  No Certificates
                </h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  Certificates will appear here once added.
                </p>
              </div>
            </Reveal>
          ) : (
            certificates.map((cert, idx) => (
              <Reveal key={cert.id} delay={idx * 50}>
                <div 
                  className="group flex flex-col h-full border-2 border-border-strong bg-background cursor-pointer transition-colors hover:border-primary"
                  onClick={() => setActiveCert(cert)}
                >
                  <div className="relative aspect-[4/3] w-full border-b-2 border-border-strong bg-surface-2 overflow-hidden flex flex-col items-center justify-center p-6">
                    {/* Abstract placeholder visual */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_11px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_11px)]" />
                    
                    <svg className="w-16 h-16 text-muted-foreground mb-4 group-hover:text-primary transition-colors relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 z-10" />
                  </div>
                  
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <span className="label-xs text-primary mb-2">{cert.date}</span>
                    <h3 className="text-xl font-bold uppercase leading-tight tracking-tighter mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-semibold uppercase text-muted-foreground">
                      {cert.issuer}
                    </p>
                    
                    <div className="mt-auto pt-6 flex justify-between items-center">
                      <span className="label-xs text-muted-foreground group-hover:text-primary transition-colors">
                        VIEW CREDENTIAL
                      </span>
                      <span className="text-primary transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
      
      {/* Drive Preview Modal */}
      <CertificateModal cert={activeCert} onClose={() => setActiveCert(null)} />
    </section>
  );
}
