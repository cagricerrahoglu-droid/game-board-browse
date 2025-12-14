import { useState } from "react";
import { Check, Pause, Pencil, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ListerGame {
  id: number;
  title: string;
  image: string;
  condition: "excellent" | "good" | "fair";
  isComplete: boolean;
  hasManual: boolean;
  isAvailable: boolean;
  status: "available" | "rented" | "sold" | "paused";
  rentalPrice: number;
  sellAfterRent: boolean;
  sellPrice?: number;
}

interface ListerGameCardProps {
  game: ListerGame;
  onToggleAvailability: (id: number, available: boolean) => void;
  onToggleSellAfterRent: (id: number, enabled: boolean) => void;
  onEdit: (id: number) => void;
  onPause: (id: number) => void;
}

const ListerGameCard = ({ game, onToggleAvailability, onToggleSellAfterRent, onEdit, onPause }: ListerGameCardProps) => {
  const getStatusBadge = () => {
    switch (game.status) {
      case "available":
        return <Badge className="bg-secondary/20 text-secondary border-secondary/30">Available</Badge>;
      case "rented":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Rented</Badge>;
      case "sold":
        return <Badge className="bg-accent/20 text-accent border-accent/30">Sold</Badge>;
      case "paused":
        return <Badge variant="outline" className="text-muted-foreground">Paused</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-[var(--card-shadow)] border border-border/50 transition-all hover:shadow-[var(--card-shadow-hover)]">
      <div className="flex gap-4">
        {/* Game Image */}
        <div className="relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0">
          <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          {game.sellAfterRent && (
            <div className="absolute top-1 right-1 bg-accent text-accent-foreground p-1 rounded-full">
              <Tag className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate">{game.title}</h3>
            {getStatusBadge()}
          </div>

          {/* Condition Indicators */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${game.isComplete ? 'bg-secondary/20' : 'bg-muted'}`}>
                {game.isComplete && <Check className="h-3 w-3 text-secondary" />}
              </div>
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${game.condition === 'excellent' || game.condition === 'good' ? 'bg-secondary/20' : 'bg-muted'}`}>
                {(game.condition === 'excellent' || game.condition === 'good') && <Check className="h-3 w-3 text-secondary" />}
              </div>
              <span className="capitalize">{game.condition}</span>
            </div>
          </div>

          {/* Price */}
          <p className="text-sm text-foreground font-medium mb-3">
            £{game.rentalPrice.toFixed(2)}<span className="text-muted-foreground font-normal">/mo</span>
          </p>

          {/* Actions Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={game.isAvailable}
                onCheckedChange={(checked) => onToggleAvailability(game.id, checked)}
                disabled={game.status === 'sold'}
              />
              <span className="text-xs text-muted-foreground">
                {game.isAvailable ? 'Listed' : 'Unlisted'}
              </span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(game.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPause(game.id)}>
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sell After Rent Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs text-muted-foreground">Open to sell</span>
            </div>
            <Switch
              checked={game.sellAfterRent}
              onCheckedChange={(checked) => onToggleSellAfterRent(game.id, checked)}
              disabled={game.status === 'sold'}
              className="scale-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListerGameCard;
