import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
} from "@/data/gamesData";
import VerticalGameList from "@/components/VerticalGameList";
import GameDetailSheet from "@/components/GameDetailSheet";
import { GameCardProps } from "@/components/GameCard";

const carouselCategories: Record<string, { title: string; games: GameCardProps[] }> = {
  "strategy": {
    title: "🎯 Strategy",
    games: strategyGames
  },
  "family": {
    title: "👨‍👩‍👧‍👦 Family Favourites",
    games: familyGames
  },
  "two-player": {
    title: "🎲 2-Player Hits",
    games: twoPlayerGames
  },
  "party": {
    title: "🎉 Party Games",
    games: partyGames
  },
  "beginner": {
    title: "🌱 Beginner-Friendly",
    games: beginnerGames
  },
  "coop": {
    title: "🤝 Cooperative Games",
    games: coopGames
  }
};

const CarouselGames = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const category = categoryId ? carouselCategories[categoryId] : null;

  const handleGameClick = (game: GameCardProps) => {
    setSelectedGame(game);
    setSheetOpen(true);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-lg text-foreground">
            {category.title}
          </h1>
        </div>
      </header>

      {/* Games List */}
      <div className="pt-5">
        <VerticalGameList title="" games={category.games} onGameClick={handleGameClick} />
      </div>

      {/* Game Detail Sheet */}
      <GameDetailSheet
        game={selectedGame}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
};

export default CarouselGames;
