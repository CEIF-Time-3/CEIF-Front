import { Clock, Star, Utensils } from "lucide-react";
import type React from "react";

export interface HighlightItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const defaultHighlights: HighlightItem[] = [
  {
    icon: Clock,
    title: "Entrega Rápida",
    description: "30-45 min",
  },
  {
    icon: Star,
    title: "Nota 4.9/5",
    description: "+1.000 avaliações",
  },
  {
    icon: Utensils,
    title: "100% Artesanal",
    description: "Massa própria",
  },
];

interface HighlightBadgeListProps {
  items?: HighlightItem[];
  className?: string;
}

export function HighlightBadgeList({
  items = defaultHighlights,
  className = "",
}: HighlightBadgeListProps) {
  return (
    <div
      className={`border-border grid w-full grid-cols-3 gap-4 border-t pt-6 ${className}`}
    >
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <div key={item.title} className="flex items-center gap-2">
            <IconComponent className="text-primary size-5 shrink-0" />
            <div className="text-xs">
              <p className="text-foreground font-bold">{item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
