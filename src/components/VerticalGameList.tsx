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
    <section className="flex flex-col gap-5 px-5">
      <h2 className="font-display font-bold text-xl text-foreground">{title}</h2>
      <div className="flex flex-col gap-4">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
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
