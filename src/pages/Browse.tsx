import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import HorizontalGameCard from "@/components/HorizontalGameCard";
import GameDetailSheet from "@/components/GameDetailSheet";
import { useFavorites } from "@/contexts/FavoritesContext";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { mapBackendGameToFrontend } from "@/utils/gameMapper";
import { useGameSheet } from "@/hooks/useGameSheet";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allGames, setAllGames] = useState<GameCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { selectedGame, sheetOpen, handleGameClick, setSheetOpen } = useGameSheet();

  // Load games from database
  useEffect(() => {
    const loadGames = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = isLoggedIn ? await API.listGames() : await API.listCatalogGames();

        // Handle both response formats
        const games = Array.isArray(response) ? response : ((response as any).games || []);
        
        // Convert API games to GameCardProps format using the mapper
        const formattedGames = games.map((game: any) => mapBackendGameToFrontend(game));
        
        // Deduplicate games by name - keep the first occurrence of each unique game name
        const uniqueGames = formattedGames.reduce((acc: GameCardProps[], game) => {
          const exists = acc.some(g => g.title.toLowerCase() === game.title.toLowerCase());
          if (!exists) {
            acc.push(game);
          }
          return acc;
        }, []);
        
        setAllGames(uniqueGames);
      } catch (err: any) {
        console.error("Error loading games:", err);

        try {
          const catalogGames = await API.listCatalogGames();
          const formattedGames = catalogGames.map((game: any) => mapBackendGameToFrontend(game));
          setAllGames(formattedGames);
          setError(null);
        } catch (catalogErr) {
          console.error("Error loading catalog games:", catalogErr);
          setError("Failed to load games");
          setAllGames([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [isLoggedIn]);

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return allGames;
    return allGames.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allGames]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30 px-5 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Games List */}
      <div className="flex flex-col gap-4 px-5 py-5">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading games...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-amber-600">
            {error}. Showing available games.
          </div>
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <HorizontalGameCard
                {...game}
                isFavorite={isFavorite(game.id)}
                onFavoriteToggle={toggleFavorite}
                onClick={() => handleGameClick(game)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No games found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Game Detail Sheet */}
      <GameDetailSheet
        game={selectedGame}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <BottomNav />
    </div>
  );
};

export default Browse;
