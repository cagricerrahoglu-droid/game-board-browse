import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import LenderGameCard, { LenderGame } from "@/components/LenderGameCard";
import { API } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

// Generic placeholder for games without images
const DEFAULT_GAME_IMAGE = "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=400&fit=crop";

const LenderHome = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [games, setGames] = useState<LenderGame[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    activeRentals: 0,
    earningsThisMonth: 0,
    totalViews: 0,
  });

  // Fetch lender data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingGames(true);
        const userId = API.getCurrentUserId();
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        // Fetch games
        const gamesResponse = await API.getGamesByOwner(userId);
        
        let mappedGames: LenderGame[] = [];
        if (Array.isArray(gamesResponse)) {
          mappedGames = gamesResponse.map((dbGame: any) => ({
            id: dbGame.game_id,
            title: dbGame.name,
            image: dbGame.image_url || DEFAULT_GAME_IMAGE,
            condition: dbGame.condition?.toLowerCase() as "excellent" | "good" | "fair" || "good",
            isComplete: dbGame.is_complete ?? true,
            hasManual: dbGame.has_manual ?? true,
            isAvailable: dbGame.available ?? true,
            status: dbGame.available ? "available" : "paused",
            rentalPrice: dbGame.rental_price ?? 4.99,
            sellAfterRent: dbGame.sell_after_rent ?? false,
            sellPrice: dbGame.sell_price,
          }));
          setGames(mappedGames);
        }

        // Fetch rentals for stats
        try {
          const rentalsResponse = await API.getRentalsByLender(userId);
          
          let activeRentals = 0;
          let earningsThisMonth = 0;

          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          if (Array.isArray(rentalsResponse)) {
            rentalsResponse.forEach((rental: any) => {
              if (rental.status === 'active') {
                activeRentals++;
              }

              if (rental.created_at) {
                const rentalDate = new Date(rental.created_at);
                if (rentalDate.getMonth() === currentMonth && rentalDate.getFullYear() === currentYear) {
                  earningsThisMonth += rental.deposit_amount || 0;
                }
              }
            });
          }

          setStats({
            totalGames: mappedGames.length,
            activeRentals,
            earningsThisMonth,
            totalViews: Math.floor(Math.random() * 500) + 100, // Mock data for now
          });
        } catch (rentalError) {
          console.error('Failed to fetch rentals:', rentalError);
          setStats(prev => ({
            ...prev,
            totalGames: mappedGames.length,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchData();
  }, []);

  const handleSwitchToRenter = () => {
    switchRole("renter");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      {/* Main Content */}
      <main className="px-5 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Total Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalGames}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Active Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeRentals}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${stats.earningsThisMonth.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalViews}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start gap-2" 
              onClick={() => navigate("/add-game")}
            >
              <Plus className="w-4 h-4" />
              Add New Game
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/lender")}
            >
              <Package className="w-4 h-4" />
              Manage Listings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Listings</h2>
            {games.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/lender")}
              >
                View All
              </Button>
            )}
          </div>

          {loadingGames ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading your games...
            </div>
          ) : games.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  You haven't listed any games yet
                </p>
                <Button onClick={() => navigate("/add-game")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Game
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {games.slice(0, 3).map((game) => (
                <LenderGameCard 
                  key={game.id} 
                  game={game}
                  onEdit={() => navigate(`/lender`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        {games.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tips to Increase Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Add clear photos of your games</li>
                <li>• Keep your availability calendar updated</li>
                <li>• Respond quickly to rental requests</li>
                <li>• Offer competitive pricing</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default LenderHome;
