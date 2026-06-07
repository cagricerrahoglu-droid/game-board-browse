import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { API } from "@/services/api";
import VerticalGameList from "@/components/VerticalGameList";
import GameDetailSheet from "@/components/GameDetailSheet";
import { GameCardProps } from "@/components/GameCard";
import { mapBackendGameToFrontend } from "@/utils/gameMapper";

const categoryTitles: Record<string, string> = {
  "Strategy": "🎯 Strategy",
  "Family": "👨‍👩‍👧‍👦 Family Favourites",
  "2-Player": "🎲 2-Player Hits",
  "Party": "🎉 Party Games",
  "Beginner": "🌱 Beginner-Friendly",
  "Cooperative": "🤝 Cooperative Games",
  "Classic": "🎮 Classic Games",
  "Recommended": "⭐ Recommended",
};

const CarouselGames = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [games, setGames] = useState<GameCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryGames = async () => {
      try {
        setIsLoading(true);
        const catalogGames = await API.listCatalogGamesByCategory(categoryId);
        
        // Map to frontend format
        const mappedGames: GameCardProps[] = catalogGames.map((game) => ({
          id: game.catalog_game_id,
          catalogGameId: game.catalog_game_id,
          name: game.name,
          imageUrl: game.image_url || "/placeholder.svg",
          minPlayers: game.min_players || 1,
          maxPlayers: game.max_players || 4,
          playTime: game.play_time_minutes,
          difficulty: game.complexity || 2.5,
          description: game.description || "",
          categories: game.categories || [],
          yearPublished: game.year_published,
        }));
        
        setGames(mappedGames);
      } catch (error) {
        console.error("Failed to fetch category games:", error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryGames();
  }, [categoryId]);

  const title = categoryId ? categoryTitles[categoryId] || categoryId : "Games";

  const handleGameClick = (game: GameCardProps) => {
    setSelectedGame(game);
    setSheetOpen(true);
  };

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-lg text-foreground">
            {title}
          </h1>
        </div>
      </header>

      {/* Games List */}
      <div className="pt-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading games...</p>
          </div>
        ) : (
          <VerticalGameList title="" games={games} onGameClick={handleGameClick} />
        )}
      </div>

      {/* Game Detail Sheet */}
      <GameDetailSheet
        game={selectedGame}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
};

export default CarouselGames;
