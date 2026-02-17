import { useState } from "react";
import { ArrowRight, ArrowLeft, Globe, Calendar, User } from "lucide-react";

const COUNTRIES = [
  "Venezuela", "Colombia", "Ecuador", "Perú", "Honduras",
  "Guatemala", "El Salvador", "Cuba", "Haití", "México",
  "Nicaragua", "Brasil", "Argentina", "República Dominicana", "Otro"
];

const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56+"];
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

  const steps = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "¿De qué país eres?",
      subtitle: "Esto nos ayuda a darte información relevante",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "¿Cuál es tu rango de edad?",
      subtitle: "Algunos procesos varían según la edad",
    },
    {
      icon: <User className="h-6 w-6" />,
      title: "¿Cuál es tu sexo?",
      subtitle: "Para personalizar tu experiencia",
    },
  ];

  const canContinue = step === 0 ? !!country : step === 1 ? !!age : !!sex;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete({ country, age, sex });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 pb-8 pt-6">
      {/* Header */}
      <button onClick={handleBack} className="mb-6 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm">Atrás</span>
      </button>

      {/* Progress */}
      <div className="mb-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          {steps[step].icon}
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
          {steps[step].title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{steps[step].subtitle}</p>

        <div className="mt-6 flex flex-col gap-2.5">
          {step === 0 &&
            COUNTRIES.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                  country === c
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                {c}
              </button>
            ))}

          {step === 1 &&
            AGE_RANGES.map((a) => (
              <button
                key={a}
                onClick={() => setAge(a)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                  age === a
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                {a} años
              </button>
            ))}

          {step === 2 &&
            SEX_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSex(s.value)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                  sex === s.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                {s.label}
              </button>
            ))}
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={handleNext}
        disabled={!canContinue}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-heading font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
      >
        {step === 2 ? "Completar" : "Continuar"}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default OnboardingForm;
