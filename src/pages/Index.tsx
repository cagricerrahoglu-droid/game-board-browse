import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ActiveRentalTray from "@/components/ActiveRentalTray";
import FiltersSection, { FilterState, durationRanges } from "@/components/FiltersSection";
import GameCarousel from "@/components/GameCarousel";
import BottomNav from "@/components/BottomNav";
import VerticalGameList from "@/components/VerticalGameList";
import GameDetailSheet from "@/components/GameDetailSheet";
import { GameCardProps } from "@/components/GameCard";
import { API } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRentals } from "@/contexts/RentalContext";
import { mapBackendGameToFrontendWithCategory, groupGamesByBackendCategory, categoryMetadata } from "@/utils/gameMapper";
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
  const { rentals, handleRentalAction } = useRentals();
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
      
      // Add hardcoded games ONLY if they don't exist in backend at all
      // Some games will be available, some limited, some unavailable for demo variety
      const availableHardcodedIds = new Set(['catan', 'ticket-to-ride', 'azul', 'splendor', '7-wonders-duel', 'patchwork', 'codenames', 'wavelength', 'carcassonne', 'love-letter', 'pandemic', 'the-crew']);
      const limitedHardcodedIds = new Set(['wingspan', 'kingdomino', 'jaipur', 'just-one', 'exploding-kittens', 'spirit-island', 'clue', 'risk']);
      
      allHardcodedGames.forEach(hardcodedGame => {
        if (!backendGameTitles.has(hardcodedGame.title.toLowerCase().trim())) {
          // Game not in backend, add hardcoded version with appropriate availability
          let category = "Other";
          const name = hardcodedGame.title.toLowerCase();
          if (strategyGames.some(g => g.title.toLowerCase() === name)) category = "Strategy";
          else if (familyGames.some(g => g.title.toLowerCase() === name)) category = "Family";
          else if (twoPlayerGames.some(g => g.title.toLowerCase() === name)) category = "2-Player";
          else if (partyGames.some(g => g.title.toLowerCase() === name)) category = "Party";
          else if (coopGames.some(g => g.title.toLowerCase() === name)) category = "Cooperative";
          else if (beginnerGames.some(g => g.title.toLowerCase() === name)) category = "Beginner";
          
          // Determine availability based on game id
          let availability: "available" | "limited" | "unavailable" = "unavailable";
          if (availableHardcodedIds.has(hardcodedGame.id)) {
            availability = "available";
          } else if (limitedHardcodedIds.has(hardcodedGame.id)) {
            availability = "limited";
          }
          
          mergedGames.push({
            ...hardcodedGame,
            availability,
            category
          });
        }
        // If game exists in backend, skip hardcoded version (backend already added above)
      });
      
      // All games should now have categories - just cast them
      const gamesWithCategories = mergedGames as (GameCardProps & { category: string })[];
      
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

  // Get category display info
  const getCategoryInfo = (category: string) => {
    const meta = categoryMetadata[category];
    if (meta) {
      return {
        title: `${meta.emoji} ${meta.title}`,
        description: meta.description
      };
    }
    return {
      title: category,
      description: undefined
    };
  };


  const handleSwitchToLender = () => {
    switchRole("lender");
    navigate("/lender-home");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header */}
      <Header />

      {/* Active Rental Tray - only shows when rentals exist */}
      {isLoggedIn && (
        <ActiveRentalTray 
          rentals={rentals} 
          onRentalAction={handleRentalAction}
        />
      )}

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
            <GameCarousel title="🎯 Strategy" description="Think ahead and outmaneuver your opponents" games={strategyGames} categoryId="strategy" onGameClick={handleGameClick} />
            <GameCarousel title="👨‍👩‍👧‍👦 Family Favourites" description="Fun for all ages, perfect for game nights" games={familyGames} categoryId="family" onGameClick={handleGameClick} />
            <GameCarousel title="🎲 2-Player Hits" description="Head-to-head competition for two" games={twoPlayerGames} categoryId="two-player" onGameClick={handleGameClick} />
            <GameCarousel title="🎉 Party Games" description="Laugh and compete with friends" games={partyGames} categoryId="party" onGameClick={handleGameClick} />
            <GameCarousel title="🌱 Beginner-Friendly" description="Easy to learn, quick to play" games={beginnerGames} categoryId="beginner" onGameClick={handleGameClick} />
            <GameCarousel title="🤝 Cooperative Games" description="Work together to win" games={coopGames} categoryId="coop" onGameClick={handleGameClick} />

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />

            {/* Vertical Recommended List */}
            <VerticalGameList title="✨ Recommended for You" games={recommendedGames} onGameClick={handleGameClick} />
          </>
        ) : (
          // Show carousels from backend data
          <>
            {Object.entries(gamesByCategory).map(([category, games]) => {
              const categoryInfo = getCategoryInfo(category);
              return games.length > 0 && (
                <GameCarousel 
                  key={category}
                  title={categoryInfo.title}
                  description={categoryInfo.description}
                  games={games}
                  categoryId={category.toLowerCase().replace(/\s+/g, '-')}
                  onGameClick={handleGameClick}
                />
              );
            })}

            {/* Divider */}
            {backendGames.length > 0 && (
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />
            )}

            {/* Vertical List - deduplicated by title */}
            {backendGames.length > 0 && (
              <VerticalGameList 
                title="✨ All Games" 
                games={(() => {
                  const seen = new Set<string>();
                  return backendGames.filter(game => {
                    const key = game.title.toLowerCase().trim();
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  }).slice(0, 10);
                })()} 
                onGameClick={handleGameClick} 
              />
            )}
            
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
