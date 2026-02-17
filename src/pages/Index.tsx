import { useState } from "react";
import { Compass, ArrowRight, MapPin } from "lucide-react";
import PathCard from "@/components/PathCard";
import OnboardingForm from "@/components/OnboardingForm";
import Dashboard from "@/components/Dashboard";

type AppState = "home" | "onboarding" | "dashboard";

const Index = () => {
  const [state, setState] = useState<AppState>("home");
  const [path, setPath] = useState<"new" | "continue">("new");
  const [userData, setUserData] = useState<{ country: string; age: string; sex: string } | null>(null);

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
    <div className="flex min-h-screen flex-col bg-background px-5 pb-8 pt-12">
      {/* Logo & Brand */}
      <div className="mb-10">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <MapPin className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          migr<span className="text-primary">AI</span>
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Tu guía inteligente para navegar el proceso migratorio, paso a paso.
        </p>
      </div>

      {/* Path selection */}
      <div className="flex flex-col gap-4">
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

      {/* Footer */}
      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        migrAI no reemplaza asesoría legal profesional.
      </p>
    </div>
  );
};

export default Index;
