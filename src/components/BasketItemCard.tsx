import { Trash2, Info, CheckCircle, Clock, XCircle } from "lucide-react";
import { BasketItem } from "@/contexts/BasketContext";
import { cn } from "@/lib/utils";

interface BasketItemCardProps {
  item: BasketItem;
  onRemove: (id: string) => void;
}

const availabilityConfig = {
  available: { icon: CheckCircle, label: "In Stock", color: "text-emerald-600" },
  limited: { icon: Clock, label: "Limited", color: "text-amber-600" },
  unavailable: { icon: XCircle, label: "Unavailable", color: "text-destructive" },
};

const BasketItemCard = ({ item, onRemove }: BasketItemCardProps) => {
  const availability = availabilityConfig[item.availability];
  const AvailabilityIcon = availability.icon;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
      <div className="flex gap-4">
        {/* Game Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Game Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-foreground truncate">
              {item.title}
            </h3>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            Monthly rental
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className={cn("flex items-center gap-1 text-xs", availability.color)}>
              <AvailabilityIcon className="w-3.5 h-3.5" />
              <span>{availability.label}</span>
            </div>
            <p className="font-display font-bold text-foreground">
              £{item.monthlyPrice.toFixed(2)}/mo
            </p>
          </div>
        </div>
      </div>

      {/* Rental Policy Link */}
      <button className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline">
        <Info className="w-3.5 h-3.5" />
        <span>View rental policy</span>
      </button>
    </div>
  );
};

export default BasketItemCard;
