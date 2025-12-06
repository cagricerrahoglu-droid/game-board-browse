import { ChevronRight } from "lucide-react";
import GameCard, { GameCardProps } from "./GameCard";
import { cn } from "@/lib/utils";

interface GameCarouselProps {
  title: string;
  games: GameCardProps[];
  className?: string;
}

const GameCarousel = ({ title, games, className }: GameCarouselProps) => {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
        <button className="flex items-center gap-1 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Cards */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameCarousel;
