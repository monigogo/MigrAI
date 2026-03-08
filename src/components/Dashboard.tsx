import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, X, ChevronRight } from "lucide-react";

interface DashboardProps {
  userData: { country: string; age: string; sex: string };
  path: "new" | "continue";
  onBack: () => void;
}

const COUNTRY_CODES: Record<string, string> = {
  "Argentina": "ar", "Bolivia": "bo", "Brasil": "br", "Chile": "cl",
  "Colombia": "co", "Costa Rica": "cr", "Cuba": "cu", "Ecuador": "ec",
  "El Salvador": "sv", "Guatemala": "gt", "Honduras": "hn", "México": "mx",
  "Nicaragua": "ni", "Panamá": "pa", "Paraguay": "py", "Perú": "pe",
  "Portugal": "pt", "República Dominicana": "do", "Uruguay": "uy", "Venezuela": "ve",
};

interface CountryTheme {
  gradient: string;
  accent: string;
  accentBg: string;
  greeting: string;
  emoji: string;
  culturalIcon: string;
  motto: string;
  headerBg: string;
  buttonBg: string;
  chatBubble: string;
}

const COUNTRY_THEMES: Record<string, CountryTheme> = {
  "Argentina": { gradient: "from-sky-400 to-sky-600", accent: "text-sky-600", accentBg: "bg-sky-500/10", greeting: "¡Che, bienvenido/a!", emoji: "🧉", culturalIcon: "⚽", motto: "En unión y libertad", headerBg: "from-sky-400/90 to-sky-500/90", buttonBg: "bg-sky-500", chatBubble: "border-sky-300/40" },
  "Bolivia": { gradient: "from-red-500 via-yellow-400 to-green-600", accent: "text-green-600", accentBg: "bg-green-500/10", greeting: "¡Bienvenido/a, hermano/a!", emoji: "🪈", culturalIcon: "🏔️", motto: "La unión es la fuerza", headerBg: "from-red-500/80 via-yellow-400/80 to-green-600/80", buttonBg: "bg-green-600", chatBubble: "border-yellow-400/40" },
  "Brasil": { gradient: "from-green-500 to-yellow-400", accent: "text-green-600", accentBg: "bg-green-500/10", greeting: "Bem-vindo/a!", emoji: "🎶", culturalIcon: "🥁", motto: "Ordem e Progresso", headerBg: "from-green-500/90 to-yellow-400/90", buttonBg: "bg-green-500", chatBubble: "border-green-400/40" },
  "Chile": { gradient: "from-red-600 to-blue-700", accent: "text-red-600", accentBg: "bg-red-500/10", greeting: "¡Bienvenido/a, compadre!", emoji: "🍇", culturalIcon: "🏔️", motto: "Por la razón o la fuerza", headerBg: "from-red-600/90 to-blue-700/90", buttonBg: "bg-red-600", chatBubble: "border-red-300/40" },
  "Colombia": { gradient: "from-yellow-400 via-blue-600 to-red-600", accent: "text-yellow-600", accentBg: "bg-yellow-400/15", greeting: "¡Bienvenido/a, parcero/a!", emoji: "☕", culturalIcon: "🌺", motto: "Libertad y Orden", headerBg: "from-yellow-400/90 via-blue-600/90 to-red-600/90", buttonBg: "bg-yellow-500", chatBubble: "border-yellow-400/40" },
  "Costa Rica": { gradient: "from-blue-600 via-red-500 to-blue-600", accent: "text-blue-600", accentBg: "bg-blue-500/10", greeting: "¡Pura vida!", emoji: "🦜", culturalIcon: "🌴", motto: "Pura vida", headerBg: "from-blue-600/90 via-red-500/90 to-blue-600/90", buttonBg: "bg-blue-600", chatBubble: "border-blue-300/40" },
  "Cuba": { gradient: "from-blue-600 via-red-600 to-blue-600", accent: "text-red-600", accentBg: "bg-red-500/10", greeting: "¡Bienvenido/a, compa!", emoji: "🎺", culturalIcon: "🚗", motto: "Patria o Muerte", headerBg: "from-blue-600/90 to-red-600/90", buttonBg: "bg-red-600", chatBubble: "border-blue-300/40" },
  "Ecuador": { gradient: "from-yellow-400 via-blue-600 to-red-600", accent: "text-yellow-600", accentBg: "bg-yellow-400/15", greeting: "¡Bienvenido/a!", emoji: "🌋", culturalIcon: "🎭", motto: "Dios, Patria y Libertad", headerBg: "from-yellow-400/90 via-blue-600/90 to-red-600/90", buttonBg: "bg-yellow-500", chatBubble: "border-yellow-400/40" },
  "El Salvador": { gradient: "from-blue-600 to-blue-700", accent: "text-blue-600", accentBg: "bg-blue-500/10", greeting: "¡Bienvenido/a, cipote/a!", emoji: "🌽", culturalIcon: "🌄", motto: "Dios, Unión, Libertad", headerBg: "from-blue-600/90 to-blue-700/90", buttonBg: "bg-blue-600", chatBubble: "border-blue-300/40" },
  "Guatemala": { gradient: "from-sky-500 to-sky-600", accent: "text-sky-600", accentBg: "bg-sky-500/10", greeting: "¡Bienvenido/a, mano/a!", emoji: "🦅", culturalIcon: "🌽", motto: "Libertad", headerBg: "from-sky-500/90 to-sky-600/90", buttonBg: "bg-sky-500", chatBubble: "border-sky-300/40" },
  "Honduras": { gradient: "from-blue-600 to-blue-700", accent: "text-blue-600", accentBg: "bg-blue-500/10", greeting: "¡Bienvenido/a, catracho/a!", emoji: "🦜", culturalIcon: "🏝️", motto: "Libre, Soberana e Independiente", headerBg: "from-blue-600/90 to-blue-700/90", buttonBg: "bg-blue-600", chatBubble: "border-blue-300/40" },
  "México": { gradient: "from-green-600 via-red-600 to-green-600", accent: "text-green-700", accentBg: "bg-green-500/10", greeting: "¡Bienvenido/a, compa!", emoji: "🌮", culturalIcon: "🎸", motto: "Viva México", headerBg: "from-green-600/90 to-red-600/90", buttonBg: "bg-green-600", chatBubble: "border-green-300/40" },
  "Nicaragua": { gradient: "from-blue-600 to-blue-700", accent: "text-blue-600", accentBg: "bg-blue-500/10", greeting: "¡Bienvenido/a, hermano/a!", emoji: "🌋", culturalIcon: "🏖️", motto: "En Dios confiamos", headerBg: "from-blue-600/90 to-blue-700/90", buttonBg: "bg-blue-600", chatBubble: "border-blue-300/40" },
  "Panamá": { gradient: "from-red-500 to-blue-600", accent: "text-red-500", accentBg: "bg-red-500/10", greeting: "¡Bienvenido/a, fren!", emoji: "🚢", culturalIcon: "🌴", motto: "Pro Mundi Beneficio", headerBg: "from-red-500/90 to-blue-600/90", buttonBg: "bg-red-500", chatBubble: "border-red-300/40" },
  "Paraguay": { gradient: "from-red-600 to-blue-600", accent: "text-red-600", accentBg: "bg-red-500/10", greeting: "¡Bienvenido/a!", emoji: "🧉", culturalIcon: "🎶", motto: "Paz y justicia", headerBg: "from-red-600/90 to-blue-600/90", buttonBg: "bg-red-600", chatBubble: "border-red-300/40" },
  "Perú": { gradient: "from-red-600 to-red-700", accent: "text-red-600", accentBg: "bg-red-500/10", greeting: "¡Bienvenido/a, causa!", emoji: "🦙", culturalIcon: "🏔️", motto: "Firme y feliz por la unión", headerBg: "from-red-600/90 to-red-700/90", buttonBg: "bg-red-600", chatBubble: "border-red-300/40" },
  "Portugal": { gradient: "from-green-600 to-red-600", accent: "text-green-600", accentBg: "bg-green-500/10", greeting: "Bem-vindo/a!", emoji: "⚓", culturalIcon: "🎸", motto: "Esta é a ditosa pátria", headerBg: "from-green-600/90 to-red-600/90", buttonBg: "bg-green-600", chatBubble: "border-green-300/40" },
  "República Dominicana": { gradient: "from-red-600 via-blue-700 to-red-600", accent: "text-red-600", accentBg: "bg-red-500/10", greeting: "¡Bienvenido/a, manito/a!", emoji: "🏝️", culturalIcon: "🥁", motto: "Dios, Patria, Libertad", headerBg: "from-red-600/90 to-blue-700/90", buttonBg: "bg-red-600", chatBubble: "border-red-300/40" },
  "Uruguay": { gradient: "from-blue-500 to-blue-600", accent: "text-blue-600", accentBg: "bg-blue-500/10", greeting: "¡Bienvenido/a, bo!", emoji: "🧉", culturalIcon: "⚽", motto: "Libertad o Muerte", headerBg: "from-blue-500/90 to-blue-600/90", buttonBg: "bg-blue-500", chatBubble: "border-blue-300/40" },
  "Venezuela": { gradient: "from-yellow-400 via-blue-600 to-red-600", accent: "text-yellow-600", accentBg: "bg-yellow-400/15", greeting: "¡Bienvenido/a, pana!", emoji: "🫓", culturalIcon: "🎶", motto: "Dios y Federación", headerBg: "from-yellow-400/90 via-blue-600/90 to-red-600/90", buttonBg: "bg-yellow-500", chatBubble: "border-yellow-400/40" },
};

