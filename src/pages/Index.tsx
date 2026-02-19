import { useState } from "react";
import { Compass, ArrowRight, MapPin, GraduationCap, Star, ChevronRight } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";

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
    <div className="min-h-screen bg-muted flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen bg-background shadow-xl">

        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-md px-5 pt-5 pb-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-md">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">
              migr<span className="text-primary">AI</span>
            </span>
          </div>

          {/* Tab bar */}
          <nav className="flex gap-0">
            <button
              onClick={() => setTab("inicio")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                tab === "inicio"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              🏠 Inicio
            </button>
            <button
              onClick={() => setTab("formaciones")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                tab === "formaciones"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Aprender
            </button>
          </nav>
        </header>

        {/* Content */}
        <div className="flex-1 px-5 pb-10 pt-6 space-y-7">
          {tab === "inicio" ? (
            <>
              {/* Hero */}
              <div className="rounded-3xl bg-primary/10 border border-primary/15 p-6">
                <p className="text-4xl mb-3">👋</p>
                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground leading-snug">
                  ¡Hola! Estamos aquí<br />para ayudarte
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Te guiamos paso a paso con tu proceso migratorio. Sin complicaciones.
                </p>
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
                <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                  {recommendations.map((r, i) => (
                    <button
                      key={i}
                      className={`w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-muted active:bg-muted/80 ${
                        i < recommendations.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="text-3xl shrink-0">{r.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
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
                  📚 Aprende a tu ritmo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Cursos sencillos para prepararte mejor.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                {[
                  { title: "Inglés para trámites", desc: "Palabras clave para hablar en oficinas de inmigración.", tag: "Idioma", emoji: "🗣️" },
                  { title: "Preparación cívica", desc: "Lo necesario para el examen de ciudadanía.", tag: "Cívica", emoji: "🏛️" },
                  { title: "Herramientas digitales", desc: "Aprende a usar el celular y apps para tus gestiones.", tag: "Digital", emoji: "📱" },
                  { title: "Derechos laborales", desc: "Qué derechos tienes como trabajador migrante.", tag: "Legal", emoji: "⚖️" },
                ].map((item, i, arr) => (
                  <button
                    key={i}
                    className={`w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-muted active:bg-muted/80 ${
                      i < arr.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="text-3xl shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
                        {item.tag}
                      </span>
                      <h3 className="font-heading text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="px-5 pb-6 pt-2 text-center text-xs text-muted-foreground">
          migrAI no reemplaza la asesoría de un abogado.
        </p>
      </div>
    </div>
  );
};

export default Index;
