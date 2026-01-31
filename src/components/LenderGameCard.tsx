import { useState } from "react";
import { Check, HelpCircle, Pause, Trash2, Tag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface LenderGame {
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

interface LenderGameCardProps {
  game: LenderGame;
  onToggleAvailability: (id: number, available: boolean) => void;
  onToggleSellAfterRent: (id: number, enabled: boolean) => void;
  onPause: (id: number) => void;
  onDelete: (id: number) => void;
}

const LenderGameCard = ({ game, onToggleAvailability, onToggleSellAfterRent, onPause, onDelete }: LenderGameCardProps) => {
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
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Row 1: Title + Status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-foreground truncate text-sm">{game.title}</h3>
            {getStatusBadge()}
          </div>

          {/* Row 2: Condition chips */}
          <div className="flex items-center gap-1.5 mb-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 capitalize">
              {game.condition}
            </Badge>
            {game.isComplete && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-secondary/10 text-secondary border-secondary/30">
                <Check className="h-2.5 w-2.5 mr-0.5" />
                Complete
              </Badge>
            )}
          </div>

          {/* Row 3: Price */}
          <p className="text-base font-semibold text-foreground mb-2">
            £{game.rentalPrice.toFixed(2)}
            <span className="text-xs text-muted-foreground font-normal">/mo</span>
          </p>

          {/* Row 4: Toggles & Actions */}
          <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/50">
            <div className="flex items-center gap-3">
              {/* Listed Toggle */}
              <label className="flex items-center gap-1 cursor-pointer">
                <Switch
                  checked={game.isAvailable}
                  onCheckedChange={(checked) => onToggleAvailability(game.id, checked)}
                  disabled={game.status === 'sold'}
                  className="scale-75"
                />
                <span className="text-[10px] text-muted-foreground">
                  {game.isAvailable ? 'Listed' : 'Unlisted'}
                </span>
              </label>

              {/* Sell Toggle */}
              <label className="flex items-center gap-1 cursor-pointer">
                <Switch
                  checked={game.sellAfterRent}
                  onCheckedChange={(checked) => onToggleSellAfterRent(game.id, checked)}
                  disabled={game.status === 'sold' || !game.isAvailable}
                  className="scale-75"
                />
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Tag className="h-2.5 w-2.5 text-accent" />
                  Sell
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onPause(game.id)}>
                <Pause className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => onDelete(game.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LenderGameCard;
