import { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, FileText, MessageCircle, HelpCircle, Send, X } from "lucide-react";

interface DashboardProps {
  userData: { country: string; age: string; sex: string };
  path: "new" | "continue";
  onBack: () => void;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const exampleResponses: Record<string, string> = {
  default: "¡Hola! Soy migrAI, tu asistente virtual. Puedo ayudarte con información sobre trámites migratorios, documentos necesarios y próximos pasos. ¿En qué te puedo ayudar?",
  documentos: "📄 Los documentos básicos que necesitas son:\n\n• Pasaporte vigente\n• Acta de nacimiento apostillada\n• Antecedentes penales\n• Comprobante de domicilio\n• Fotografías tamaño pasaporte\n\n¿Necesitas más detalles sobre alguno?",
  pasos: "📋 Tus próximos pasos serían:\n\n1. Reunir documentos básicos\n2. Solicitar cita en la oficina de migración\n3. Completar formulario de solicitud\n4. Asistir a la entrevista\n5. Esperar resolución\n\n¿Te gustaría saber más sobre algún paso?",
  derechos: "⚖️ Como migrante tienes derecho a:\n\n• Acceso a servicios de salud de emergencia\n• Educación pública para tus hijos\n• Protección contra discriminación\n• Asesoría legal gratuita\n• No ser deportado sin debido proceso\n\n¿Quieres más información?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("documento") || lower.includes("papel")) return exampleResponses.documentos;
  if (lower.includes("paso") || lower.includes("siguiente") || lower.includes("proceso")) return exampleResponses.pasos;
  if (lower.includes("derecho")) return exampleResponses.derechos;
  return exampleResponses.default;
}

const Dashboard = ({ userData, path, onBack }: DashboardProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: exampleResponses.default },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getAIResponse(text) }]);
      setTyping(false);
    }, 1000);
  };

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

  // Chat panel
  if (chatOpen) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {/* Chat header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <MessageCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-foreground">migrAI</p>
              <p className="text-[11px] text-muted-foreground">Asistente virtual</p>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-3 text-sm text-muted-foreground">
                <span className="animate-pulse">migrAI está escribiendo…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
          {["¿Qué documentos necesito?", "¿Cuáles son mis derechos?", "¿Cuál es el siguiente paso?"].map((q) => (
            <button
              key={q}
              onClick={() => {
                setMessages((prev) => [...prev, { role: "user", content: q }]);
                setTyping(true);
                setTimeout(() => {
                  setMessages((prev) => [...prev, { role: "assistant", content: getAIResponse(q) }]);
                  setTyping(false);
                }, 1000);
              }}
              className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-primary/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta…"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            migrAI no reemplaza asesoría legal profesional.
          </p>
        </div>
      </div>
    );
  }

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

      {/* AI Chat button */}
      <div className="mt-auto pt-6">
        <button
          onClick={() => setChatOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-heading font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
        >
          <MessageCircle className="h-5 w-5" />
          Hablar con migrAI
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
