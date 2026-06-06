import { useState } from "react";
import { Users, Clock, Gauge, Star, Heart } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { GameCardProps } from "./GameCard";

const difficultyConfig = {
  Easy: { color: "text-available", bgColor: "bg-available", bars: 1 },
  Medium: { color: "text-limited", bgColor: "bg-limited", bars: 2 },
  Hard: { color: "text-primary", bgColor: "bg-primary", bars: 3 },
};

const HorizontalGameCard = ({
  id,
  title,
  imageUrl,
  players,
  duration,
  difficulty = "Medium",
  rating,
  monthlyPrice,
  description = "",
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyKey = (["Easy", "Medium", "Hard"] as const).includes(
    difficulty as "Easy" | "Medium" | "Hard"
  )
    ? (difficulty as "Easy" | "Medium" | "Hard")
    : "Medium";
  const diff = difficultyConfig[difficultyKey];

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
        "flex flex-row bg-card rounded-2xl overflow-hidden",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 active:scale-[0.99]",
        "w-full",
        "text-left group"
      )}
    >
      {/* Cover Image */}
      <div className="relative w-36 h-36 flex-shrink-0 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            "group-hover:scale-105"
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/300x300/f5f0e8/e85d4c?text=${encodeURIComponent(title)}`;
          }}
        />
        
        {/* Favorite Button */}
        <div
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full",
            "transition-all duration-300 ease-out",
            "bg-card/90 backdrop-blur-sm shadow-soft",
            "hover:scale-110 active:scale-90",
            isHovered || isFavorite ? "opacity-100" : "opacity-0"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-200",
              isFavorite ? "fill-primary text-primary" : "text-foreground hover:text-primary"
            )}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-1 p-3.5">
        <div className="flex flex-col gap-1">
          {/* Title */}
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-1">
            {description.substring(0, 50)}...
            <span className="text-primary font-medium ml-1">More</span>
          </p>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{players}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Difficulty & Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Gauge className={cn("w-3.5 h-3.5", diff.color)} />
              <div className="flex gap-0.5">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      "w-1.5 h-3 rounded-full transition-colors",
                      bar <= diff.bars ? diff.bgColor : "bg-border"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-star/10 px-1.5 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-star text-star" />
              <span className="text-xs font-bold text-foreground">{(rating ?? 0).toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-1">
          <span className="text-primary font-bold text-sm">
            £{(monthlyPrice ?? 0).toFixed(2)}
            <span className="text-muted-foreground font-medium text-xs ml-0.5">/mo</span>
          </span>
        </div>
      </div>
    </button>
  );
};

export default HorizontalGameCard;
