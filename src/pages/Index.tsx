import { useState } from "react";
import { Compass, ArrowRight, MapPin, GraduationCap, Star } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";

type AppState = "home" | "onboarding" | "dashboard";

const recommendations = [
  { title: "Curso de inglés básico", tag: "Idioma", desc: "Aprende lo esencial para tus trámites." },
  { title: "Derechos del migrante", tag: "Legal", desc: "Conoce tus derechos fundamentales." },
  { title: "Preparación de entrevista", tag: "Empleo", desc: "Tips para conseguir tu primer trabajo." },
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md px-5 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">
            migr<span className="text-primary">AI</span>
          </span>
        </div>
        <nav className="flex gap-1">
          <button
            onClick={() => setTab("inicio")}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "inicio"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setTab("formaciones")}
            className={`flex items-center gap-1.5 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "formaciones"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Formaciones
          </button>
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 pt-6">
        {tab === "inicio" ? (
          <>
            {/* Hero */}
            <div className="mb-8">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                Tu guía migratoria
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Navega tu proceso paso a paso, con ayuda inteligente.
              </p>
            </div>

            {/* Path selection */}
            <div className="flex flex-col gap-4 mb-8">
              <PathCard
                icon={<Compass className="h-6 w-6" />}
                title="No sé por dónde empezar"
                description="Te guiamos desde cero con los pasos básicos para iniciar tu proceso migratorio."
                onClick={() => handleSelectPath("new")}
                variant="primary"
              />
              <PathCard
                icon={<ArrowRight className="h-6 w-6" />}
                title="Ya inicié mi proceso"
                description="Descubre cuál es tu siguiente paso y qué documentos necesitas."
                onClick={() => handleSelectPath("continue")}
                variant="warm"
              />
            </div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-warm" />
                <h2 className="font-heading text-base font-semibold text-foreground">Recomendaciones</h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {recommendations.map((r, i) => (
                  <button
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
                  >
                    <div>
                      <div className="mb-1">
                        <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
                          {r.tag}
                        </span>
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-foreground">{r.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground mb-2">
              Formaciones
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Cursos y recursos para prepararte mejor.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { title: "Inglés para trámites", desc: "Vocabulario esencial para oficinas de inmigración.", tag: "Idioma" },
                { title: "Preparación cívica", desc: "Lo que necesitas saber para el examen de ciudadanía.", tag: "Cívica" },
                { title: "Habilidades digitales", desc: "Aprende a usar herramientas online para tus gestiones.", tag: "Digital" },
                { title: "Derechos laborales", desc: "Conoce tus derechos como trabajador migrante.", tag: "Legal" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary mb-1">
                      {item.tag}
                    </span>
                    <h3 className="font-heading text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="px-5 pb-4 text-center text-xs text-muted-foreground">
        migrAI no reemplaza asesoría legal profesional.
      </p>
    </div>
  );
};

export default Index;
