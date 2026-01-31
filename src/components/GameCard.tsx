import { useState } from "react";
import { Users, Clock, Star, Check, X, AlertCircle, Heart } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";

export interface GameCardProps {
  id: string;
  title: string;
  imageUrl: string;
  players: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  rating: number;
  availability: "available" | "limited" | "unavailable";
  monthlyPrice: number;
  description: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onClick?: () => void;
}

const difficultyConfig = {
  Easy: { color: "text-available", bgColor: "bg-available", bars: 1 },
  Medium: { color: "text-limited", bgColor: "bg-limited", bars: 2 },
  Hard: { color: "text-primary", bgColor: "bg-primary", bars: 3 },
};

const availabilityConfig = {
  available: { icon: Check, label: "Available", color: "text-available bg-available/15" },
  limited: { icon: AlertCircle, label: "Limited", color: "text-limited bg-limited/15" },
  unavailable: { icon: X, label: "Unavailable", color: "text-unavailable bg-unavailable/15" },
};

const GameCard = ({
  id,
  title,
  imageUrl,
  players,
  duration,
  difficulty,
  rating,
  availability,
  monthlyPrice,
  description,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}: GameCardProps) => {
  const StatusIcon = availabilityConfig[availability].icon;
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex flex-col bg-card rounded-2xl overflow-hidden",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 active:scale-[0.98]",
        "w-[224px] flex-shrink-0",
        "text-left group"
      )}
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            "w-full h-full object-cover object-top transition-transform duration-500",
            "group-hover:scale-105"
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/300x400/f5f0e8/e85d4c?text=${encodeURIComponent(title)}`;
          }}
        />
        {/* Gradient overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
        
        {/* Favorite Button */}
        <div
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2.5 left-2.5 p-2 rounded-full",
            "transition-all duration-300 ease-out",
            "bg-card/90 backdrop-blur-sm shadow-soft",
            "hover:scale-110 active:scale-90",
            isHovered || isFavorite ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-200",
              isFavorite ? "fill-primary text-primary scale-110" : "text-foreground hover:text-primary"
            )}
          />
        </div>
        
        {/* Availability Badge */}
        <div
          className={cn(
            "absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full",
            "text-xs font-bold backdrop-blur-sm",
            availabilityConfig[availability].color
          )}
        >
          <StatusIcon className="w-3 h-3" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-2 p-3.5">
        {/* Title */}
        <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description.substring(0, 60)}...
          <span className="text-primary font-medium ml-1">More</span>
        </p>

        {/* Metadata Row */}
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{players}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{formatDuration(duration)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={cn(
                    "w-1.5 h-3.5 rounded-full transition-colors",
                    bar <= difficultyConfig[difficulty].bars
                      ? difficultyConfig[difficulty].bgColor
                      : "bg-border"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 bg-star/10 px-1.5 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-star text-star" />
              <span className="text-xs font-bold text-foreground">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-border/50">
          <span className="text-primary font-bold text-base">
            £{monthlyPrice.toFixed(2)}
            <span className="text-muted-foreground font-medium text-xs ml-0.5">/mo</span>
          </span>
        </div>
      </div>
    </button>
  );
};

export default GameCard;
