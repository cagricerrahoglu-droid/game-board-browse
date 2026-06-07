import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { mapBackendGameToFrontend } from "@/utils/gameMapper";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteGames: () => GameCardProps[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [catalogGames, setCatalogGames] = useState<GameCardProps[]>([]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchCatalogGames = async () => {
      try {
        const games = await API.listCatalogGames();
        const mappedGames: GameCardProps[] = games.map((game) => ({
          id: game.catalog_game_id,
          catalogGameId: game.catalog_game_id,
          name: game.name,
          imageUrl: game.image_url || "/placeholder.svg",
          minPlayers: game.min_players || 1,
          maxPlayers: game.max_players || 4,
          playTime: game.play_time_minutes,
          difficulty: game.complexity || 2.5,
          description: game.description || "",
          categories: game.categories || [],
          yearPublished: game.year_published,
        }));
        setCatalogGames(mappedGames);
      } catch (error) {
        console.error("Failed to fetch catalog games for favorites:", error);
        setCatalogGames([]);
      }
    };

    fetchCatalogGames();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const getFavoriteGames = () =>
    catalogGames.filter((game) => favorites.includes(game.id));

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
