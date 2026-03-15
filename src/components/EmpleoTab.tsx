import { Briefcase, ChevronRight, ExternalLink, FileText, HandHeart } from "lucide-react";

export interface EmpleoLink {
  title: string;
  desc: string;
  url?: string;
  logo?: string;
  emoji?: string;
  color?: string;
}

const conPapelesLinks: EmpleoLink[] = [
  { title: "InfoJobs", desc: "El portal de empleo líder en España. Busca ofertas y envía tu CV.", url: "https://www.infojobs.net/", logo: "https://www.google.com/s2/favicons?domain=infojobs.net&sz=64", color: "from-blue-500/20 to-blue-600/10" },
  { title: "Indeed", desc: "Buscador de empleo mundial. Miles de ofertas en España actualizadas a diario.", url: "https://es.indeed.com/", logo: "https://www.google.com/s2/favicons?domain=indeed.com&sz=64", color: "from-indigo-500/20 to-purple-500/10" },
  { title: "Job Today", desc: "Encuentra trabajo rápido en hostelería, retail y más. Respuesta en 24h.", url: "https://jobtoday.com/es/", logo: "https://www.google.com/s2/favicons?domain=jobtoday.com&sz=64", color: "from-cyan-500/20 to-teal-500/10" },
  { title: "LinkedIn", desc: "La red profesional más grande del mundo. Conecta, busca empleo y crece.", url: "https://www.linkedin.com/", logo: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64", color: "from-sky-500/20 to-blue-700/10" },
  { title: "Tecnoempleo", desc: "Portal de empleo especializado en tecnología e informática en España.", url: "https://www.tecnoempleo.com/", logo: "https://www.google.com/s2/favicons?domain=tecnoempleo.com&sz=64", color: "from-violet-500/20 to-purple-600/10" },
  { title: "Turijobs", desc: "Ofertas de empleo en turismo, hostelería y restauración.", url: "https://www.turijobs.com/es-es", logo: "https://www.google.com/s2/favicons?domain=turijobs.com&sz=64", color: "from-orange-400/20 to-amber-500/10" },
  { title: "Jobandtalent", desc: "Encuentra trabajo temporal y fijo en logística, retail y más sectores.", url: "https://jobs.jobandtalent.com/es", logo: "https://www.google.com/s2/favicons?domain=jobandtalent.com&sz=64", color: "from-emerald-500/20 to-green-600/10" },
  { title: "BuscoJobs", desc: "Portal de empleo con ofertas en todos los sectores en España.", url: "https://www.buscojobs.com.es/", logo: "https://www.google.com/s2/favicons?domain=buscojobs.com.es&sz=64", color: "from-rose-400/20 to-pink-500/10" },
  { title: "Adecco", desc: "Agencia de empleo temporal y fijo. Ofertas en todos los sectores.", url: "https://www.adecco.com/es-es", logo: "https://www.google.com/s2/favicons?domain=adecco.com&sz=64", color: "from-red-500/20 to-red-600/10" },
  { title: "Taskia", desc: "Plataforma para encontrar trabajos puntuales y tareas cerca de ti.", url: "https://www.taskia.es/", logo: "https://www.google.com/s2/favicons?domain=taskia.es&sz=64", color: "from-lime-400/20 to-green-500/10" },
  { title: "Clintu", desc: "Conecta con clientes que buscan profesionales de limpieza y hogar.", url: "https://clintu.es/es", logo: "https://www.google.com/s2/favicons?domain=clintu.es&sz=64", color: "from-teal-400/20 to-emerald-500/10" },
];

const sinPapelesLinks: EmpleoLink[] = [
  { title: "InfoJobs", desc: "El portal de empleo líder en España. Busca ofertas y envía tu CV.", url: "https://www.infojobs.net/", logo: "https://www.google.com/s2/favicons?domain=infojobs.net&sz=64", color: "from-blue-500/20 to-blue-600/10" },
  { title: "Job Today", desc: "Encuentra trabajo rápido en hostelería, retail y más. Respuesta en 24h.", url: "https://jobtoday.com/es/", logo: "https://www.google.com/s2/favicons?domain=jobtoday.com&sz=64", color: "from-cyan-500/20 to-teal-500/10" },
  { title: "Nextdoor", desc: "Red social de vecinos para encontrar trabajo y servicios cerca de ti.", url: "https://es.nextdoor.com/", logo: "https://www.google.com/s2/favicons?domain=nextdoor.com&sz=64", color: "from-green-500/20 to-emerald-600/10" },
  { title: "Milanuncios", desc: "Anuncios clasificados de empleo, servicios y mucho más en toda España.", url: "https://www.milanuncios.com/", logo: "https://www.google.com/s2/favicons?domain=milanuncios.com&sz=64", color: "from-orange-500/20 to-amber-600/10" },
  { title: "Wallapop", desc: "Compra, vende y encuentra servicios y empleo cerca de ti.", url: "https://es.wallapop.com/", logo: "https://www.google.com/s2/favicons?domain=wallapop.com&sz=64", color: "from-teal-500/20 to-cyan-600/10" },
  { title: "TopNanny", desc: "Encuentra trabajo como niñera o cuidador/a de niños en tu zona.", url: "https://topnanny.es/", logo: "https://www.google.com/s2/favicons?domain=topnanny.es&sz=64", color: "from-pink-400/20 to-rose-500/10" },
  { title: "Rover", desc: "Encuentra trabajo como cuidador de mascotas: paseos, alojamiento y más.", url: "https://www.rover.com/es/", logo: "https://www.google.com/s2/favicons?domain=rover.com&sz=64", color: "from-yellow-400/20 to-amber-500/10" },
  { title: "Webel", desc: "App para encontrar y ofrecer servicios profesionales cerca de ti.", url: "https://appwebel.com/", logo: "https://www.google.com/s2/favicons?domain=appwebel.com&sz=64", color: "from-indigo-400/20 to-violet-500/10" },
  { title: "Domestico24", desc: "Encuentra trabajo en limpieza, cuidado de personas y tareas del hogar.", url: "https://domestico24.es/es", logo: "https://www.google.com/s2/favicons?domain=domestico24.es&sz=64", color: "from-sky-400/20 to-blue-500/10" },
  { title: "Sitly", desc: "Plataforma para encontrar trabajo como canguro o cuidador de niños.", url: "https://www.sitly.es/", logo: "https://www.google.com/s2/favicons?domain=sitly.es&sz=64", color: "from-fuchsia-400/20 to-pink-500/10" },
  { title: "Parroquias – Bolsa de trabajo", desc: "Parroquias que ofrecen bolsas de empleo y ayuda para encontrar trabajo.", url: "https://parroquiasantamariadeladehesa.es/bolsa-de-trabajo-2/", emoji: "⛪", color: "from-amber-400/20 to-yellow-500/10" },
];

const LinkCard = ({ link, index }: { link: EmpleoLink; index: number }) => (
  <button
    onClick={() => link.url ? window.open(link.url, '_blank', 'noopener,noreferrer') : undefined}
    className="w-full rounded-2xl border border-border bg-card p-4 flex items-center gap-4 text-left transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98] group"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {link.logo ? (
      <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${link.color || 'from-muted to-muted'} flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-border/50 p-2.5`}>
        <img src={link.logo} alt={link.title} className="w-8 h-8 object-contain" />
      </div>
    ) : (
      <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${link.color || 'from-muted to-muted'} flex items-center justify-center shrink-0 shadow-sm border border-border/50`}>
        <span className="text-2xl">{link.emoji || "💼"}</span>
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
);

const EmpleoTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm border border-primary/10">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-extrabold text-foreground">Cómo buscar trabajo</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Recursos para conseguir empleo en España</p>
        </div>
      </div>

      {/* Sin papeles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <HandHeart className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">🙌 Sin papeles</h3>
            <p className="text-[11px] text-muted-foreground">Opciones accesibles sin documentación</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {sinPapelesLinks.map((link, i) => (
            <LinkCard key={i} link={link} index={i} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-xs text-muted-foreground font-medium">ó</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Con papeles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">📄 Con papeles</h3>
            <p className="text-[11px] text-muted-foreground">Portales que requieren documentación</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {conPapelesLinks.map((link, i) => (
            <LinkCard key={i} link={link} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmpleoTab;
