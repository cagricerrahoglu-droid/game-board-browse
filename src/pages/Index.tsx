import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FiltersSection, { FilterState, durationRanges } from "@/components/FiltersSection";
import GameCarousel from "@/components/GameCarousel";
import BottomNav from "@/components/BottomNav";
import VerticalGameList from "@/components/VerticalGameList";
import GameDetailSheet from "@/components/GameDetailSheet";
import { GameCardProps } from "@/components/GameCard";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
  recommendedGames,
} from "@/data/gamesData";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    players: null,
    age: null,
    duration: null,
    difficulty: null,
  });
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const hasActiveFilters = filters.players || filters.age || filters.duration || filters.difficulty;

  const allGames = useMemo(() => {
    const gamesMap = new Map<string, GameCardProps>();
    [
      ...strategyGames,
      ...familyGames,
      ...twoPlayerGames,
      ...partyGames,
      ...beginnerGames,
      ...coopGames,
    ].forEach((game) => {
      gamesMap.set(game.id, game);
    });
    return Array.from(gamesMap.values());
  }, []);

  const filteredGames = useMemo(() => {
    if (!hasActiveFilters) return [];

    return allGames.filter((game) => {
      // Filter by players
      if (filters.players) {
        const playerCount = filters.players === "10+" ? 10 : parseInt(filters.players);
        const playerRange = game.players.match(/(\d+)(?:-(\d+))?/);
        if (playerRange) {
          const minPlayers = parseInt(playerRange[1]);
          const maxPlayers = playerRange[2] ? parseInt(playerRange[2]) : minPlayers;
          if (filters.players === "10+") {
            if (maxPlayers < 10) return false;
          } else if (playerCount < minPlayers || playerCount > maxPlayers) {
            return false;
          }
        }
      }

      // Filter by duration
      if (filters.duration) {
        const durationMatch = game.duration.match(/(\d+)/);
        if (durationMatch) {
          const gameDuration = parseInt(durationMatch[1]);
          if (filters.duration === "under-30" && gameDuration >= 30) return false;
          if (filters.duration === "30-60" && (gameDuration < 30 || gameDuration > 60)) return false;
          if (filters.duration === "60+" && gameDuration < 60) return false;
        }
      }

      // Filter by difficulty
      if (filters.difficulty) {
        const gameDifficulty = game.difficulty.toLowerCase();
        if (filters.difficulty === "easy" && gameDifficulty !== "easy") return false;
        if (filters.difficulty === "medium" && gameDifficulty !== "medium") return false;
        if (filters.difficulty === "difficult" && gameDifficulty !== "hard") return false;
      }

      return true;
    });
  }, [allGames, filters, hasActiveFilters]);

  const handleGameClick = (game: GameCardProps) => {
    setSelectedGame(game);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header */}
      <Header />

      {/* Filters */}
      <FiltersSection filters={filters} onFiltersChange={setFilters} />

      {/* Content */}
      <main className="flex flex-col gap-8 py-6">
        {hasActiveFilters ? (
          // Show filtered vertical list
          <VerticalGameList 
            title={`${filteredGames.length} Games Found`} 
            games={filteredGames}
            onGameClick={handleGameClick}
          />
        ) : (
          // Show carousels
          <>
            <GameCarousel title="🎯 Strategy" games={strategyGames} categoryId="strategy" onGameClick={handleGameClick} />
            <GameCarousel title="👨‍👩‍👧‍👦 Family Favourites" games={familyGames} categoryId="family" onGameClick={handleGameClick} />
            <GameCarousel title="🎲 2-Player Hits" games={twoPlayerGames} categoryId="two-player" onGameClick={handleGameClick} />
            <GameCarousel title="🎉 Party Games" games={partyGames} categoryId="party" onGameClick={handleGameClick} />
            <GameCarousel title="🌱 Beginner-Friendly" games={beginnerGames} categoryId="beginner" onGameClick={handleGameClick} />
            <GameCarousel title="🤝 Cooperative Games" games={coopGames} categoryId="coop" onGameClick={handleGameClick} />

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />

            {/* Vertical Recommended List */}
            <VerticalGameList title="✨ Recommended for You" games={recommendedGames} onGameClick={handleGameClick} />
          </>
        )}
      </main>

      {/* Game Detail Sheet */}
      <GameDetailSheet
        game={selectedGame}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
