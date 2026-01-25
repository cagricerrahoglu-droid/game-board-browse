import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FiltersSection, { FilterState, durationRanges } from "@/components/FiltersSection";
import GameCarousel from "@/components/GameCarousel";
import BottomNav from "@/components/BottomNav";
import VerticalGameList from "@/components/VerticalGameList";
import GameDetailSheet from "@/components/GameDetailSheet";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { mapBackendGameToFrontendWithCategory, groupGamesByBackendCategory } from "@/utils/gameMapper";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
  recommendedGames,
} from "@/data/gamesData";

const Index = () => {
  const navigate = useNavigate();
  const { switchRole, isLoggedIn } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    players: null,
    age: null,
    duration: null,
    difficulty: null,
  });
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  // State for backend games
  const [backendGames, setBackendGames] = useState<GameCardProps[]>([]);
  const [gamesByCategory, setGamesByCategory] = useState<Record<string, GameCardProps[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Fetch games from backend
  const fetchGames = async () => {
    try {
      const response = await API.listGames();
      const games = Array.isArray(response) ? response : [];
      
      // Map backend games to frontend format with categories
      const backendMappedGames = games.map(mapBackendGameToFrontendWithCategory);
      
      // Get all hardcoded games
      const allHardcodedGames = [
        ...strategyGames,
        ...familyGames,
        ...twoPlayerGames,
        ...partyGames,
        ...beginnerGames,
        ...coopGames,
      ];
      
      // Create a Set of backend game titles (case-insensitive) for lookup
      const backendGameTitles = new Set(
        backendMappedGames.map(game => game.title.toLowerCase().trim())
      );
      
      // Start with all backend games (including duplicates/multiple copies)
      const mergedGames = [...backendMappedGames];
      
      // Add hardcoded games ONLY if they don't exist in backend at all (mark as unavailable)
      allHardcodedGames.forEach(hardcodedGame => {
        if (!backendGameTitles.has(hardcodedGame.title.toLowerCase().trim())) {
          // Game not in backend at all, add hardcoded version as unavailable
          mergedGames.push({
            ...hardcodedGame,
            availability: "unavailable" as const
          });
        }
        // If game exists in backend, skip hardcoded version (backend already added above)
      });
      
      // Group by category - need to infer category for hardcoded games
      const gamesWithCategories = mergedGames.map(game => {
        // If it already has a category from backend, use it
        if ('category' in game) {
          return game as typeof game & { category: string };
        }
        
        // Infer category from hardcoded arrays
        let category = "Other";
        const name = game.title.toLowerCase();
        
        if (strategyGames.some(g => g.title.toLowerCase() === name)) category = "Strategy";
        else if (familyGames.some(g => g.title.toLowerCase() === name)) category = "Family";
        else if (twoPlayerGames.some(g => g.title.toLowerCase() === name)) category = "2-Player";
        else if (partyGames.some(g => g.title.toLowerCase() === name)) category = "Party";
        else if (coopGames.some(g => g.title.toLowerCase() === name)) category = "Cooperative";
        else if (beginnerGames.some(g => g.title.toLowerCase() === name)) category = "Beginner";
        
        return { ...game, category };
      });
      
      const grouped = groupGamesByBackendCategory(gamesWithCategories);
      
      setBackendGames(mergedGames);
      setGamesByCategory(grouped);
      setIsLoading(false);
      setError(null);
      setUseFallbackData(false);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch games";
      setError(errorMessage);
      setIsLoading(false);
      // Use fallback data if fetch fails
      setUseFallbackData(true);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGames();
  }, []);

  // Periodic refetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGames();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const hasActiveFilters = filters.players || filters.age || filters.duration || filters.difficulty;

  // Use fallback data if backend fetch failed
  const fallbackGames = useMemo(() => {
    const gamesMap = new Map<string, GameCardProps>();
    [
      ...strategyGames,
      ...familyGames,
      ...twoPlayerGames,
      ...partyGames,
      ...beginnerGames,
      ...coopGames,
    ].forEach((game) => {
      gamesMap.set(game.id, game);
    });
    return Array.from(gamesMap.values());
  }, []);

  const allGames = useFallbackData ? fallbackGames : backendGames;

  const filteredGames = useMemo(() => {
    if (!hasActiveFilters) return [];

    return allGames.filter((game) => {
      // Filter by players
      if (filters.players) {
        const playerCount = filters.players === "10+" ? 10 : parseInt(filters.players);
        const playerRange = game.players.match(/(\d+)(?:-(\d+))?/);
        if (playerRange) {
          const minPlayers = parseInt(playerRange[1]);
          const maxPlayers = playerRange[2] ? parseInt(playerRange[2]) : minPlayers;
          if (filters.players === "10+") {
            if (maxPlayers < 10) return false;
          } else if (playerCount < minPlayers || playerCount > maxPlayers) {
            return false;
          }
        }
      }

      // Filter by duration
      if (filters.duration) {
        const durationMatch = game.duration.match(/(\d+)/);
        if (durationMatch) {
          const gameDuration = parseInt(durationMatch[1]);
          if (filters.duration === "under-30" && gameDuration >= 30) return false;
          if (filters.duration === "30-60" && (gameDuration < 30 || gameDuration > 60)) return false;
          if (filters.duration === "60+" && gameDuration < 60) return false;
        }
      }

      // Filter by difficulty
      if (filters.difficulty) {
        const gameDifficulty = game.difficulty.toLowerCase();
        if (filters.difficulty === "easy" && gameDifficulty !== "easy") return false;
        if (filters.difficulty === "medium" && gameDifficulty !== "medium") return false;
        if (filters.difficulty === "difficult" && gameDifficulty !== "hard") return false;
      }

      return true;
    });
  }, [allGames, filters, hasActiveFilters]);

  const handleGameClick = (game: GameCardProps) => {
    setSelectedGame(game);
    setSheetOpen(true);
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      "Strategy": "🎯",
      "Family": "👨‍👩‍👧‍👦",
      "2-Player": "🎲",
      "Two Player": "🎲",
      "Party": "🎉",
      "Beginner": "🌱",
      "Cooperative": "🤝",
      "Coop": "🤝",
      "Other": "🎮"
    };
    return emojiMap[category] || "🎮";
  };

  const handleSwitchToLender = () => {
    switchRole("lender");
    navigate("/lender-home");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header */}
      <Header />

      {/* Filters */}
      <FiltersSection filters={filters} onFiltersChange={setFilters} />

      {/* Content */}
      <main className="flex flex-col gap-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading games...</p>
            </div>
          </div>
        ) : hasActiveFilters ? (
          // Show filtered vertical list
          <VerticalGameList 
            title={`${filteredGames.length} Games Found`} 
            games={filteredGames}
            onGameClick={handleGameClick}
          />
        ) : useFallbackData ? (
          // Show fallback carousels with hardcoded data
          <>
            <GameCarousel title="🎯 Strategy" games={strategyGames} categoryId="strategy" onGameClick={handleGameClick} />
            <GameCarousel title="👨‍👩‍👧‍👦 Family Favourites" games={familyGames} categoryId="family" onGameClick={handleGameClick} />
            <GameCarousel title="🎲 2-Player Hits" games={twoPlayerGames} categoryId="two-player" onGameClick={handleGameClick} />
            <GameCarousel title="🎉 Party Games" games={partyGames} categoryId="party" onGameClick={handleGameClick} />
            <GameCarousel title="🌱 Beginner-Friendly" games={beginnerGames} categoryId="beginner" onGameClick={handleGameClick} />
            <GameCarousel title="🤝 Cooperative Games" games={coopGames} categoryId="coop" onGameClick={handleGameClick} />

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />

            {/* Vertical Recommended List */}
            <VerticalGameList title="✨ Recommended for You" games={recommendedGames} onGameClick={handleGameClick} />
          </>
        ) : (
          // Show carousels from backend data
          <>
            {Object.entries(gamesByCategory).map(([category, games]) => (
              games.length > 0 && (
                <GameCarousel 
                  key={category}
                  title={`${getCategoryEmoji(category)} ${category}`}
                  games={games}
                  categoryId={category.toLowerCase().replace(/\s+/g, '-')}
                  onGameClick={handleGameClick}
                />
              )
            ))}
            
            {Object.keys(gamesByCategory).length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No games available at the moment</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Game Detail Sheet */}
      <GameDetailSheet
        game={selectedGame}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
