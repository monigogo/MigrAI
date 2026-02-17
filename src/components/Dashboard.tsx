import { ArrowLeft, BookOpen, FileText, MessageCircle, HelpCircle } from "lucide-react";

interface DashboardProps {
  userData: { country: string; age: string; sex: string };
  path: "new" | "continue";
  onBack: () => void;
}

const Dashboard = ({ userData, path, onBack }: DashboardProps) => {
  const greeting = path === "new" ? "¡Bienvenido/a!" : "¡Sigamos avanzando!";
  const subtitle = path === "new"
    ? "Te ayudaremos paso a paso con tu proceso migratorio."
    : "Veamos cuál es tu siguiente paso.";

  const actions = path === "new"
    ? [
        { icon: <BookOpen className="h-5 w-5" />, title: "Guía básica", desc: "Aprende los fundamentos del proceso" },
        { icon: <FileText className="h-5 w-5" />, title: "Documentos necesarios", desc: "Lista de lo que vas a necesitar" },
        { icon: <HelpCircle className="h-5 w-5" />, title: "Preguntas frecuentes", desc: "Respuestas a dudas comunes" },
      ]
    : [
        { icon: <FileText className="h-5 w-5" />, title: "Mi siguiente paso", desc: "Descubre qué hacer ahora" },
        { icon: <MessageCircle className="h-5 w-5" />, title: "Consultar con IA", desc: "Pregunta sobre tu caso específico" },
        { icon: <BookOpen className="h-5 w-5" />, title: "Mis documentos", desc: "Revisa el estado de tus papeles" },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-background px-5 pb-8 pt-6">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm">Inicio</span>
      </button>

      {/* Profile badge */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-sm">
          {userData.country.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-sm">
          <p className="font-medium text-foreground">{userData.country}</p>
          <p className="text-muted-foreground">{userData.age} años · {userData.sex}</p>
        </div>
      </div>

      <h1 className="font-heading text-2xl font-bold text-foreground">{greeting}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <div className="mt-6 flex flex-col gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              {action.icon}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">{action.title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* AI Chat placeholder */}
      <div className="mt-auto pt-6">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-heading font-semibold text-primary-foreground">
          <MessageCircle className="h-5 w-5" />
          Hablar con migrAI
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
