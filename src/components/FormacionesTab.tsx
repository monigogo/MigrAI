import { Code2, Heart, Rocket, ExternalLink, Terminal, Wifi, Binary, Zap, Shield, Sprout, Sun, Users, Lightbulb, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface Resource {
  title: string;
  subtitle: string;
  logo: string;
  desc: string;
  url: string;
  icon: ReactNode;
}

interface Section {
  label: string;
  icon: ReactNode;
  accent: string;
  accentBg: string;
  accentBorder: string;
  resources: Resource[];
}

const sections: Section[] = [
  {
    label: "Tecnología",
    icon: <Terminal className="w-5 h-5" />,
    accent: "text-foreground",
    accentBg: "bg-emerald-800/10",
    accentBorder: "border-emerald-700/20",
    resources: [
      {
        title: "Somos F5",
        subtitle: "España · Francia",
        logo: "https://www.google.com/s2/favicons?domain=somosf5.org&sz=64",
        desc: "Bootcamps tech 100% gratuitos e inclusivos.",
        url: "https://www.somosf5.org",
        icon: <Code2 className="w-4 h-4" />,
      },
      {
        title: "Factoría F5",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=factoriaf5.org&sz=64",
        desc: "Bootcamps gratuitos en desarrollo web, datos e IA.",
        url: "https://factoriaf5.org/aprende/",
        icon: <Zap className="w-4 h-4" />,
      },
      {
        title: "Cibervoluntarios",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=cibervoluntarios.org&sz=64",
        desc: "Formación digital gratuita e inclusión tecnológica.",
        url: "https://www.cibervoluntarios.org/es",
        icon: <Wifi className="w-4 h-4" />,
      },
      {
        title: "42 Madrid",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=42madrid.com&sz=64",
        desc: "Campus de programación gratuito, sin profesores ni horarios.",
        url: "https://www.42madrid.com/",
        icon: <Binary className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Fundaciones y ONG",
    icon: <Heart className="w-5 h-5" />,
    accent: "text-amber-700",
    accentBg: "bg-amber-700/10",
    accentBorder: "border-amber-700/20",
    resources: [
      {
        title: "Fundación Altius",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=fundacionaltius.org&sz=64",
        desc: "Formación e inserción sociolaboral para personas en riesgo de exclusión.",
        url: "https://www.fundacionaltius.org/areas/formacion/",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        title: "Fundación Tomillo",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=tomillo.org&sz=64",
        desc: "Formación gratuita para la inclusión social y laboral.",
        url: "https://tomillo.org/formacion/",
        icon: <Sprout className="w-4 h-4" />,
      },
      {
        title: "Fundación Orange",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=fundacionorange.es&sz=64",
        desc: "Formación inclusiva y accesible para personas con autismo.",
        url: "https://fundacionorange.es/junto-al-autismo/formacion/",
        icon: <Sun className="w-4 h-4" />,
      },
      {
        title: "AESCO",
        subtitle: "Madrid, España",
        logo: "https://www.google.com/s2/favicons?domain=ong-aesco.com&sz=64",
        desc: "Proyectos de integración y apoyo a migrantes en Madrid.",
        url: "https://ong-aesco.com/proyectos-madrid/",
        icon: <Users className="w-4 h-4" />,
      },
      {
        title: "Cruz Roja Madrid",
        subtitle: "Madrid, España",
        logo: "https://www.google.com/s2/favicons?domain=cursoscruzrojamadrid.com&sz=64",
        desc: "Certificados profesionales y cursos gratuitos.",
        url: "https://cursoscruzrojamadrid.com/cursos/certificados-profesionales/",
        icon: <Heart className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Startups e Innovación",
    icon: <Rocket className="w-5 h-5" />,
    accent: "text-teal-700",
    accentBg: "bg-teal-700/10",
    accentBorder: "border-teal-700/20",
    resources: [
      {
        title: "International Lab",
        subtitle: "Madrid, España",
        logo: "https://www.google.com/s2/favicons?domain=madridinnova.es&sz=64",
        desc: "Espacio de innovación para startups y emprendedores internacionales.",
        url: "https://www.madridinnova.es/espacios/international-lab/",
        icon: <Lightbulb className="w-4 h-4" />,
      },
      {
        title: "Nantik Lum",
        subtitle: "España",
        logo: "https://www.google.com/s2/favicons?domain=nantiklum.org&sz=64",
        desc: "Emprendimiento social y microfinanzas para colectivos vulnerables.",
        url: "https://nantiklum.org/",
        icon: <TrendingUp className="w-4 h-4" />,
      },
    ],
  },
];

const FormacionesTab = () => {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-foreground p-7 pb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(150_35%_35%_/_0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(36_70%_55%_/_0.15),transparent_50%)]" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3.5 py-1.5 text-xs font-bold text-white/90 mb-4 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            100% gratuito
          </div>
          <h1 className="font-heading text-[1.75rem] leading-[1.15] font-extrabold tracking-tight text-white">
            Estudia gratis
            <br />
            con tu pasaporte
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-[260px] leading-relaxed">
            Formaciones accesibles para migrantes. Solo necesitas tu pasaporte vigente.
          </p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.label} className="space-y-4">
          {/* Section header */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${section.accentBg} ${section.accent} border ${section.accentBorder}`}>
              {section.icon}
            </div>
            <div>
              <h2 className="font-heading text-[15px] font-bold text-foreground leading-tight">{section.label}</h2>
              <p className="text-[11px] text-muted-foreground">{section.resources.length} recursos disponibles</p>
            </div>
          </div>

          {/* Resource cards */}
          <div className="space-y-2.5">
            {section.resources.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 pr-5 transition-all duration-200 hover:border-primary/25 hover:shadow-md hover:bg-accent/50 active:scale-[0.98]"
              >
                {/* Logo */}
                <div className={`shrink-0 w-12 h-12 rounded-xl ${section.accentBg} border ${section.accentBorder} flex items-center justify-center overflow-hidden`}>
                  <img
                    src={item.logo}
                    alt={item.title}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span class="${section.accent}">${item.title.charAt(0)}</span>`;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-foreground truncate">{item.title}</h3>
                  </div>
                  <p className={`text-[11px] ${section.accent} font-semibold mt-0.5`}>{item.subtitle}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">{item.desc}</p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors duration-200">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default FormacionesTab;
