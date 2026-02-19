import { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, FileText, MessageCircle, HelpCircle, Send, X, ChevronRight } from "lucide-react";

interface DashboardProps {
  userData: { country: string; age: string; sex: string };
  path: "new" | "continue";
  onBack: () => void;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const exampleResponses: Record<string, string> = {
  default: "¡Hola! Soy migrAI 👋\n\nEstoy aquí para ayudarte con tu proceso migratorio. Puedes preguntarme sobre documentos, tus derechos o los pasos que debes seguir.\n\n¿Con qué te puedo ayudar hoy?",
  documentos: "📄 Los documentos que generalmente necesitas son:\n\n✅ Pasaporte vigente\n✅ Acta de nacimiento (apostillada)\n✅ Antecedentes penales\n✅ Comprobante de domicilio\n✅ Fotos tamaño pasaporte\n\n¿Quieres saber más sobre alguno de estos?",
  pasos: "📋 Estos son tus próximos pasos:\n\n1️⃣ Reunir tus documentos\n2️⃣ Pedir una cita en la oficina de migración\n3️⃣ Llenar el formulario de solicitud\n4️⃣ Asistir a tu entrevista\n5️⃣ Esperar la respuesta\n\n¿Te explico con más detalle algún paso?",
  derechos: "⚖️ Como migrante tienes derechos importantes:\n\n✅ Atención médica de emergencia\n✅ Educación pública para tus hijos\n✅ Protección contra discriminación\n✅ Asesoría legal gratuita\n✅ No pueden deportarte sin un proceso legal\n\n¿Necesitas más información?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("documento") || lower.includes("papel")) return exampleResponses.documentos;
  if (lower.includes("paso") || lower.includes("siguiente") || lower.includes("proceso")) return exampleResponses.pasos;
  if (lower.includes("derecho")) return exampleResponses.derechos;
  return exampleResponses.default;
}

const quickQuestions = [
  { label: "📄 ¿Qué documentos necesito?", text: "¿Qué documentos necesito?" },
  { label: "⚖️ ¿Cuáles son mis derechos?", text: "¿Cuáles son mis derechos?" },
  { label: "📋 ¿Cuál es el siguiente paso?", text: "¿Cuál es el siguiente paso?" },
];

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

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getAIResponse(text) }]);
      setTyping(false);
    }, 1000);
  };

  const greeting = path === "new" ? "¡Bienvenido/a! 🎉" : "¡Sigamos avanzando! 💪";
  const subtitle = path === "new"
    ? "Te ayudaremos paso a paso. No tienes que saber nada de antemano."
    : "Veamos cuál es tu próximo paso.";

  const actions = path === "new"
    ? [
        { icon: "📖", title: "Guía paso a paso", desc: "Empieza desde cero. Te explicamos todo." },
        { icon: "📄", title: "Documentos que necesitas", desc: "Lista clara de lo que tienes que reunir." },
        { icon: "❓", title: "Preguntas frecuentes", desc: "Las dudas más comunes, explicadas fácil." },
      ]
    : [
        { icon: "➡️", title: "Mi siguiente paso", desc: "Descubre qué tienes que hacer ahora." },
        { icon: "🤖", title: "Preguntarle a migrAI", desc: "Escríbele sobre tu caso específico." },
        { icon: "📄", title: "Mis documentos", desc: "Revisa qué papeles tienes y cuáles faltan." },
      ];

  // ─── CHAT VIEW ───────────────────────────────────────────────────
  if (chatOpen) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {/* Chat header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shadow-sm">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <p className="font-heading text-base font-bold text-foreground">migrAI</p>
              <p className="text-xs text-muted-foreground">Asistente virtual • Siempre disponible</p>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-accent transition-colors active:scale-95"
            aria-label="Cerrar chat"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </header>

        {/* Intro banner */}
        <div className="mx-4 mt-4 rounded-2xl bg-primary/10 border border-primary/20 p-4 text-sm text-foreground">
          💡 <strong>Consejo:</strong> Puedes tocar una de las preguntas de abajo, o escribir la tuya.
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm">🤖</span>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-base whitespace-pre-line leading-relaxed ${
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
            <div className="flex justify-start items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm">🤖</span>
              </div>
              <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-3 text-base text-muted-foreground">
                <span className="animate-pulse">migrAI está escribiendo…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick question buttons */}
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Preguntas rápidas:</p>
          <div className="flex flex-col gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground text-left hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-[0.98]"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur-md px-4 py-4">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Escribe tu pregunta aquí…"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm disabled:opacity-40 transition-all active:scale-95"
              aria-label="Enviar mensaje"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            🔒 migrAI no reemplaza a un abogado. Consulta siempre con un profesional.
          </p>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW ──────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background px-5 pb-8 pt-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground active:scale-95 transition-transform"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-base font-medium">Inicio</span>
      </button>

      {/* Profile badge */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
          🧑
        </div>
        <div>
          <p className="font-heading font-bold text-foreground text-base">{userData.country}</p>
          <p className="text-sm text-muted-foreground">{userData.age} años · {userData.sex}</p>
        </div>
      </div>

      {/* Greeting */}
      <h1 className="font-heading text-2xl font-bold text-foreground">{greeting}</h1>
      <p className="mt-1 text-base text-muted-foreground leading-relaxed">{subtitle}</p>

      {/* Action cards */}
      <div className="mt-6 flex flex-col gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 active:scale-[0.98] shadow-sm"
          >
            <span className="text-3xl">{action.icon}</span>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-foreground text-base">{action.title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{action.desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      {/* AI Chat CTA - muy visible */}
      <div className="mt-auto pt-8">
        <p className="text-center text-sm text-muted-foreground mb-3">
          ¿Tienes alguna duda? Pregúntale a migrAI
        </p>
        <button
          onClick={() => setChatOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 font-heading text-lg font-bold text-primary-foreground shadow-md active:scale-[0.98] transition-transform"
        >
          <span className="text-2xl">🤖</span>
          Hablar con migrAI
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
