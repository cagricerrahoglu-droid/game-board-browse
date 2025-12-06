import Header from "@/components/Header";
import FiltersSection from "@/components/FiltersSection";
import GameCarousel from "@/components/GameCarousel";
import BottomNav from "@/components/BottomNav";
import VerticalGameList from "@/components/VerticalGameList";
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
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header */}
      <Header />

      {/* Filters */}
      <FiltersSection />

      {/* Carousels */}
      <main className="flex flex-col gap-8 py-6">
        <GameCarousel title="🎯 Strategy" games={strategyGames} />
        <GameCarousel title="👨‍👩‍👧‍👦 Family Favourites" games={familyGames} />
        <GameCarousel title="🎲 2-Player Hits" games={twoPlayerGames} />
        <GameCarousel title="🎉 Party Games" games={partyGames} />
        <GameCarousel title="🌱 Beginner-Friendly" games={beginnerGames} />
        <GameCarousel title="🤝 Cooperative Games" games={coopGames} />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-5" />

        {/* Vertical Recommended List */}
        <VerticalGameList title="✨ Recommended for You" games={recommendedGames} />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
