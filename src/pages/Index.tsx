import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FiltersSection, { FilterState, durationRanges } from "@/components/FiltersSection";
import GameCarousel from "@/components/GameCarousel";
import BottomNav from "@/components/BottomNav";
import VerticalGameList from "@/components/VerticalGameList";
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
    difficulty: [],
  });

  const hasActiveFilters = filters.players || filters.age || filters.duration || filters.difficulty.length > 0;

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

      // Filter by difficulty (multi-select)
      if (filters.difficulty.length > 0) {
        const gameDifficulty = game.difficulty.toLowerCase();
        const difficultyMap: Record<string, string> = {
          easy: "easy",
          medium: "medium",
          difficult: "hard",
        };
        const matchesDifficulty = filters.difficulty.some(
          (d) => difficultyMap[d] === gameDifficulty
        );
        if (!matchesDifficulty) return false;
      }

      return true;
    });
  }, [allGames, filters, hasActiveFilters]);

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
          />
        ) : (
          // Show carousels
          <>
            <GameCarousel title="🎯 Strategy" games={strategyGames} categoryId="strategy" />
            <GameCarousel title="👨‍👩‍👧‍👦 Family Favourites" games={familyGames} categoryId="family" />
            <GameCarousel title="🎲 2-Player Hits" games={twoPlayerGames} categoryId="two-player" />
            <GameCarousel title="🎉 Party Games" games={partyGames} categoryId="party" />
            <GameCarousel title="🌱 Beginner-Friendly" games={beginnerGames} categoryId="beginner" />
            <GameCarousel title="🤝 Cooperative Games" games={coopGames} categoryId="coop" />

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />

            {/* Vertical Recommended List */}
            <VerticalGameList title="✨ Recommended for You" games={recommendedGames} />
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
