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

const Index = () => {
  const navigate = useNavigate();
  const { switchRole, isLoggedIn } = useAuth();
  const { rentals, handleRentalAction, isLoading: rentalsLoading } = useRentals();
  
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
          isLoading={rentalsLoading}
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
          // Show error message when data fails to load
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-lg text-muted-foreground mb-2">Unable to load games</p>
            <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
          </div>
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
                  categoryId={category}
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
                    const key = game.name?.toLowerCase().trim() || '';
                    if (!key || seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  });
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
