import { useState } from "react";
import { Compass, ArrowRight, GraduationCap, Star, ChevronRight } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";
import globeImg from "@/assets/globe.png";

type AppState = "home" | "onboarding" | "dashboard";

const recommendations = [
  { title: "Curso de inglés básico", tag: "Idioma", emoji: "🗣️", desc: "Aprende palabras clave para tus trámites." },
  { title: "Derechos del migrante", tag: "Legal", emoji: "⚖️", desc: "Conoce qué protecciones tienes por ley." },
  { title: "Cómo buscar trabajo", tag: "Empleo", emoji: "💼", desc: "Consejos para conseguir tu primer empleo." },
];

const Index = () => {
  const [state, setState] = useState<AppState>("home");
  const [path, setPath] = useState<"new" | "continue">("new");
  const [userData, setUserData] = useState<{ country: string; age: string; sex: string } | null>(null);
  const [tab, setTab] = useState<"inicio" | "formaciones">("inicio");

  const handleSelectPath = (selected: "new" | "continue") => {
    setPath(selected);
    setState("onboarding");
  };

  const handleOnboardingComplete = (data: { country: string; age: string; sex: string }) => {
    setUserData(data);
    setState("dashboard");
  };

  if (state === "onboarding") {
    return <OnboardingForm onComplete={handleOnboardingComplete} onBack={() => setState("home")} />;
  }

  if (state === "dashboard" && userData) {
    return <Dashboard userData={userData} path={path} onBack={() => setState("home")} />;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-6 pt-6 pb-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              migr<span className="text-primary">AI</span>
            </span>
          </div>

          {/* Tab bar */}
          <nav className="flex gap-0 border-b border-border">
            <button
              onClick={() => setTab("inicio")}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === "inicio"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setTab("formaciones")}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === "formaciones"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Formaciones
            </button>
          </nav>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 pb-12 pt-8 space-y-10">
          {tab === "inicio" ? (
            <>
              {/* Hero */}
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 pt-2">
                    <h1 className="font-heading text-[2rem] leading-[1.15] font-extrabold tracking-tight text-foreground">
                      Claridad<br />
                      Migratoria<br />
                      <span className="text-primary">a tu Alcance</span>
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-[240px]">
                      Te guiamos paso a paso con tu proceso migratorio. Sin complicaciones.
                    </p>
                  </div>
                  <img
                    src={globeImg}
                    alt="Globo terráqueo"
                    className="w-36 h-36 object-contain shrink-0 -mt-2"
                  />
                </div>

                <button
                  onClick={() => handleSelectPath("new")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
                >
                  Comenzar ahora
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Path selection */}
              <div className="space-y-3">
                <p className="font-heading font-bold text-foreground text-base px-1">
                  ¿Por dónde quieres empezar?
                </p>
                <PathCard
                  icon={<Compass className="h-6 w-6" />}
                  title="No sé por dónde empezar"
                  description="Te explicamos todo desde cero, paso a paso."
                  onClick={() => handleSelectPath("new")}
                  variant="primary"
                />
                <PathCard
                  icon={<ArrowRight className="h-6 w-6" />}
                  title="Ya inicié mi proceso"
                  description="Descubre qué tienes que hacer ahora."
                  onClick={() => handleSelectPath("continue")}
                  variant="warm"
                />
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Star className="h-5 w-5 text-warm fill-warm" />
                  <h2 className="font-heading text-base font-bold text-foreground">Recursos útiles</h2>
                </div>
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  {recommendations.map((r, i) => (
                    <button
                      key={i}
                      className={`w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-accent active:bg-accent/80 ${
                        i < recommendations.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="text-3xl shrink-0">{r.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
                          {r.tag}
                        </span>
                        <h3 className="font-heading text-sm font-semibold text-foreground">{r.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground mb-1">
                  🎓 Estudia gratis con tu pasaporte
                </h1>
                <p className="text-sm text-muted-foreground">
                  Opciones de formación gratuita accesibles solo con pasaporte vigente.
                </p>
              </div>

              {/* Universidades */}
              <div className="space-y-3">
                <h2 className="font-heading text-base font-bold text-foreground px-1">🏛️ Universidades</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "UNED", subtitle: "España", emoji: "🇪🇸", desc: "Cursos abiertos y gratuitos en línea.", url: "https://www.uned.es" },
                    { title: "Academica.mx", subtitle: "México", emoji: "🇲🇽", desc: "Cursos respaldados por universidades.", url: "https://www.academica.mx" },
                    { title: "edX", subtitle: "Global", emoji: "📚", desc: "Harvard, MIT y más. Audita gratis.", url: "https://www.edx.org" },
                    { title: "Coursera", subtitle: "Global", emoji: "🌐", desc: "Google, IBM y más. Certificados.", url: "https://www.coursera.org" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-border bg-card p-4 flex flex-col gap-2 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.97]"
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground">{item.title}</h3>
                        <p className="text-xs text-primary font-semibold">{item.subtitle}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Gobierno */}
              <div className="space-y-3">
                <h2 className="font-heading text-base font-bold text-foreground px-1">🏢 Programas de Gobierno</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "SENCE", subtitle: "Chile", emoji: "🇨🇱", desc: "Capacitaciones gratuitas para migrantes.", url: "https://www.sence.cl" },
                    { title: "SENA", subtitle: "Colombia", emoji: "🇨🇴", desc: "Formación técnica. Acepta pasaporte/PEP.", url: "https://www.sena.edu.co" },
                    { title: "INEFOP", subtitle: "Uruguay", emoji: "🇺🇾", desc: "Capacitación laboral para migrantes.", url: "https://www.inefop.org.uy" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-border bg-card p-4 flex flex-col gap-2 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.97]"
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground">{item.title}</h3>
                        <p className="text-xs text-primary font-semibold">{item.subtitle}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Tecnología */}
              <div className="space-y-3">
                <h2 className="font-heading text-base font-bold text-foreground px-1">💻 Formaciones en Tecnología</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Factoría F5", subtitle: "España", emoji: "🚀", desc: "Bootcamps gratuitos en desarrollo web, datos e IA.", url: "https://factoriaf5.org/aprende/" },
                    { title: "Cibervoluntarios", subtitle: "España", emoji: "🌍", desc: "Formación digital gratuita e inclusión tecnológica.", url: "https://www.cibervoluntarios.org/es" },
                    { title: "Argentina Programa", subtitle: "Argentina", emoji: "🇦🇷", desc: "Formación en tecnología gratuita del gobierno.", url: "https://www.argentina.gob.ar/economia/conocimiento/argentina-programa" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-border bg-card p-4 flex flex-col gap-2 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.97]"
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground">{item.title}</h3>
                        <p className="text-xs text-primary font-semibold">{item.subtitle}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="px-6 pb-6 pt-2 text-center text-xs text-muted-foreground">
          migrAI no reemplaza la asesoría de un abogado.
        </p>
      </div>
    </div>
  );
};

export default Index;
