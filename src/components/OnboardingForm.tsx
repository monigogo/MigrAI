import { useState } from "react";
import { ArrowLeft, ArrowRight, Globe, Calendar } from "lucide-react";

const COUNTRIES: { name: string; flag: string }[] = [
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Brasil", flag: "🇧🇷" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Cuba", flag: "🇨🇺" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "El Salvador", flag: "🇸🇻" },
  { name: "España", flag: "🇪🇸" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Honduras", flag: "🇭🇳" },
  { name: "México", flag: "🇲🇽" },
  { name: "Nicaragua", flag: "🇳🇮" },
  { name: "Panamá", flag: "🇵🇦" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Perú", flag: "🇵🇪" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "República Dominicana", flag: "🇩🇴" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Otro", flag: "🌍" },
];

const AGE_RANGES = ["18-25 años", "26-35 años", "36-45 años", "46-55 años", "56+ años"];

const SEX_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Prefiero no decir" },
];

interface OnboardingFormProps {
  onComplete: (data: { country: string; age: string; sex: string }) => void;
  onBack: () => void;
}

const OnboardingForm = ({ onComplete, onBack }: OnboardingFormProps) => {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

  const canContinue = step === 0 ? !!country : !!age && !!sex;

  const handleNext = () => {
    if (step === 0) setStep(1);
    else onComplete({ country, age, sex });
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-primary text-sm font-semibold mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>

        {/* Progress bar */}
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {step === 0 && (
          <div>
            <div className="px-6 pt-4 pb-5">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground font-heading">¿De qué país eres?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Esto nos ayuda a darte información relevante
              </p>
            </div>

            <div className="mx-6 rounded-2xl border border-border bg-card overflow-hidden">
              {COUNTRIES.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`w-full text-left px-5 py-4 text-base transition-colors ${
                    i < COUNTRIES.length - 1 ? "border-b border-border" : ""
                  } ${
                    country === c
                      ? "text-primary font-bold bg-primary/10"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="px-6 pt-4 pb-5">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground font-heading">¿Cuál es tu rango de edad?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Algunos procesos varían según la edad
              </p>
            </div>

            <div className="mx-6 rounded-2xl border border-border bg-card overflow-hidden mb-8">
              {AGE_RANGES.map((a, i) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`w-full text-left px-5 py-4 text-base transition-colors ${
                    i < AGE_RANGES.length - 1 ? "border-b border-border" : ""
                  } ${
                    age === a
                      ? "text-primary font-bold bg-primary/10"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="px-6 pb-5">
              <h2 className="text-2xl font-extrabold text-foreground font-heading">¿Cuál es tu sexo?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Para personalizar tu experiencia
              </p>
            </div>

            <div className="mx-6 rounded-2xl border border-border bg-card overflow-hidden mb-8">
              {SEX_OPTIONS.map((s, i) => (
                <button
                  key={s.value}
                  onClick={() => setSex(s.value)}
                  className={`w-full text-left px-5 py-4 text-base transition-colors ${
                    i < SEX_OPTIONS.length - 1 ? "border-b border-border" : ""
                  } ${
                    sex === s.value
                      ? "text-primary font-bold bg-primary/10"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="p-6">
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-md disabled:opacity-40 transition-all active:scale-[0.98]"
        >
          {step === 1 ? "Completar" : "Continuar"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
