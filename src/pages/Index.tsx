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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur-md px-5 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            migr<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Tab bar - más grande y clara */}
        <nav className="flex gap-1">
          <button
            onClick={() => setTab("inicio")}
            className={`flex items-center gap-1.5 rounded-t-xl px-5 py-3 text-base font-semibold transition-colors ${
              tab === "inicio"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🏠 Inicio
          </button>
          <button
            onClick={() => setTab("formaciones")}
            className={`flex items-center gap-1.5 rounded-t-xl px-5 py-3 text-base font-semibold transition-colors ${
              tab === "formaciones"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            Aprender
          </button>
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 pt-6">
        {tab === "inicio" ? (
          <>
            {/* Hero - texto más grande y claro */}
            <div className="mb-8 rounded-2xl bg-primary/10 border border-primary/20 p-5">
              <p className="text-3xl mb-2">👋</p>
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                ¡Hola! Estamos aquí para ayudarte
              </h1>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Te guiamos paso a paso con tu proceso migratorio. Sin complicaciones.
              </p>
            </div>

            {/* Path selection - botones muy claros */}
            <p className="font-heading font-semibold text-foreground mb-3 text-base">
              ¿Por dónde quieres empezar?
            </p>
            <div className="flex flex-col gap-4 mb-8">
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
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-warm" />
                <h2 className="font-heading text-lg font-bold text-foreground">Recursos útiles</h2>
              </div>
              <div className="flex flex-col gap-3">
                {recommendations.map((r, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
                  >
                    <span className="text-3xl">{r.emoji}</span>
                    <div className="flex-1">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-1">
                        {r.tag}
                      </span>
                      <h3 className="font-heading text-base font-semibold text-foreground">{r.title}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground mb-1">
                📚 Aprende a tu ritmo
              </h1>
              <p className="text-base text-muted-foreground">
                Cursos sencillos para prepararte mejor.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { title: "Inglés para trámites", desc: "Palabras clave para hablar en oficinas de inmigración.", tag: "Idioma", emoji: "🗣️" },
                { title: "Preparación cívica", desc: "Lo necesario para el examen de ciudadanía.", tag: "Cívica", emoji: "🏛️" },
                { title: "Herramientas digitales", desc: "Aprende a usar el celular y apps para tus gestiones.", tag: "Digital", emoji: "📱" },
                { title: "Derechos laborales", desc: "Qué derechos tienes como trabajador migrante.", tag: "Legal", emoji: "⚖️" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex-1">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-1">
                      {item.tag}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="px-5 pb-5 text-center text-sm text-muted-foreground">
        migrAI no reemplaza la asesoría de un abogado.
      </p>
    </div>
  );
};

export default Index;
