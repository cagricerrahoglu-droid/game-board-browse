import { Users, Clock, Gauge, Star, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameCardProps } from "./GameCard";

const difficultyConfig = {
  Easy: { color: "text-available", bars: 1 },
  Medium: { color: "text-limited", bars: 2 },
  Hard: { color: "text-primary", bars: 3 },
};

const availabilityConfig = {
  available: { icon: Check, label: "Available", color: "text-available bg-available/10" },
  limited: { icon: AlertCircle, label: "Limited", color: "text-limited bg-limited/10" },
  unavailable: { icon: X, label: "Unavailable", color: "text-unavailable bg-unavailable/10" },
};

const HorizontalGameCard = ({
  title,
  imageUrl,
  players,
  duration,
  difficulty,
  rating,
  availability,
  pricePerDay,
  onClick,
}: GameCardProps) => {
  const StatusIcon = availabilityConfig[availability].icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-row bg-card rounded-xl overflow-hidden",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "w-full",
        "text-left"
      )}
    >
      {/* Cover Image */}
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/300x300/f5f0e8/e85d4c?text=${encodeURIComponent(title)}`;
          }}
        />
        {/* Availability Badge */}
        <div
          className={cn(
            "absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full",
            "text-xs font-semibold",
            availabilityConfig[availability].color
          )}
        >
          <StatusIcon className="w-3 h-3" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-1 p-3">
        <div className="flex flex-col gap-1.5">
          {/* Title */}
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 leading-tight">
            {title}
          </h3>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">{players}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{duration}</span>
            </div>
          </div>

          {/* Difficulty & Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Gauge className={cn("w-3.5 h-3.5", difficultyConfig[difficulty].color)} />
              <div className="flex gap-0.5">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      "w-1.5 h-3 rounded-full",
                      bar <= difficultyConfig[difficulty].bars
                        ? difficultyConfig[difficulty].color.replace("text-", "bg-")
                        : "bg-border"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-star text-star" />
              <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-1">
          <span className="text-primary font-bold text-sm">
            £{pricePerDay.toFixed(2)}
            <span className="text-muted-foreground font-normal text-xs">/day</span>
          </span>
        </div>
      </div>
    </button>
  );
};

export default HorizontalGameCard;
