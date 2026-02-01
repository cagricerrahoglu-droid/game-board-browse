import { useState, useCallback } from "react";
import { GameCardProps } from "@/components/GameCard";

export interface UseGameSheetResult {
  selectedGame: GameCardProps | null;
  sheetOpen: boolean;
  handleGameClick: (game: GameCardProps) => void;
  setSheetOpen: (open: boolean) => void;
}

export function useGameSheet(): UseGameSheetResult {
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleGameClick = useCallback((game: GameCardProps) => {
    setSelectedGame(game);
    setSheetOpen(true);
  }, []);

  return {
    selectedGame,
    sheetOpen,
    handleGameClick,
    setSheetOpen,
  };
}
