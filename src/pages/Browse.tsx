import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import HorizontalGameCard from "@/components/HorizontalGameCard";
import GameDetailSheet from "@/components/GameDetailSheet";
import { useFavorites } from "@/contexts/FavoritesContext";
import { GameCardProps } from "@/components/GameCard";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
} from "@/data/gamesData";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const allGames = useMemo(() => {
    return [
      ...strategyGames,
      ...familyGames,
      ...twoPlayerGames,
      ...partyGames,
      ...beginnerGames,
      ...coopGames,
    ];
  }, []);

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return allGames;
    return allGames.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allGames]);

  const handleGameClick = (game: GameCardProps) => {
    setSelectedGame(game);
    setSheetOpen(true);
  };

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
          />
        </div>
      </div>

      {/* Games List */}
      <div className="flex flex-col gap-4 px-5 py-5">
        {filteredGames.length > 0 ? (
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
