import { useState } from "react";
import { crearSesion, getSesionId } from "@/services/api";
import { Compass, ArrowRight, GraduationCap, Star, ChevronRight, Briefcase, Home, Sparkles } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";
import FormacionesTab from "@/components/FormacionesTab";
import EmpleoTab from "@/components/EmpleoTab";
import HogarTab from "@/components/HogarTab";
import AnimatedGlobe from "@/components/AnimatedGlobe";

type AppState = "home" | "onboarding" | "dashboard";

type Recommendation = {
  title: string;
  tag: string;
  emoji: string;
  desc: string;
  color: string;
  url?: string;
  logo?: string;
  action?: "empleo" | "hogar";
};

const recommendations: Recommendation[] = [
  { title: "Asistencia Jurídica Gratuita", tag: "Legal", emoji: "⚖️", desc: "Asesoramiento legal gratuito del Colegio de Abogados de Madrid.", url: "https://web.icam.es/ciudadanos/asistencia-juridica-gratuita/", logo: "https://www.google.com/s2/favicons?domain=web.icam.es&sz=64", color: "from-violet-500/20 to-purple-600/10" },
  { title: "Buscar vivienda", tag: "Hogar", emoji: "🏠", desc: "Recursos para encontrar piso o alquiler en España.", action: "hogar" as const, color: "from-emerald-400/20 to-green-500/10" },
  { title: "Derechos laborales del inmigrante", tag: "Legal", emoji: "⚖️", desc: "Conoce tus derechos legales en el trabajo.", url: "https://www.seg-social.es/wps/wcm/connect/wss/37cada90-3821-4c78-ba53-e22ee3bfb7f9/94_F06.pdf?MOD=AJPERES", logo: "https://www.google.com/s2/favicons?domain=seg-social.es&sz=64", color: "from-blue-500/20 to-indigo-500/10" },
  { title: "Cómo buscar trabajo", tag: "Empleo", emoji: "💼", desc: "Consejos para conseguir tu primer empleo.", action: "empleo" as const, color: "from-amber-400/20 to-orange-500/10" },
];

const tabs = [
  { id: "inicio" as const, label: "Inicio", icon: null },
  { id: "formaciones" as const, label: "Formación", icon: GraduationCap },
  { id: "empleo" as const, label: "Empleo", icon: Briefcase },
  { id: "hogar" as const, label: "Hogar", icon: Home },
];

const Index = () => {
  const [state, setState] = useState<AppState>("home");
  const [path, setPath] = useState<"new" | "continue">("new");
  const [userData, setUserData] = useState<{ country: string; age: string; sex: string } | null>(null);
  const [tab, setTab] = useState<"inicio" | "formaciones" | "empleo" | "hogar">("inicio");
  const [sesionId, setSesionId] = useState<string>(() => getSesionId());

  const handleSelectPath = (selected: "new" | "continue") => {
    setPath(selected);
    setState("onboarding");
  };

      const handleOnboardingComplete = async (data: { country: string; age: string; sex: string }) => {
    setUserData(data);
    try {
      const id = getSesionId();
      setSesionId(id);

      await crearSesion({
        sesion_id: id,
        pais: data.country,
        rango_edad: data.age,
      });
      setState("dashboard");
    } catch (error) {
      console.error("Error al crear la sesión en el backend:", error);
      setState("dashboard");
    }
  };

  if (state === "onboarding") {
    return <OnboardingForm onComplete={handleOnboardingComplete} onBack={() => setState("home")} />;
  }

  if (state === "dashboard" && userData) {
    return <Dashboard userData={userData} path={path} onBack={() => setState("home")} sesionId={sesionId} />;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg px-4 sm:px-6 pt-5 pb-0 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                migr<span className="text-primary">AI</span>
              </span>
            </div>
          </div>

          {/* Tab bar - scrollable */}
          <nav className="flex gap-1 -mx-1 overflow-x-auto scrollbar-hide pb-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all rounded-t-xl whitespace-nowrap ${
                  tab === t.id
                    ? "bg-card text-primary border border-border/60 border-b-card shadow-sm -mb-px relative z-[1]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                {t.icon && <t.icon className="h-3.5 w-3.5" />}
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 pb-12 pt-6 space-y-8">
          {tab === "inicio" ? (
            <>
              {/* Hero Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/75 p-5 sm:p-6 md:p-8 pb-5 overflow-hidden shadow-xl shadow-primary/15">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-sm" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/5 rounded-full" />
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full" />
                
                <div className="relative flex items-center gap-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-full mb-3 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      Tu guía migratoria
                    </div>
                    <h1 className="font-heading text-[1.5rem] sm:text-[1.65rem] md:text-3xl leading-[1.15] font-extrabold tracking-tight text-primary-foreground">
                      Claridad Migratoria<br />
                      <span className="text-white/80">a tu Alcance</span>
                    </h1>
                    <p className="mt-2.5 text-[13px] sm:text-sm leading-relaxed text-primary-foreground/75 max-w-[200px] sm:max-w-[280px]">
                      Te guiamos paso a paso con tu proceso migratorio.
                    </p>
                  </div>
                  <AnimatedGlobe />
                </div>
              </div>

              {/* Path selection */}
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                <p className="font-heading font-bold text-foreground text-base px-1 md:col-span-2">
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
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/30 to-orange-500/15 flex items-center justify-center">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  </div>
                  <h2 className="font-heading text-base font-bold text-foreground">Recursos útiles</h2>
                </div>
                <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                  {recommendations.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (r.action === "empleo") {
                          setTab("empleo");
                        } else if (r.action === "hogar") {
                          setTab("hogar");
                        } else if (r.url) {
                          window.open(r.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="w-full rounded-2xl border border-border bg-card p-4 flex items-center gap-4 text-left transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98] group"
                    >
                      {r.logo ? (
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-border/50 p-2`}>
                          <img src={r.logo} alt={r.title} className="w-7 h-7 object-contain" />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0 shadow-sm border border-border/50`}>
                          <span className="text-2xl">{r.emoji}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                          {r.tag}
                        </span>
                        <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{r.desc}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
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
        <div className="px-6 pb-6 pt-2 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <span>🔒</span>
            <span>migrAI no reemplaza la asesoría de un abogado.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
