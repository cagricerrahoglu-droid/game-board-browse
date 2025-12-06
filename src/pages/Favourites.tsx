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
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="p-2.5 bg-primary/10 rounded-2xl">
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Favourites</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-6">
        {favoriteGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-muted/50 rounded-3xl mb-6">
              <Heart className="w-16 h-16 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              No favourites yet
            </h2>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              Tap the heart icon on any game to add it to your favourites
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favoriteGames.map((game, index) => (
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
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Favourites;
