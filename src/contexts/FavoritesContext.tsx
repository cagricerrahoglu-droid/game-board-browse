import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GameCardProps } from "@/components/GameCard";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
} from "@/data/gamesData";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteGames: () => GameCardProps[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const allGames: GameCardProps[] = [
  ...strategyGames,
  ...familyGames,
  ...twoPlayerGames,
  ...partyGames,
  ...beginnerGames,
  ...coopGames,
];

// Remove duplicates by id
const uniqueGames = allGames.filter(
  (game, index, self) => index === self.findIndex((g) => g.id === game.id)
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const getFavoriteGames = () =>
    uniqueGames.filter((game) => favorites.includes(game.id));

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, getFavoriteGames }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
