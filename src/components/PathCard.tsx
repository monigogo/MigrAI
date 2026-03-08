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
    ? "bg-card border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5"
    : "bg-card border-border hover:border-warm/40 hover:shadow-lg hover:-translate-y-0.5";

  const iconBgClass = variant === "primary"
    ? "bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm border border-primary/10"
    : "bg-gradient-to-br from-warm/20 to-warm/5 text-warm shadow-sm border border-warm/10";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 active:scale-[0.98] shadow-sm group ${bgClass}`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${iconBgClass}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
      </div>
    </button>
  );
};

export default PathCard;
