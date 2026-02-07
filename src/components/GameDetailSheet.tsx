import { X, Users, Clock, Star, Heart, Check, AlertCircle } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GameCardProps } from "@/components/GameCard";
import { useBasket } from "@/contexts/BasketContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useGameAvailability } from "@/hooks/useGameAvailability";
import { toast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameDetailSheetProps {
  game: GameCardProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const difficultyConfig = {
  Easy: { color: "text-available", bgColor: "bg-available", bars: 1, label: "Easy" },
  Medium: { color: "text-limited", bgColor: "bg-limited", bars: 2, label: "Medium" },
  Hard: { color: "text-primary", bgColor: "bg-primary", bars: 3, label: "Hard" },
};

const availabilityConfig = {
  available: { icon: Check, label: "Available", color: "text-available bg-available/15" },
  limited: { icon: AlertCircle, label: "Limited stock", color: "text-limited bg-limited/15" },
  unavailable: { icon: X, label: "Unavailable", color: "text-unavailable bg-unavailable/15" },
};

const GameDetailSheet = ({ game, open, onOpenChange }: GameDetailSheetProps) => {
  const { addToBasket, items } = useBasket();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Get the catalogGameId from the game object
  const catalogGameId = game?.catalogGameId || game?.id;
  
  // Check real-time availability from the games table
  const { available, availableCount, isLoading: checkingAvailability } = useGameAvailability(open ? catalogGameId : null);

  if (!game) return null;

  // Use title or name, whichever is available
  const displayTitle = game.title || game.name || 'Unknown Game';

  // Determine the actual availability status based on the real-time check
  const actualAvailability = checkingAvailability 
    ? "limited" 
    : available 
      ? availableCount > 3 ? "available" : "limited"
      : "unavailable";

  const StatusIcon = availabilityConfig[actualAvailability].icon;
  const isInBasket = items.some((item) => item.id === game.id);
  const favorite = isFavorite(game.id);

  const handleAddToBasket = () => {
    if (!available) {
      toast({
        title: "Game not available",
        description: "This game is currently not available for rent.",
        variant: "destructive",
      });
      return;
    }
    
    addToBasket(game);
    toast({
      title: "Added to basket!",
      description: `${displayTitle} - Monthly rental`,
    });
    onOpenChange(false);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(game.id);
    toast({
      title: favorite ? "Removed from favourites" : "Added to favourites",
      description: displayTitle,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] rounded-t-3xl">
        {/* Hero Image Section */}
        <div className="relative w-full h-32 overflow-hidden">
          <img
            src={game.imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/400x300/f5f0e8/e85d4c?text=${encodeURIComponent(displayTitle)}`;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Close Button */}
          <DrawerClose className="absolute top-3 right-3 p-1.5 rounded-full bg-card/90 backdrop-blur-sm shadow-soft hover:bg-card transition-colors">
            <X className="w-4 h-4 text-foreground" />
          </DrawerClose>

          {/* Availability Badge */}
          <div
            className={cn(
              "absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full",
              "text-xs font-semibold backdrop-blur-sm",
              availabilityConfig[actualAvailability].color
            )}
          >
            <StatusIcon className="w-3 h-3" />
            <span>
              {checkingAvailability 
                ? "Checking..." 
                : availabilityConfig[actualAvailability].label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 space-y-3">
          {/* Title & Favorite */}
          <div className="flex items-start justify-between gap-2 pt-2">
            <h2 className="font-display text-xl font-bold text-foreground leading-tight">
              {displayTitle}
            </h2>
            <button
              onClick={handleFavoriteToggle}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:scale-110 active:scale-90",
                favorite
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground hover:text-primary"
              )}
            >
              <Heart className={cn("w-4 h-4", favorite && "fill-current")} />
            </button>
          </div>

          {/* Icon Row */}
          <TooltipProvider delayDuration={200}>
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md cursor-help">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{game.players}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of players</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md cursor-help">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{formatDuration(game.duration)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average play time</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md cursor-help">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={cn(
                            "w-1 h-3 rounded-full",
                            bar <= difficultyConfig[game.difficulty].bars
                              ? difficultyConfig[game.difficulty].bgColor
                              : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Difficulty: {difficultyConfig[game.difficulty].label}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-star/10 px-2 py-1 rounded-md cursor-help">
                    <Star className="w-3 h-3 fill-star text-star" />
                    <span className="text-xs font-bold text-foreground">{game.rating.toFixed(1)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>User rating out of 5</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {game.description}
          </p>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-lg font-bold text-foreground">
                £{game.monthlyPrice.toFixed(2)} <span className="text-xs font-medium text-muted-foreground">/month</span>
              </span>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleAddToBasket}
            disabled={isInBasket || !available || checkingAvailability}
            className={cn(
              "w-full h-12 text-sm font-bold rounded-xl",
              (!available && !checkingAvailability) && "bg-muted-foreground text-white hover:bg-muted-foreground cursor-not-allowed"
            )}
          >
            {checkingAvailability 
              ? "Checking availability..." 
              : isInBasket 
                ? "Already in basket" 
                : !available 
                  ? `Unavailable (${availableCount} copies available)` 
                  : availableCount === 1
                    ? "Add to basket (Last copy!)"
                    : `Add to basket (${availableCount} available)`}
          </Button>
          
          {!available && !checkingAvailability && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              This game is currently not available for rent. Check back later!
            </p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GameDetailSheet;
