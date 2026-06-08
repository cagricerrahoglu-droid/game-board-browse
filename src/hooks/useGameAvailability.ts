import { useState, useEffect } from 'react';
import { API } from '@/services/api';

export interface GameAvailability {
  available: boolean;
  availableCount: number;
  isLoading: boolean;
  error: string | null;
}

// Testing override: treat all catalog games as available so renters can browse
// and rent without needing real listed inventory in the backend.
const FORCE_ALL_AVAILABLE = true;

export function useGameAvailability(catalogGameId: string | null | undefined): GameAvailability {
  const [availability, setAvailability] = useState<GameAvailability>({
    available: FORCE_ALL_AVAILABLE,
    availableCount: FORCE_ALL_AVAILABLE ? 1 : 0,
    isLoading: !FORCE_ALL_AVAILABLE,
    error: null,
  });

  useEffect(() => {
    if (FORCE_ALL_AVAILABLE) {
      setAvailability({
        available: true,
        availableCount: 1,
        isLoading: false,
        error: null,
      });
      return;
    }

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