const DEFAULT_THEME: CountryTheme = {
  gradient: "from-primary to-primary/70", accent: "text-primary", accentBg: "bg-primary/10", greeting: "¡Bienvenido/a!", emoji: "🌍", culturalIcon: "✨", motto: "Tu camino empieza aquí", headerBg: "from-primary/90 to-primary/70", buttonBg: "bg-primary", chatBubble: "border-primary/30",
};

const BotAvatar = ({ country, size = "sm" }: { country: string; size?: "sm" | "md" }) => {
  const code = COUNTRY_CODES[country];
  const dim = size === "md" ? "h-11 w-11" : "h-8 w-8";
  const imgDim = size === "md" ? "w-6 h-4" : "w-5 h-3.5";
  return (
    <div className={`flex ${dim} shrink-0 items-center justify-center rounded-2xl bg-primary/10 relative`}>
      <span className={size === "md" ? "text-xl" : "text-sm"}>🤖</span>
      {code && (
        <img
          src={`https://flagcdn.com/w40/${code}.png`}
          alt={country}
          className={`absolute -bottom-1 -right-1 ${imgDim} rounded-sm object-cover border-2 border-background shadow-sm`}
        />
      )}
    </div>
  );
};

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

  const theme = COUNTRY_THEMES[userData.country] || DEFAULT_THEME;
  const code = COUNTRY_CODES[userData.country];

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

  const greeting = path === "new" ? theme.greeting + " 🎉" : "¡Sigamos avanzando! 💪";
  const subtitle = path === "new"
    ? `Te ayudaremos paso a paso. ${theme.motto}.`
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
      <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
        {/* Country flag watermark */}
        {code && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              src={`https://flagcdn.com/w320/${code}.png`}
              alt=""
              className="w-80 h-80 object-contain opacity-[0.04]"
            />
          </div>
        )}

        {/* Chat header with country gradient */}
        <header className={`sticky top-0 z-10 flex items-center justify-between border-b bg-gradient-to-r ${theme.headerBg} backdrop-blur-md px-6 py-4`}>
          <div className="flex items-center gap-3">
            <BotAvatar country={userData.country} size="md" />
            <div>
              <p className="font-heading text-base font-bold text-white">migrAI</p>
              <p className="text-xs text-white/70">Asistente virtual • Siempre disponible</p>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 transition-colors active:scale-95"
            aria-label="Cerrar chat"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </header>

        {/* Intro banner */}
        <div className={`mx-6 mt-4 rounded-2xl ${theme.accentBg} border ${theme.chatBubble} p-4 text-sm text-foreground relative z-[1]`}>
          💡 <strong>Consejo:</strong> Puedes tocar una de las preguntas de abajo, o escribir la tuya.
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative z-[1]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="mr-2 mt-1">
                  <BotAvatar country={userData.country} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-base whitespace-pre-line leading-relaxed ${
                  msg.role === "user"
                    ? `${theme.buttonBg} text-white rounded-br-md`
                    : `bg-card border ${theme.chatBubble} text-foreground rounded-bl-md`
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start items-center gap-2">
              <BotAvatar country={userData.country} />
              <div className={`rounded-2xl rounded-bl-md bg-card border ${theme.chatBubble} px-4 py-3 text-base text-muted-foreground`}>
                <span className="animate-pulse">migrAI está escribiendo…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick question buttons */}
        <div className="px-6 pb-2 relative z-[1]">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Preguntas rápidas:</p>
          <div className="flex flex-col gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                className={`rounded-2xl border ${theme.chatBubble} bg-card px-4 py-3 text-sm font-medium text-foreground text-left hover:shadow-md transition-all active:scale-[0.98]`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur-md px-6 py-4 relative z-[1]">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Escribe tu pregunta aquí…"
              className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.buttonBg} text-white shadow-sm disabled:opacity-40 transition-all active:scale-95`}
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
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Country flag watermark in dashboard too */}
      {code && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img
            src={`https://flagcdn.com/w320/${code}.png`}
            alt=""
            className="w-96 h-96 object-contain opacity-[0.03]"
          />
        </div>
      )}

      <div className="relative z-[1] px-6 pb-8 pt-6 flex flex-col flex-1">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Inicio</span>
        </button>

        {/* Profile badge with country gradient */}
        <div className={`mb-6 rounded-2xl bg-gradient-to-r ${theme.gradient} p-5 shadow-lg relative overflow-hidden`}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
          <div className="flex items-center gap-4 relative">
            {code && (
              <img
                src={`https://flagcdn.com/w80/${code}.png`}
                alt={userData.country}
                className="w-14 h-10 rounded-lg object-cover shadow-md border-2 border-white/30"
              />
            )}
            <div>
              <p className="font-heading font-bold text-white text-lg flex items-center gap-2">
                {userData.country} <span className="text-xl">{theme.emoji}</span>
              </p>
              <p className="text-sm text-white/75">{userData.age} · {userData.sex}</p>
            </div>
          </div>
        </div>

        {/* Greeting with cultural flair */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-3xl">{theme.culturalIcon}</span>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">{greeting}</h1>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">{subtitle}</p>

        {/* Action cards with country accent */}
        <div className="flex flex-col gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              className={`flex items-center gap-4 rounded-2xl border ${theme.chatBubble} bg-card p-5 text-left transition-all hover:shadow-lg active:scale-[0.98] shadow-sm`}
            >
              <div className={`w-12 h-12 rounded-2xl ${theme.accentBg} flex items-center justify-center shrink-0`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-heading font-bold text-foreground text-base`}>{action.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{action.desc}</p>
              </div>
              <ChevronRight className={`h-5 w-5 text-muted-foreground/50 shrink-0`} />
            </button>
          ))}
        </div>

        {/* AI Chat CTA with country color */}
        <div className="mt-auto pt-8">
          <p className="text-center text-sm text-muted-foreground mb-3">
            ¿Tienes alguna duda? Pregúntale a migrAI
          </p>
          <button
            onClick={() => setChatOpen(true)}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r ${theme.gradient} py-5 font-heading text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-transform`}
          >
            <span className="text-2xl">{theme.emoji}</span>
            Hablar con migrAI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
