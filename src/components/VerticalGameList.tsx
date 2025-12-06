import { GameCardProps } from "./GameCard";
import HorizontalGameCard from "./HorizontalGameCard";
import { useFavorites } from "@/contexts/FavoritesContext";

interface VerticalGameListProps {
  title: string;
  games: GameCardProps[];
}

const VerticalGameList = ({ title, games }: VerticalGameListProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <section className="flex flex-col gap-4 px-4 pb-24">
      <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
      <div className="flex flex-col gap-3">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <HorizontalGameCard
              {...game}
              isFavorite={isFavorite(game.id)}
              onFavoriteToggle={toggleFavorite}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerticalGameList;
