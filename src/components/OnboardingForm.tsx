import { useState } from "react";
import { ArrowRight, ArrowLeft, Globe, Calendar, User } from "lucide-react";

const COUNTRIES = [
  "Venezuela", "Colombia", "Ecuador", "Perú", "Honduras",
  "Guatemala", "El Salvador", "Cuba", "Haití", "México",
  "Nicaragua", "Brasil", "Argentina", "República Dominicana", "Otro"
];

const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56+"];
const SEX_OPTIONS = [
  { value: "masculino", label: "Masculino", emoji: "👨" },
  { value: "femenino", label: "Femenino", emoji: "👩" },
  { value: "otro", label: "Prefiero no decir", emoji: "🙂" },
];

interface OnboardingFormProps {
  onComplete: (data: { country: string; age: string; sex: string }) => void;
  onBack: () => void;
}

const steps = [
  {
    icon: <Globe className="h-7 w-7" />,
    emoji: "🌎",
    title: "¿De qué país eres?",
    subtitle: "Esto nos ayuda a darte la información correcta para tu país.",
  },
  {
    icon: <Calendar className="h-7 w-7" />,
    emoji: "🎂",
    title: "¿Cuántos años tienes?",
    subtitle: "Algunos trámites cambian según la edad.",
  },
  {
    icon: <User className="h-7 w-7" />,
    emoji: "🙋",
    title: "¿Cuál es tu sexo?",
    subtitle: "Para personalizar tu experiencia.",
  },
];

const stepLabels = ["País", "Edad", "Sexo"];

const OnboardingForm = ({ onComplete, onBack }: OnboardingFormProps) => {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

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
      {/* Back button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground active:scale-95 transition-transform"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-base font-medium">Atrás</span>
      </button>

      {/* Progress steps - labeled */}
      <div className="mb-8">
        <div className="flex gap-2 mb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between px-0.5">
          {stepLabels.map((label, i) => (
            <span
              key={i}
              className={`text-xs font-medium transition-colors ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          Paso {step + 1} de 3
        </p>
      </div>

      {/* Step header */}
      <div className="mb-6">
        <span className="text-4xl">{steps[step].emoji}</span>
        <h2 className="mt-3 font-heading text-2xl font-bold text-foreground">
          {steps[step].title}
        </h2>
        <p className="mt-1 text-base text-muted-foreground leading-relaxed">
          {steps[step].subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="flex-1 flex flex-col gap-3">
        {step === 0 &&
          COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all active:scale-[0.98] ${
                country === c
                  ? "border-primary bg-primary/10 text-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {country === c ? "✅ " : ""}{c}
            </button>
          ))}

        {step === 1 &&
          AGE_RANGES.map((a) => (
            <button
              key={a}
              onClick={() => setAge(a)}
              className={`rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all active:scale-[0.98] ${
                age === a
                  ? "border-primary bg-primary/10 text-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {age === a ? "✅ " : ""}{a} años
            </button>
          ))}

        {step === 2 &&
          SEX_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSex(s.value)}
              className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all active:scale-[0.98] ${
                sex === s.value
                  ? "border-primary bg-primary/10 text-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span>{sex === s.value ? "✅ " : ""}{s.label}</span>
            </button>
          ))}
      </div>

      {/* Continue button - grande y visible */}
      <button
        onClick={handleNext}
        disabled={!canContinue}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 font-heading text-lg font-bold text-primary-foreground shadow-md transition-all disabled:opacity-40 active:scale-[0.98]"
      >
        {step === 2 ? "✅ ¡Listo! Empezar" : "Continuar"}
        {step < 2 && <ArrowRight className="h-5 w-5" />}
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Tus datos son privados y no se comparten con nadie.
      </p>
    </div>
  );
};

export default OnboardingForm;
