import { Home, ChevronRight, ExternalLink } from "lucide-react";

export interface HogarLink {
  title: string;
  desc: string;
  url?: string;
  logo?: string;
  emoji?: string;
  color?: string;
}

const hogarLinks: HogarLink[] = [
  { title: "Idealista", desc: "El portal inmobiliario líder en España. Pisos en alquiler y venta.", url: "https://www.idealista.com/", logo: "https://www.google.com/s2/favicons?domain=idealista.com&sz=64", color: "from-lime-400/20 to-green-500/10" },
  { title: "Yaencontré", desc: "Buscador de pisos y casas en alquiler y venta en toda España.", url: "https://www.yaencontre.com/", logo: "https://www.google.com/s2/favicons?domain=yaencontre.com&sz=64", color: "from-orange-400/20 to-amber-500/10" },
  { title: "Badi", desc: "Encuentra habitaciones y compañeros de piso en tu ciudad.", url: "https://badi.com/es/", logo: "https://www.google.com/s2/favicons?domain=badi.com&sz=64", color: "from-cyan-400/20 to-teal-500/10" },
  { title: "Pisos.com", desc: "Portal inmobiliario con miles de pisos en alquiler y venta.", url: "https://www.pisos.com/", logo: "https://www.google.com/s2/favicons?domain=pisos.com&sz=64", color: "from-blue-500/20 to-indigo-500/10" },
  { title: "Spotahome", desc: "Alquila pisos y habitaciones online con visitas virtuales.", url: "https://www.spotahome.com/es", logo: "https://www.google.com/s2/favicons?domain=spotahome.com&sz=64", color: "from-violet-500/20 to-purple-600/10" },
  { title: "Fotocasa", desc: "Portal inmobiliario con pisos, casas y habitaciones en alquiler y venta.", url: "https://www.fotocasa.es/es/", logo: "https://www.google.com/s2/favicons?domain=fotocasa.es&sz=64", color: "from-red-400/20 to-rose-500/10" },
  { title: "Uniplaces", desc: "Alquiler de habitaciones y pisos para estudiantes y jóvenes profesionales.", url: "https://www.uniplaces.com/es", logo: "https://www.google.com/s2/favicons?domain=uniplaces.com&sz=64", color: "from-emerald-400/20 to-green-600/10" },
];

const HogarTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm border border-primary/10">
          <Home className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-extrabold text-foreground">Sector Hogar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Buscar piso, alquiler y recursos inmobiliarios en España</p>
        </div>
      </div>

      {/* Links */}
      {hogarLinks.length > 0 ? (
        <div className="space-y-2.5">
          {hogarLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => link.url ? window.open(link.url, '_blank', 'noopener,noreferrer') : undefined}
              className="w-full rounded-2xl border border-border bg-card p-4 flex items-center gap-4 text-left transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98] group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.logo ? (
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${link.color || 'from-muted to-muted'} flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-border/50 p-2.5`}>
                  <img src={link.logo} alt={link.title} className="w-8 h-8 object-contain" />
                </div>
              ) : (
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${link.color || 'from-muted to-muted'} flex items-center justify-center shrink-0 shadow-sm border border-border/50`}>
                  <span className="text-2xl">{link.emoji || "🏠"}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{link.desc}</p>
              </div>
              {link.url ? (
                <ExternalLink className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary shrink-0 transition-colors" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary shrink-0 transition-colors" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <Home className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Próximamente</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Estamos preparando recursos inmobiliarios para ti</p>
        </div>
      )}
    </div>
  );
};

export default HogarTab;
