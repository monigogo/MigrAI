import { useState } from "react";
import { Compass, ArrowRight, GraduationCap, Star, ChevronRight, Briefcase, Home } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";
import FormacionesTab from "@/components/FormacionesTab";
import EmpleoTab from "@/components/EmpleoTab";
import HogarTab from "@/components/HogarTab";
import AnimatedGlobe from "@/components/AnimatedGlobe";

type AppState = "home" | "onboarding" | "dashboard";

const recommendations = [
  { title: "Asistencia Jurídica Gratuita", tag: "Legal", emoji: "⚖️", desc: "Asesoramiento legal gratuito del Colegio de Abogados de Madrid.", url: "https://web.icam.es/ciudadanos/asistencia-juridica-gratuita/", logo: "https://www.google.com/s2/favicons?domain=web.icam.es&sz=64" },
  { title: "Buscar vivienda", tag: "Hogar", emoji: "🏠", desc: "Recursos para encontrar piso o alquiler en España.", action: "hogar" as const },
  { title: "Derechos laborales del inmigrante", tag: "Legal", emoji: "⚖️", desc: "Conoce tus derechos legales en el trabajo.", url: "https://www.seg-social.es/wps/wcm/connect/wss/37cada90-3821-4c78-ba53-e22ee3bfb7f9/94_F06.pdf?MOD=AJPERES", logo: "https://www.google.com/s2/favicons?domain=seg-social.es&sz=64" },
  { title: "Cómo buscar trabajo", tag: "Empleo", emoji: "💼", desc: "Consejos para conseguir tu primer empleo.", action: "empleo" as const },
];

const Index = () => {
  const [state, setState] = useState<AppState>("home");
  const [path, setPath] = useState<"new" | "continue">("new");
  const [userData, setUserData] = useState<{ country: string; age: string; sex: string } | null>(null);
  const [tab, setTab] = useState<"inicio" | "formaciones" | "empleo" | "hogar">("inicio");

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
            <button
              onClick={() => setTab("empleo")}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === "empleo"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Empleo
            </button>
            <button
              onClick={() => setTab("hogar")}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === "hogar"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="h-4 w-4" />
              Hogar
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
                  <AnimatedGlobe />
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
                      onClick={() => {
                        if ((r as any).action === "empleo") {
                          setTab("empleo");
                        } else if ((r as any).action === "hogar") {
                          setTab("hogar");
                        } else if (r.url) {
                          window.open(r.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-accent active:bg-accent/80 ${
                        i < recommendations.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      {r.logo ? (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          <img src={r.logo} alt={r.title} className="w-6 h-6 object-contain" />
                        </div>
                      ) : (
                        <span className="text-3xl shrink-0">{r.emoji}</span>
                      )}
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
          ) : tab === "formaciones" ? (
            <FormacionesTab />
          ) : tab === "hogar" ? (
            <HogarTab />
          ) : (
            <EmpleoTab />
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
