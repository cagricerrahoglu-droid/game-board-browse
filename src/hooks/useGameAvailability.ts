import { useState, useEffect } from 'react';
import { API } from '@/services/api';

export interface GameAvailability {
  available: boolean;
  availableCount: number;
  isLoading: boolean;
  error: string | null;
}

export function useGameAvailability(catalogGameId: string | null | undefined): GameAvailability {
  const [availability, setAvailability] = useState<GameAvailability>({
    available: false,
    availableCount: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!catalogGameId) {
      setAvailability({
        available: false,
        availableCount: 0,
        isLoading: false,
        error: 'No catalog game ID provided',
      });
      return;
    }

    const checkAvailability = async () => {
      try {
        setAvailability(prev => ({ ...prev, isLoading: true, error: null }));
        const result = await API.checkGameAvailability(catalogGameId);
        setAvailability({
          available: result.available,
          availableCount: result.availableCount,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error checking game availability:', err);
        setAvailability({
          available: false,
          availableCount: 0,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to check availability',
        });
      }
    };

    checkAvailability();
  }, [catalogGameId]);

  return availability;
}
