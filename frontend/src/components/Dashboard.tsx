import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, X, ChevronRight } from "lucide-react";
import ResolucionFavorableTab from "@/components/ResolucionFavorableTab";
import { enviarPregunta, enviarPreguntaStream } from "@/services/api";

interface DashboardProps {
  userData: { country: string; age: string; sex: string };
  path: "new" | "continue";
  onBack: () => void;
  sesionId: string;
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

const Dashboard = ({ userData, path, onBack, sesionId }: DashboardProps) => {
  const theme = COUNTRY_THEMES[userData.country] || DEFAULT_THEME;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: exampleResponses.default },
  ]);
  const [input, setInput] = useState("");
  const [isResolucionOpen, setResolucionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const newMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
  setMessages([...newMessages, { role: "assistant", content: "" }]);
  const currentInput = input;
  setInput("");
  setIsLoading(true);

  await enviarPreguntaStream(
    { pregunta: currentInput, sesion_id: sesionId, pais: userData.country, rango_edad: userData.age },
    (token) => {
      setMessages(prev => {
        const actualizados = [...prev];
        actualizados[actualizados.length - 1] = {
          role:    "assistant",
          content: actualizados[actualizados.length - 1].content + token,
        };
        return actualizados;
      });
    },
    (_meta) => { setIsLoading(false); },
    (msg) => {
      setMessages(prev => {
        const actualizados = [...prev];
        actualizados[actualizados.length - 1] = { role: "assistant", content: msg };
        return actualizados;
      });
      setIsLoading(false);
    }
  );
};

const handleQuickQuestion = async (text: string) => {
  if (isLoading) return;

  const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
  setMessages([...newMessages, { role: "assistant", content: "" }]);
  setIsLoading(true);

  await enviarPreguntaStream(
    { pregunta: text, sesion_id: sesionId, pais: userData.country, rango_edad: userData.age },
    (token) => {
      setMessages(prev => {
        const actualizados = [...prev];
        actualizados[actualizados.length - 1] = {
          role:    "assistant",
          content: actualizados[actualizados.length - 1].content + token,
        };
        return actualizados;
      });
    },
    (_meta) => { setIsLoading(false); },
    (msg) => {
      setMessages(prev => {
        const actualizados = [...prev];
        actualizados[actualizados.length - 1] = { role: "assistant", content: msg };
        return actualizados;
      });
      setIsLoading(false);
    }
  );
};
  function setChatOpen(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl flex flex-col min-h-screen">
        
        {/* Header */}
        <header className={`sticky top-0 z-20 bg-gradient-to-b ${theme.headerBg} from-50% to-background/90 backdrop-blur-lg px-4 sm:px-6 pt-5 pb-3 border-b border-border/50`}>
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

        {/* Chat */}
        <main className="flex-1 flex flex-col px-4 sm:px-6 pt-4 pb-2 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && <BotAvatar country={userData.country} />}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${msg.role === 'user' ? `${theme.buttonBg} text-white` : `bg-card border ${theme.chatBubble}`}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <BotAvatar country={userData.country} />
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-card border">
                Escribiendo...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Footer / Input */}
        <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-lg px-4 sm:px-6 pt-3 pb-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta aquí…"
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.buttonBg} text-white shadow-sm disabled:opacity-40 transition-all active:scale-95`}
              aria-label="Enviar mensaje"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            🔒 migrAI no reemplaza a un abogado. Consulta siempre con un profesional.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
