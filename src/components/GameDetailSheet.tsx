import { useState } from "react";
import { X, Users, Clock, Gauge, Star, Heart, Info, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GameCardProps } from "@/components/GameCard";
import { useBasket } from "@/contexts/BasketContext";
import { useFavorites } from "@/contexts/FavoritesContext";
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

const rentalOptions = [
  { days: 3, label: "3 days" },
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
];

const GameDetailSheet = ({ game, open, onOpenChange }: GameDetailSheetProps) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const { addToBasket, items } = useBasket();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!game) return null;

  const StatusIcon = availabilityConfig[game.availability].icon;
  const isInBasket = items.some((item) => item.id === game.id);
  const favorite = isFavorite(game.id);

  const totalPrice = selectedDuration ? game.pricePerDay * selectedDuration : 0;

  const handleAddToBasket = () => {
    if (!selectedDuration) return;
    addToBasket(game, selectedDuration);
    toast({
      title: "Added to basket!",
      description: `${game.title} for ${selectedDuration} days`,
    });
    onOpenChange(false);
    setSelectedDuration(null);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(game.id);
    toast({
      title: favorite ? "Removed from favourites" : "Added to favourites",
      description: game.title,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedDuration(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[85vh] rounded-t-3xl">
        {/* Hero Image Section */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/400x300/f5f0e8/e85d4c?text=${encodeURIComponent(game.title)}`;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Close Button */}
          <DrawerClose className="absolute top-4 right-4 p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-soft hover:bg-card transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </DrawerClose>

          {/* Availability Badge */}
          <div
            className={cn(
              "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "text-sm font-semibold backdrop-blur-sm",
              availabilityConfig[game.availability].color
            )}
          >
            <StatusIcon className="w-4 h-4" />
            <span>{availabilityConfig[game.availability].label}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32">
          {/* Game Overview */}
          <div className="py-4 space-y-4">
            {/* Title & Favorite */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
                {game.title}
              </h2>
              <button
                onClick={handleFavoriteToggle}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-200",
                  "hover:scale-110 active:scale-90",
                  favorite
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:text-primary"
                )}
              >
                <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
              </button>
            </div>

            {/* Icon Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{game.players}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{game.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg">
                <Gauge className={cn("w-4 h-4", difficultyConfig[game.difficulty].color)} />
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={cn(
                        "w-1.5 h-4 rounded-full",
                        bar <= difficultyConfig[game.difficulty].bars
                          ? difficultyConfig[game.difficulty].bgColor
                          : "bg-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-star/10 px-2.5 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-star text-star" />
                <span className="text-sm font-bold text-foreground">{game.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              A fantastic game perfect for game night! Gather your friends and family for hours of 
              fun and strategic gameplay. Easy to learn, hard to master.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 my-2" />

          {/* Rental Configuration */}
          <div className="py-4 space-y-4">
            <label className="text-sm font-semibold text-foreground">Rental duration</label>
            <div className="flex gap-2">
              {rentalOptions.map((option) => (
                <button
                  key={option.days}
                  onClick={() => setSelectedDuration(option.days)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                    "border-2",
                    selectedDuration === option.days
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">
                {selectedDuration ? (
                  <>£{totalPrice.toFixed(2)} <span className="text-sm font-medium text-muted-foreground">for {selectedDuration} days</span></>
                ) : (
                  <>£{game.pricePerDay.toFixed(2)} <span className="text-sm font-medium text-muted-foreground">/day</span></>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-available" />
              <span>Damage protection included</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] bg-card text-foreground border-border">
                    <p>Full coverage for accidental damage. No extra fees for normal wear and tear.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-xl border-t border-border/30 space-y-3">
          <Button
            onClick={handleAddToBasket}
            disabled={!selectedDuration || isInBasket || game.availability === "unavailable"}
            className="w-full h-14 text-base font-bold rounded-2xl"
          >
            {isInBasket ? "Already in basket" : game.availability === "unavailable" ? "Unavailable" : "Add to basket"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GameDetailSheet;
