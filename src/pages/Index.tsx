import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ActiveRentalTray from "@/components/ActiveRentalTray";
import FiltersSection from "@/components/FiltersSection";
import GameCarousel from "@/components/GameCarousel";
import BottomNav from "@/components/BottomNav";
import VerticalGameList from "@/components/VerticalGameList";
import GameDetailSheet from "@/components/GameDetailSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useRentals } from "@/contexts/RentalContext";
import { categoryMetadata } from "@/utils/gameMapper";
import { useGames } from "@/hooks/useGames";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useGameSheet } from "@/hooks/useGameSheet";
import {
  strategyGames,
  familyGames,
  twoPlayerGames,
  partyGames,
  beginnerGames,
  coopGames,
  recommendedGames,
} from "@/data/games";

const Index = () => {
  const navigate = useNavigate();
  const { switchRole, isLoggedIn } = useAuth();
  const { rentals, handleRentalAction } = useRentals();
  
  // Custom hooks for games, filtering, and sheet
  const { allGames, gamesByCategory, isLoading, useFallbackData } = useGames();
  const { filters, setFilters, hasActiveFilters, filteredGames } = useGameFilters(allGames);
  const { selectedGame, sheetOpen, handleGameClick, setSheetOpen } = useGameSheet();

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
            {allGames.length > 0 && (
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />
            )}

            {/* Vertical List - deduplicated by title */}
            {allGames.length > 0 && (
              <VerticalGameList 
                title="✨ All Games" 
                games={(() => {
                  const seen = new Set<string>();
                  return allGames.filter(game => {
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
