import { useState } from "react";
import { Compass, ArrowRight, GraduationCap, Star, ChevronRight } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";
import FormacionesTab from "@/components/FormacionesTab";
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
              {/* Hero header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-accent to-primary/5 p-6 border border-primary/10">
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary mb-3">
                    🎓 Formación gratuita
                  </span>
                  <h1 className="font-heading text-[1.6rem] leading-tight font-extrabold tracking-tight text-foreground">
                    Estudia gratis<br />
                    <span className="text-primary">con tu pasaporte</span>
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                    Opciones de formación accesibles solo con pasaporte vigente.
                  </p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary/8 blur-2xl" />
              </div>

              {/* Tecnología */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-1">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/15 text-base">💻</span>
                  <h2 className="font-heading text-base font-bold text-foreground">Formaciones en Tecnología</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Somos F5", subtitle: "España / Francia", logo: "https://www.google.com/s2/favicons?domain=somosf5.org&sz=64", desc: "Bootcamps tech 100% gratuitos e inclusivos.", url: "https://www.somosf5.org" },
                    { title: "Factoría F5", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=factoriaf5.org&sz=64", desc: "Bootcamps gratuitos en desarrollo web, datos e IA.", url: "https://factoriaf5.org/aprende/" },
                    { title: "Cibervoluntarios", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=cibervoluntarios.org&sz=64", desc: "Formación digital gratuita e inclusión tecnológica.", url: "https://www.cibervoluntarios.org/es" },
                    { title: "42 Madrid", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=42madrid.com&sz=64", desc: "Campus de programación gratuito, sin profesores ni horarios.", url: "https://www.42madrid.com/" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-accent border border-border flex items-center justify-center overflow-hidden shrink-0">
                          <img src={item.logo} alt={item.title} className="w-7 h-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-sm font-bold text-foreground leading-tight">{item.title}</h3>
                          <p className="text-[11px] text-primary font-semibold">{item.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Fundaciones */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-1">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-warm/15 text-base">🤝</span>
                  <h2 className="font-heading text-base font-bold text-foreground">Fundaciones y ONG</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Fundación Altius", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=fundacionaltius.org&sz=64", desc: "Formación e inserción sociolaboral para personas en riesgo de exclusión.", url: "https://www.fundacionaltius.org/areas/formacion/" },
                    { title: "Fundación Tomillo", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=tomillo.org&sz=64", desc: "Formación gratuita para la inclusión social y laboral.", url: "https://tomillo.org/formacion/" },
                    { title: "Fundación Orange", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=fundacionorange.es&sz=64", desc: "Formación inclusiva y accesible para personas con autismo.", url: "https://fundacionorange.es/junto-al-autismo/formacion/" },
                    { title: "AESCO", subtitle: "Madrid, España", logo: "https://www.google.com/s2/favicons?domain=ong-aesco.com&sz=64", desc: "Proyectos de integración y apoyo a migrantes en Madrid.", url: "https://ong-aesco.com/proyectos-madrid/" },
                    { title: "Cruz Roja Madrid", subtitle: "Madrid, España", logo: "https://www.google.com/s2/favicons?domain=cursoscruzrojamadrid.com&sz=64", desc: "Certificados profesionales y cursos gratuitos.", url: "https://cursoscruzrojamadrid.com/cursos/certificados-profesionales/" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-accent border border-border flex items-center justify-center overflow-hidden shrink-0">
                          <img src={item.logo} alt={item.title} className="w-7 h-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-sm font-bold text-foreground leading-tight">{item.title}</h3>
                          <p className="text-[11px] text-primary font-semibold">{item.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Startups */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 px-1">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-success/15 text-base">🚀</span>
                  <h2 className="font-heading text-base font-bold text-foreground">Startups e Innovación</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "International Lab", subtitle: "Madrid, España", logo: "https://www.google.com/s2/favicons?domain=madridinnova.es&sz=64", desc: "Espacio de innovación para startups y emprendedores internacionales.", url: "https://www.madridinnova.es/espacios/international-lab/" },
                    { title: "Nantik Lum", subtitle: "España", logo: "https://www.google.com/s2/favicons?domain=nantiklum.org&sz=64", desc: "Emprendimiento social y microfinanzas para colectivos vulnerables.", url: "https://nantiklum.org/" },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-accent border border-border flex items-center justify-center overflow-hidden shrink-0">
                          <img src={item.logo} alt={item.title} className="w-7 h-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-sm font-bold text-foreground leading-tight">{item.title}</h3>
                          <p className="text-[11px] text-primary font-semibold">{item.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </span>
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
