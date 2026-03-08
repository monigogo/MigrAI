import { Briefcase, ChevronRight, ExternalLink } from "lucide-react";

export interface EmpleoLink {
  title: string;
  desc: string;
  url?: string;
  logo?: string;
  emoji?: string;
}

const empleoLinks: EmpleoLink[] = [
  { title: "Nextdoor", desc: "Red social de vecinos para encontrar trabajo y servicios cerca de ti.", url: "https://es.nextdoor.com/", logo: "https://www.google.com/s2/favicons?domain=nextdoor.com&sz=64" },
  { title: "InfoJobs", desc: "El portal de empleo líder en España. Busca ofertas y envía tu CV.", url: "https://www.infojobs.net/", logo: "https://www.google.com/s2/favicons?domain=infojobs.net&sz=64" },
  { title: "Indeed", desc: "Buscador de empleo mundial. Miles de ofertas en España actualizadas a diario.", url: "https://es.indeed.com/", logo: "https://www.google.com/s2/favicons?domain=indeed.com&sz=64" },
];

const EmpleoTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Cómo buscar trabajo</h2>
            <p className="text-xs text-muted-foreground">Recursos para conseguir empleo en España</p>
          </div>
        </div>
      </div>

      {/* Links grid */}
      {empleoLinks.length > 0 ? (
        <div className="space-y-3">
          {empleoLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => link.url ? window.open(link.url, '_blank', 'noopener,noreferrer') : undefined}
              className="w-full rounded-2xl border border-border bg-card p-5 flex items-center gap-4 text-left transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            >
              {link.logo ? (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  <img src={link.logo} alt={link.title} className="w-7 h-7 object-contain" />
                </div>
              ) : (
                <span className="text-3xl shrink-0">{link.emoji || "💼"}</span>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm font-semibold text-foreground">{link.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{link.desc}</p>
              </div>
              {link.url ? (
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Próximamente</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Estamos preparando recursos de empleo para ti</p>
        </div>
      )}
    </div>
  );
};

export default EmpleoTab;
