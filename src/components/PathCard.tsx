import { ReactNode } from "react";

interface PathCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "warm";
}

const PathCard = ({ icon, title, description, onClick, variant = "primary" }: PathCardProps) => {
  const bgClass = variant === "primary"
    ? "bg-primary/10 border-primary/20 hover:border-primary/40 hover:bg-primary/15"
    : "bg-warm/10 border-warm/20 hover:border-warm/40 hover:bg-warm/15";

  const iconBgClass = variant === "primary" ? "bg-primary text-primary-foreground" : "bg-warm text-warm-foreground";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 active:scale-[0.98] ${bgClass}`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default PathCard;
