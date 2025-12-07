import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import GameCard from "@/components/GameCard";
import BottomNav from "@/components/BottomNav";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
  classicGames,
} from "@/data/gamesData";

const categoryData: Record<string, { title: string; games: typeof strategyGames }> = {
  strategy: { title: "🎯 Strategy", games: strategyGames },
  family: { title: "👨‍👩‍👧‍👦 Family Favourites", games: familyGames },
  "two-player": { title: "🎲 2-Player Hits", games: twoPlayerGames },
  party: { title: "🎉 Party Games", games: partyGames },
  beginner: { title: "🌱 Beginner-Friendly", games: beginnerGames },
  coop: { title: "🤝 Cooperative Games", games: coopGames },
  classic: { title: "🏆 Classic Games", games: classicGames },
};

const Category = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const category = categoryId ? categoryData[categoryId] : null;

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-xl text-foreground">
            {category.title}
          </h1>
        </div>
      </header>

      {/* Games Grid */}
      <main className="p-5">
        <p className="text-muted-foreground text-sm mb-4">
          {category.games.length} games available
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {category.games.map((game) => (
            <GameCard
              key={game.id}
              {...game}
              isFavorite={isFavorite(game.id)}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Category;
