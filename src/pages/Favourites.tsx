import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import HorizontalGameCard from "@/components/HorizontalGameCard";
import BottomNav from "@/components/BottomNav";

const Favourites = () => {
  const { getFavoriteGames, toggleFavorite, isFavorite } = useFavorites();
  const favoriteGames = getFavoriteGames();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <h1 className="text-xl font-bold text-foreground">My Favourites</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {favoriteGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No favourites yet
            </h2>
            <p className="text-muted-foreground max-w-xs">
              Tap the heart icon on any game to add it to your favourites
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favoriteGames.map((game) => (
              <HorizontalGameCard
                key={game.id}
                {...game}
                isFavorite={isFavorite(game.id)}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Favourites;
