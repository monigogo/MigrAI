import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface PathCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "warm";
}

const PathCard = ({ icon, title, description, onClick, variant = "primary" }: PathCardProps) => {
  const bgClass = variant === "primary"
    ? "bg-card border-border hover:border-primary/40 hover:shadow-md"
    : "bg-card border-border hover:border-warm/40 hover:shadow-md";

  const iconBgClass = variant === "primary"
    ? "bg-primary/15 text-primary"
    : "bg-warm/15 text-warm";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 active:scale-[0.98] shadow-sm ${bgClass}`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgClass}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>
    </button>
  );
};

export default PathCard;
