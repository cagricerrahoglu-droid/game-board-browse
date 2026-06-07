import { useState, useEffect, useMemo, useCallback } from "react";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { mapBackendGameToFrontend } from "@/utils/gameMapper";

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
      setIsLoading(true);
      // Fetch from catalog API
      const catalogGames = await API.listCatalogGames();
      
      // Map catalog games to frontend GameCardProps format
      // (centralised mapper handles price calc + image overrides)
      const backendMappedGames: GameCardProps[] = catalogGames.map((catalogGame: any) =>
        mapBackendGameToFrontend(catalogGame)
      );

      
      // Group games by category
      const grouped: Record<string, GameCardProps[]> = {};
      
      backendMappedGames.forEach((game) => {
        const categories = game.categories || [];
        categories.forEach((category: string) => {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(game);
        });
      });
      
      setBackendGames(backendMappedGames);
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

  const allGames = useFallbackData ? [] : backendGames;

  return {
    allGames,
    gamesByCategory,
    isLoading,
    error,
    useFallbackData,
    refetch: fetchGames,
  };
}
