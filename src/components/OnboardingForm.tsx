import { useState } from "react";
import { ArrowLeft, ArrowRight, Globe, Calendar } from "lucide-react";

const COUNTRIES = [
  "Venezuela", "Colombia", "Ecuador", "Perú", "Honduras",
  "Guatemala", "El Salvador", "Cuba", "Haití", "México",
  "Nicaragua", "Brasil", "Argentina", "República Dominicana", "Otro"
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
  const [step, setStep] = useState(0); // 0 = país, 1 = edad + sexo
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

  const canContinue = step === 0 ? !!country : !!age && !!sex;

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      onComplete({ country, age, sex });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-2 shadow-sm">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-primary text-sm font-medium mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>

        {/* Progress bar */}
        <div className="flex gap-1.5">
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
        {/* Step 0: País */}
        {step === 0 && (
          <div>
            <div className="px-4 pt-5 pb-4">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">¿De qué país eres?</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Esto nos ayuda a darte información relevante
              </p>
            </div>

            <div className="bg-white divide-y divide-border border-y border-border">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`w-full text-left px-4 py-4 text-base transition-colors ${
                    country === c
                      ? "text-primary font-semibold bg-primary/5"
                      : "text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Edad + Sexo */}
        {step === 1 && (
          <div>
            {/* Edad */}
            <div className="px-4 pt-5 pb-4">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">¿Cuál es tu rango de edad?</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Algunos procesos varían según la edad
              </p>
            </div>

            <div className="bg-white divide-y divide-border border-y border-border mb-6">
              {AGE_RANGES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`w-full text-left px-4 py-4 text-base transition-colors ${
                    age === a
                      ? "text-primary font-semibold bg-primary/5"
                      : "text-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Sexo */}
            <div className="px-4 pb-4">
              <h2 className="text-xl font-bold text-foreground">¿Cuál es tu sexo?</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Para personalizar tu experiencia
              </p>
            </div>

            <div className="bg-white divide-y divide-border border-y border-border">
              {SEX_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSex(s.value)}
                  className={`w-full text-left px-4 py-4 text-base transition-colors ${
                    sex === s.value
                      ? "text-primary font-semibold bg-primary/5"
                      : "text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="h-6" />
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="bg-primary">
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="w-full flex items-center justify-center gap-2 py-5 text-lg font-semibold text-primary-foreground disabled:opacity-40 transition-opacity"
        >
          {step === 1 ? "Completar" : "Continuar"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
