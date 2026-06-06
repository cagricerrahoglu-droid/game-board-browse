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
        // Monthly rental price = 24% of avg_online_sale_price, rounded up.
        // Fall back to min_retail_price_gbp / min_retail_price when sale price absent.
        const salePrice =
          catalogGame.avg_online_sale_price ??
          catalogGame.min_retail_price_gbp ??
          catalogGame.min_retail_price;
        let monthlyPrice = 0;
        if (typeof salePrice === 'number' && salePrice > 0) {
          monthlyPrice = Math.ceil(salePrice * 0.24);
        }

        // Duration may arrive as a number (minutes) or string ("60").
        const rawDuration =
          catalogGame.play_time_minutes ?? catalogGame.duration;
        const durationStr = rawDuration
          ? `${rawDuration}${String(rawDuration).match(/[a-z]/i) ? '' : ' min'}`
          : '60 min';

        const complexity =
          catalogGame.complexity ?? catalogGame.complexity_rating ?? 2;

        return {
          id: catalogGame.catalog_game_id,
          catalogGameId: catalogGame.catalog_game_id,
          name: catalogGame.name,
          title: catalogGame.name, // Add title for GameCard compatibility
          imageUrl: catalogGame.image_url || '/placeholder.svg',
          minPlayers: catalogGame.min_players || 1,
          maxPlayers: catalogGame.max_players || 4,
          players: `${catalogGame.min_players || 1}-${catalogGame.max_players || 4}`,
          playTime: catalogGame.play_time_minutes ?? (Number(catalogGame.duration) || undefined),
          duration: durationStr,
          difficulty: complexity <= 2 ? 'Easy' : complexity <= 3.5 ? 'Medium' : 'Hard',
          description: catalogGame.description || "",
          categories: catalogGame.categories || [],
          yearPublished: catalogGame.year_published,
          rating: catalogGame.avg_rating || 0,
          availability: 'available' as const,
          monthlyPrice,
          avg_online_sale_price:
            catalogGame.avg_online_sale_price ?? catalogGame.min_retail_price,
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
