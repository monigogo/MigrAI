import { Home, ChevronRight, ExternalLink } from "lucide-react";

export interface HogarLink {
  title: string;
  desc: string;
  url?: string;
  logo?: string;
  emoji?: string;
}

const hogarLinks: HogarLink[] = [
  { title: "TopNanny", desc: "Encuentra trabajo como niñera o cuidador/a de niños en tu zona.", url: "https://topnanny.es/", logo: "https://www.google.com/s2/favicons?domain=topnanny.es&sz=64" },
  { title: "Sitly", desc: "Plataforma para encontrar trabajo como canguro o cuidador de niños.", url: "https://www.sitly.es/", logo: "https://www.google.com/s2/favicons?domain=sitly.es&sz=64" },
  { title: "Domestico24", desc: "Encuentra trabajo en limpieza, cuidado de personas y tareas del hogar.", url: "https://domestico24.es/es", logo: "https://www.google.com/s2/favicons?domain=domestico24.es&sz=64" },
  { title: "Rover", desc: "Encuentra trabajo como cuidador de mascotas: paseos, alojamiento y más.", url: "https://www.rover.com/es/", logo: "https://www.google.com/s2/favicons?domain=rover.com&sz=64" },
  { title: "Webel", desc: "App para encontrar y ofrecer servicios profesionales cerca de ti.", url: "https://appwebel.com/", logo: "https://www.google.com/s2/favicons?domain=appwebel.com&sz=64" },
  { title: "Nextdoor", desc: "Red social de vecinos para encontrar trabajo y servicios cerca de ti.", url: "https://es.nextdoor.com/", logo: "https://www.google.com/s2/favicons?domain=nextdoor.com&sz=64" },
  { title: "Milanuncios", desc: "Anuncios clasificados de empleo, servicios y mucho más en toda España.", url: "https://www.milanuncios.com/", logo: "https://www.google.com/s2/favicons?domain=milanuncios.com&sz=64" },
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
            <p className="text-xs text-muted-foreground">Empleo en limpieza, cuidado y servicios domésticos</p>
          </div>
        </div>
      </div>

      {/* Links */}
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
    </div>
  );
};

export default HogarTab;
