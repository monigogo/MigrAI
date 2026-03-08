import { Home, ChevronRight, ExternalLink } from "lucide-react";

export interface HogarLink {
  title: string;
  desc: string;
  url?: string;
  logo?: string;
  emoji?: string;
}

const hogarLinks: HogarLink[] = [
  { title: "Idealista", desc: "El portal inmobiliario líder en España. Pisos en alquiler y venta.", url: "https://www.idealista.com/", logo: "https://www.google.com/s2/favicons?domain=idealista.com&sz=64" },
  { title: "Yaencontré", desc: "Buscador de pisos y casas en alquiler y venta en toda España.", url: "https://www.yaencontre.com/", logo: "https://www.google.com/s2/favicons?domain=yaencontre.com&sz=64" },
  { title: "Badi", desc: "Encuentra habitaciones y compañeros de piso en tu ciudad.", url: "https://badi.com/es/", logo: "https://www.google.com/s2/favicons?domain=badi.com&sz=64" },
  { title: "Pisos.com", desc: "Portal inmobiliario con miles de pisos en alquiler y venta.", url: "https://www.pisos.com/", logo: "https://www.google.com/s2/favicons?domain=pisos.com&sz=64" },
  { title: "Spotahome", desc: "Alquila pisos y habitaciones online con visitas virtuales.", url: "https://www.spotahome.com/es", logo: "https://www.google.com/s2/favicons?domain=spotahome.com&sz=64" },
  { title: "Fotocasa", desc: "Portal inmobiliario con pisos, casas y habitaciones en alquiler y venta.", url: "https://www.fotocasa.es/es/", logo: "https://www.google.com/s2/favicons?domain=fotocasa.es&sz=64" },
];

const HogarTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Sector Hogar</h2>
            <p className="text-xs text-muted-foreground">Buscar piso, alquiler y recursos inmobiliarios en España</p>
          </div>
        </div>
      </div>

      {/* Links */}
      {hogarLinks.length > 0 ? (
        <div className="space-y-3">
          {hogarLinks.map((link, i) => (
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
                <span className="text-3xl shrink-0">{link.emoji || "🏠"}</span>
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
          <Home className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Próximamente</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Estamos preparando recursos inmobiliarios para ti</p>
        </div>
      )}
    </div>
  );
};

export default HogarTab;
