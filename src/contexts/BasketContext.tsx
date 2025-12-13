import { createContext, useContext, useState, ReactNode } from "react";
import { GameCardProps } from "@/components/GameCard";

export interface BasketItem extends GameCardProps {}

interface BasketContextType {
  items: BasketItem[];
  addToBasket: (game: GameCardProps) => void;
  removeFromBasket: (gameId: string) => void;
  clearBasket: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BasketItem[]>([]);

  const addToBasket = (game: GameCardProps) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === game.id);
      if (exists) return prev;
      return [...prev, { ...game }];
    });
  };

  const removeFromBasket = (gameId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== gameId));
  };

  const clearBasket = () => setItems([]);

  const getItemCount = () => items.length;

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.monthlyPrice, 0);
  };

  return (
    <BasketContext.Provider
      value={{ items, addToBasket, removeFromBasket, clearBasket, getItemCount, getSubtotal }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};
