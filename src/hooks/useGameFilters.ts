import { useState, useMemo } from "react";
import { GameCardProps } from "@/components/GameCard";
import { FilterState } from "@/components/FiltersSection";

export interface UseGameFiltersResult {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  hasActiveFilters: boolean;
  filteredGames: GameCardProps[];
}

export function useGameFilters(allGames: GameCardProps[]): UseGameFiltersResult {
  const [filters, setFilters] = useState<FilterState>({
    players: null,
    age: null,
    duration: null,
    difficulty: null,
  });

  const hasActiveFilters = !!(filters.players || filters.age || filters.duration || filters.difficulty);

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

  return {
    filters,
    setFilters,
    hasActiveFilters,
    filteredGames,
  };
}
