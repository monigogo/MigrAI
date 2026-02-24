import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Input del chat con botón de envío.
 * Envía con Enter o con el botón.
 */
export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Escribe tu pregunta...",
}: ChatInputProps) {
  const canSend = value.trim().length > 0 && !disabled;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault();
      onSend();
    }
  }

  return (
      <div
      className ="flex items-center gap-3 px-4 py-3 border-t"
      style={{
        borderColor: "var(--color-border-light)",
        background: "rgba(240,246,251,0.97)",
        backdropFilter: "blur(8px)",
      }}
    >
      <input
        className="text-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-label="Mensaje al asistente"
      />

      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: canSend
            ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
            : "var(--color-border)",
          boxShadow: canSend ? "var(--shadow-blue)" : "none",
        }}
        aria-label="Enviar mensaje"
      >
        <Send size={18} color="white" />
      </button>
    </div>
  );
}
