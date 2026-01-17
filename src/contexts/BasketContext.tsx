import { createContext, useContext, useState, ReactNode } from "react";
import { GameCardProps } from "@/components/GameCard";

export interface BasketItem extends GameCardProps {
  rentalDurationMonths?: number;
}

interface BasketContextType {
  items: BasketItem[];
  addToBasket: (game: GameCardProps, durationMonths?: number) => void;
  removeFromBasket: (gameId: string) => void;
  clearBasket: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  updateItemDuration: (gameId: string, durationMonths: number) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BasketItem[]>([]);

  const addToBasket = (game: GameCardProps, durationMonths: number = 1) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === game.id);
      if (exists) return prev;
      return [...prev, { ...game, rentalDurationMonths: durationMonths }];
    });
  };

  const removeFromBasket = (gameId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== gameId));
  };

  const clearBasket = () => setItems([]);

  const getItemCount = () => items.length;

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const duration = item.rentalDurationMonths || 1;
      return total + (item.monthlyPrice * duration);
    }, 0);
  };

  const updateItemDuration = (gameId: string, durationMonths: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === gameId
          ? { ...item, rentalDurationMonths: durationMonths }
          : item
      )
    );
  };

  return (
    <BasketContext.Provider
      value={{ items, addToBasket, removeFromBasket, clearBasket, getItemCount, getSubtotal, updateItemDuration }}
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