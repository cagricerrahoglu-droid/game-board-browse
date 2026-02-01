import { useState, useEffect, useMemo, useCallback } from "react";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { mapBackendGameToFrontendWithCategory, groupGamesByBackendCategory } from "@/utils/gameMapper";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
} from "@/data/gamesData";

// IDs for demo availability states
const availableHardcodedIds = new Set([
  'catan', 'ticket-to-ride', 'azul', 'splendor', '7-wonders-duel', 
  'patchwork', 'codenames', 'wavelength', 'carcassonne', 'love-letter', 
  'pandemic', 'the-crew'
]);
const limitedHardcodedIds = new Set([
  'wingspan', 'kingdomino', 'jaipur', 'just-one', 
  'exploding-kittens', 'spirit-island', 'clue', 'risk'
]);

// All hardcoded games combined
const allHardcodedGames = [
  ...strategyGames,
  ...familyGames,
  ...twoPlayerGames,
  ...partyGames,
  ...beginnerGames,
  ...coopGames,
];

// Determine category from hardcoded game arrays
function getCategoryForGame(title: string): string {
  const name = title.toLowerCase();
  if (strategyGames.some(g => g.title.toLowerCase() === name)) return "Strategy";
  if (familyGames.some(g => g.title.toLowerCase() === name)) return "Family";
  if (twoPlayerGames.some(g => g.title.toLowerCase() === name)) return "2-Player";
  if (partyGames.some(g => g.title.toLowerCase() === name)) return "Party";
  if (coopGames.some(g => g.title.toLowerCase() === name)) return "Cooperative";
  if (beginnerGames.some(g => g.title.toLowerCase() === name)) return "Beginner";
  return "Other";
}

// Determine availability for hardcoded games
function getAvailabilityForGame(id: string): "available" | "limited" | "unavailable" {
  if (availableHardcodedIds.has(id)) return "available";
  if (limitedHardcodedIds.has(id)) return "limited";
  return "unavailable";
}

export interface UseGamesResult {
  allGames: GameCardProps[];
  gamesByCategory: Record<string, GameCardProps[]>;
  isLoading: boolean;
  error: string | null;
  useFallbackData: boolean;
  refetch: () => Promise<void>;
}

export function useGames(): UseGamesResult {
  const [backendGames, setBackendGames] = useState<GameCardProps[]>([]);
  const [gamesByCategory, setGamesByCategory] = useState<Record<string, GameCardProps[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallbackData, setUseFallbackData] = useState(false);

  const fetchGames = useCallback(async () => {
    try {
      const response = await API.listGames();
      const games = Array.isArray(response) ? response : [];
      
      // Map backend games to frontend format with categories
      const backendMappedGames = games.map(mapBackendGameToFrontendWithCategory);
      
      // Create a Set of backend game titles for lookup
      const backendGameTitles = new Set(
        backendMappedGames.map(game => game.title.toLowerCase().trim())
      );
      
      // Start with all backend games
      const mergedGames = [...backendMappedGames];
      
      // Add hardcoded games ONLY if they don't exist in backend
      allHardcodedGames.forEach(hardcodedGame => {
        if (!backendGameTitles.has(hardcodedGame.title.toLowerCase().trim())) {
          mergedGames.push({
            ...hardcodedGame,
            availability: getAvailabilityForGame(hardcodedGame.id),
            category: getCategoryForGame(hardcodedGame.title),
          });
        }
      });
      
      const gamesWithCategories = mergedGames as (GameCardProps & { category: string })[];
      const grouped = groupGamesByBackendCategory(gamesWithCategories);
      
      setBackendGames(mergedGames);
      setGamesByCategory(grouped);
      setIsLoading(false);
      setError(null);
      setUseFallbackData(false);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch games";
      setError(errorMessage);
      setIsLoading(false);
      setUseFallbackData(true);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Periodic refetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchGames, 30000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  // Fallback games (deduplicated hardcoded data)
  const fallbackGames = useMemo(() => {
    const gamesMap = new Map<string, GameCardProps>();
    allHardcodedGames.forEach((game) => {
      gamesMap.set(game.id, game);
    });
    return Array.from(gamesMap.values());
  }, []);

  const allGames = useFallbackData ? fallbackGames : backendGames;

  return {
    allGames,
    gamesByCategory,
    isLoading,
    error,
    useFallbackData,
    refetch: fetchGames,
  };
}
