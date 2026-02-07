import { useState, useEffect } from 'react';
import { API } from '@/services/api';

export interface CatalogGame {
  catalog_game_id: string;
  name: string;
  description: string;
  avg_rating?: number;
  complexity_rating?: number;
  min_retail_price_gbp?: number;
  min_players?: number;
  max_players?: number;
  duration?: string;
  min_age?: string;
  created_at: string;
  updated_at: string;
}

export function useCatalogGames() {
  const [games, setGames] = useState<CatalogGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalogGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.listCatalogGames();
        setGames(response || []);
      } catch (err) {
        console.error('Error fetching catalog games:', err);
        setError(err instanceof Error ? err.message : 'Failed to load games catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogGames();
  }, []);

  return { games, loading, error, refetch: () => setLoading(true) };
}

export function useCatalogGame(catalog_game_id: string | null) {
  const [game, setGame] = useState<CatalogGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!catalog_game_id) {
      setGame(null);
      return;
    }

    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.getCatalogGame(catalog_game_id);
        setGame(response);
      } catch (err) {
        console.error('Error fetching catalog game:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [catalog_game_id]);

  return { game, loading, error };
}
