import { useState, useEffect } from "react";
import { usePortfolio } from "@/lib/portfolio-store";
import { Reveal, SectionHeader } from "./primitives";
import type { Certificate } from "@/lib/portfolio-data";
import {
  extractGoogleDriveId,
  isGoogleDriveUrl,
  isImageUrl,
  isPdfUrl,
  getPdfPreviewUrl,
  getPdfDownloadUrl,
  getExternalViewUrl,
} from "@/lib/drive-utils";
import { FileText, Download, ExternalLink, Image as ImageIcon, Eye } from "lucide-react";

function CertificateModal({ cert, onClose }: { cert: Certificate | null; onClose: () => void }) {
  const [viewMode, setViewMode] = useState<"document" | "image">("document");

  useEffect(() => {
    if (cert) {
      document.body.style.overflow = "hidden";
      // Auto-select mode: if it's a PDF/Drive file, prefer document view; if only image, prefer image
      if (cert.fileUrl && (isPdfUrl(cert.fileUrl) || isGoogleDriveUrl(cert.fileUrl))) {
        setViewMode("document");
      } else {
        setViewMode("image");
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cert]);

  if (!cert) return null;

  const hasPdfOrDrive = cert.fileUrl && (isPdfUrl(cert.fileUrl) || isGoogleDriveUrl(cert.fileUrl));
  const hasThumbOrImage = cert.thumbUrl || (cert.fileUrl && isImageUrl(cert.fileUrl));
  const previewUrl = getPdfPreviewUrl(cert.fileUrl);
  const downloadUrl = getPdfDownloadUrl(cert.fileUrl);
  const externalUrl = getExternalViewUrl(cert.fileUrl);
  const isDrive = isGoogleDriveUrl(cert.fileUrl);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[1100px] h-full max-h-[92vh] flex flex-col border-2 border-border-strong bg-background shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-strong bg-surface px-4 py-3 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="label-xs text-primary font-bold">PREVIEW</span>
              {isDrive && (
                <span className="label-xs border border-accent bg-accent/10 text-accent px-1.5 py-0.2">
                  GOOGLE DRIVE
                </span>
              )}
            </div>
            <p className="truncate font-bold text-sm sm:text-base text-foreground mt-0.5">
              {cert.title}
            </p>
          </div>

          {/* View Mode Toggle if both are available */}
          {hasPdfOrDrive && hasThumbOrImage && (
            <div className="flex items-center border border-border bg-background p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("document")}
                className={`label-xs flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer ${
                  viewMode === "document"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("image")}
                className={`label-xs flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer ${
                  viewMode === "image"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Image Badge</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="label-xs shrink-0 border border-border-strong px-4 py-2 transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive cursor-pointer"
            aria-label="Close Preview"
          >
            CLOSE ✕
          </button>
        </div>

        {/* Content Container */}
        <div className="relative flex-1 w-full h-full bg-surface-2 overflow-hidden flex items-center justify-center">
          {viewMode === "document" && hasPdfOrDrive ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-none bg-white"
              title={cert.title}
              allow="autoplay"
            />
          ) : hasThumbOrImage ? (
            <div className="w-full h-full p-4 flex items-center justify-center overflow-auto">
              <img
                src={cert.thumbUrl || cert.fileUrl}
                alt={cert.title}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </div>
          ) : hasPdfOrDrive ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-none bg-white"
              title={cert.title}
              allow="autoplay"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                No preview document or image available.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-border-strong bg-surface px-4 py-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <span>
              ISSUER: <strong className="text-foreground">{cert.issuer}</strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              DATE: <strong className="text-foreground">{cert.date}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {cert.fileUrl && (
              <>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="label-xs inline-flex items-center gap-1.5 border border-border-strong bg-background px-3 py-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                  title="Direct Download"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>DOWNLOAD</span>
                </a>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-xs inline-flex items-center gap-1.5 border border-primary bg-primary px-3.5 py-2 text-primary-foreground transition-transform hover:-translate-y-0.5 font-bold"
                  title="Open in new tab / Google Drive"
                >
                  <span>OPEN {isDrive ? "IN DRIVE" : "FILE"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </>
            )}
          </div>
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
                    {/* Thumbnail Image if applicable */}
                    {(cert.thumbUrl || isImageUrl(cert.fileUrl)) && (
                      <img
                        src={cert.thumbUrl || cert.fileUrl}
                        alt={`${cert.title} preview`}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 z-0"
                        loading="lazy"
                      />
                    )}

                    {/* Google Drive / PDF badge */}
                    {isGoogleDriveUrl(cert.fileUrl) ? (
                      <div className="absolute top-2 right-2 z-20">
                        <span className="label-xs border border-accent bg-background/90 text-accent px-2 py-0.5 font-bold shadow">
                          GOOGLE DRIVE
                        </span>
                      </div>
                    ) : isPdfUrl(cert.fileUrl) ? (
                      <div className="absolute top-2 right-2 z-20">
                        <span className="label-xs border border-primary bg-background/90 text-primary px-2 py-0.5 font-bold shadow">
                          PDF DOC
                        </span>
                      </div>
                    ) : null}

                    {/* Abstract placeholder visual */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_11px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_11px)] z-0" />

                    {!(cert.thumbUrl || isImageUrl(cert.fileUrl)) && (
                      <FileText className="w-16 h-16 text-muted-foreground mb-4 group-hover:text-primary transition-colors relative z-10" />
                    )}

                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="label-xs border border-primary bg-background/95 px-3 py-1.5 text-primary font-bold shadow-lg">
                        CLICK TO PREVIEW / DOWNLOAD
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <span className="label-xs text-primary mb-2">{cert.date}</span>
                    <h3 className="text-xl font-bold uppercase leading-tight tracking-tighter mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-semibold uppercase text-muted-foreground mb-4">
                      {cert.issuer}
                    </p>

                    {cert.skills && (
                      <div className="mt-auto pt-4 border-t-2 border-border-strong/50">
                        <span className="label-xs text-muted-foreground block mb-2">SKILLS:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills.split(",").map((skill, i) => (
                            <span
                              key={i}
                              className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cert.achievement && (
                      <div className="mt-3 pt-3 border-t-2 border-border-strong/50">
                        <span className="label-xs text-accent block mb-1">ACHIEVEMENT:</span>
                        <p className="text-xs text-foreground/80 line-clamp-2">
                          {cert.achievement.split(/(#65)/).map((part, i) =>
                            part === "#65" ? (
                              <span key={i} className="text-primary font-bold">
                                {part}
                              </span>
                            ) : (
                              part
                            ),
                          )}
                        </p>
                      </div>
                    )}
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
