import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameCard, { GameCardProps } from "./GameCard";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";

interface GameCarouselProps {
  title: string;
  games: GameCardProps[];
  className?: string;
  categoryId?: string;
}

const GameCarousel = ({ title, games, className, categoryId }: GameCarouselProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleSeeAll = () => {
    if (categoryId) {
      navigate(`/games/${categoryId}`);
    }
  };

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-5">
        <h2 className="font-display font-bold text-xl text-foreground">{title}</h2>
        <button 
          onClick={handleSeeAll}
          className="flex items-center gap-1 text-primary font-semibold text-sm hover:opacity-80 transition-all duration-200 active:scale-95 px-2 py-1 -mr-2 rounded-lg hover:bg-primary/5"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Cards */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-5 pb-2">
          {games.map((game) => (
            <GameCard
              key={game.id}
              {...game}
              isFavorite={isFavorite(game.id)}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameCarousel;
