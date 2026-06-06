import { useState, useEffect, useMemo, useCallback } from "react";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { calculateGamePricing } from "@/data/gamePricingStrategy";

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
      const backendMappedGames: GameCardProps[] = catalogGames.map((catalogGame: any) => {
        // Calculate pricing based on avg_online_sale_price if available
        let monthlyPrice = 0;
        if (catalogGame.avg_online_sale_price) {
          const pricing = calculateGamePricing(
            catalogGame.catalog_game_id,
            catalogGame.name,
            catalogGame.avg_online_sale_price
          );
          monthlyPrice = pricing.monthly_rental_price;
        }

        return {
          id: catalogGame.catalog_game_id,
          catalogGameId: catalogGame.catalog_game_id,
          name: catalogGame.name,
          title: catalogGame.name, // Add title for GameCard compatibility
          imageUrl: catalogGame.image_url || '/placeholder.svg',
          minPlayers: catalogGame.min_players || 1,
          maxPlayers: catalogGame.max_players || 4,
          players: `${catalogGame.min_players || 1}-${catalogGame.max_players || 4}`, // Format as string
          playTime: catalogGame.play_time_minutes,
          duration: catalogGame.play_time_minutes ? `${catalogGame.play_time_minutes} min` : '60 min', // Format as string
          difficulty: catalogGame.complexity <= 2 ? 'Easy' : catalogGame.complexity <= 3.5 ? 'Medium' : 'Hard',
          description: catalogGame.description || "",
          categories: catalogGame.categories || [],
          yearPublished: catalogGame.year_published,
          rating: catalogGame.avg_rating || 0,
          availability: 'available' as const,
          monthlyPrice,
          // Store pricing details for later use
          avg_online_sale_price: catalogGame.avg_online_sale_price,
        };
      });
      
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
