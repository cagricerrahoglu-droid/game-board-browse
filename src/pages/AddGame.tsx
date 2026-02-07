import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { API } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { GameCardProps } from "@/components/GameCard";

// Price multipliers based on condition
const conditionMultipliers = {
  excellent: 1.0,
  good: 0.85,
  fair: 0.7,
};

const AddGame = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameCardProps | null>(null);
  
  // Game details state
  const [condition, setCondition] = useState<"excellent" | "good" | "fair">("good");
  const [isComplete, setIsComplete] = useState(true);
  const [hasManual, setHasManual] = useState(true);
  const [sellAfterRent, setSellAfterRent] = useState(false);
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allGames, setAllGames] = useState<GameCardProps[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Fetch catalog games on mount
  useEffect(() => {
    const fetchCatalogGames = async () => {
      try {
        setIsLoadingGames(true);
        const catalogGames = await API.listCatalogGames();
        const mapped = catalogGames.map((game: any) => ({
          id: game.catalog_game_id,
          catalogGameId: game.catalog_game_id,
          title: game.name,
          description: game.description,
          imageUrl: game.image_url || '/placeholder.svg',
          monthlyPrice: game.min_retail_price_gbp || 0,
          rating: game.avg_rating || 0,
          players: `${game.min_players || 1}-${game.max_players || 4}`,
          duration: game.play_time_minutes ? `${game.play_time_minutes}` : '60',
          difficulty: 'Medium' as const,
          availability: 'available' as const,
        }));
        setAllGames(mapped);
      } catch (error) {
        console.error('Failed to load catalog games:', error);
        toast.error('Failed to load game catalog');
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchCatalogGames();
  }, []);

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allGames
      .filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6);
  }, [searchQuery]);

  // Calculate rental price based on game's base price and condition
  const calculatedRentalPrice = useMemo(() => {
    if (!selectedGame) return 0;
    const basePrice = selectedGame.monthlyPrice;
    const multiplier = conditionMultipliers[condition];
    // Reduce price if incomplete or missing manual
    let adjustedPrice = basePrice * multiplier;
    if (!isComplete) adjustedPrice *= 0.9;
    if (!hasManual) adjustedPrice *= 0.95;
    return Math.round(adjustedPrice * 100) / 100;
  }, [selectedGame, condition, isComplete, hasManual]);

  // Calculate sell price as half of average online retail price
  // Retail price is estimated as ~5x the monthly rental (industry standard ratio)
  const calculatedSellPrice = useMemo(() => {
    if (!selectedGame) return 0;
    const estimatedRetailPrice = selectedGame.monthlyPrice * 5;
    return Math.round((estimatedRetailPrice / 2) * 100) / 100;
  }, [selectedGame]);

  const handleSelectGame = (game: GameCardProps) => {
    setSelectedGame(game);
    setSearchQuery(game.title);
    setShowResults(false);
  };

  const handleClearSelection = () => {
    setSelectedGame(null);
    setSearchQuery("");
  };

  const handleSubmit = async () => {
    if (!selectedGame) {
      toast.error("Please select a game");
      return;
    }
    
    if (!isComplete) {
      toast.error("Games must have all pieces included to be listed");
      return;
    }

    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to add a game");
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const gameData = {
        catalog_game_id: selectedGame.catalogGameId || selectedGame.id,
        owner_id: user.id,
        rental_price: calculatedRentalPrice,
        condition: condition.charAt(0).toUpperCase() + condition.slice(1), // Capitalize: Excellent, Good, Fair
        is_complete: isComplete,
        has_manual: hasManual,
        sell_after_rent: sellAfterRent,
        sell_price: sellAfterRent ? calculatedSellPrice : null,
        available: true,
        notes: `Added via frontend - ${condition} condition`
      };

      const response = await API.createGame(gameData);
      toast.success("Game added successfully!");
      navigate("/lender");
    } catch (error: any) {
      console.error("Failed to add game:", error);
      toast.error(error.message || "Failed to add game. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate("/lender")} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors" disabled={isSubmitting}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Add a Game</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Game Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Label className="text-sm font-medium mb-2 block">Search for a game</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Start typing a game name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
                if (selectedGame && e.target.value !== selectedGame.title) {
                  setSelectedGame(null);
                }
              }}
              onFocus={() => setShowResults(true)}
              className="h-12 pl-10 pr-10"
              disabled={isSubmitting}
            />
            {selectedGame && (
              <button
                onClick={handleClearSelection}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            
            {/* Autocomplete Results */}
            {showResults && filteredGames.length > 0 && !selectedGame && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20">
                {filteredGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{game.title}</p>
                      <p className="text-xs text-muted-foreground">{game.players} players • {game.duration} min</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Selected Game Preview */}
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={selectedGame.imageUrl}
                    alt={selectedGame.title}
                    className="w-24 h-32 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{selectedGame.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedGame.players} players • {selectedGame.duration} min • {selectedGame.difficulty}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {selectedGame.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Condition Selection */}
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label className="text-sm font-medium mb-3 block">Game Condition</Label>
            <RadioGroup value={condition} onValueChange={(val) => setCondition(val as typeof condition)} className="space-y-3">
              <Card className={`cursor-pointer transition-all ${condition === "excellent" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <div className="flex-1">
                    <Label htmlFor="excellent" className="font-medium cursor-pointer">Excellent</Label>
                    <p className="text-xs text-muted-foreground">Like new, minimal signs of use</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={`cursor-pointer transition-all ${condition === "good" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="good" id="good" />
                  <div className="flex-1">
                    <Label htmlFor="good" className="font-medium cursor-pointer">Good</Label>
                    <p className="text-xs text-muted-foreground">Normal wear, fully playable</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={`cursor-pointer transition-all ${condition === "fair" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="fair" id="fair" />
                  <div className="flex-1">
                    <Label htmlFor="fair" className="font-medium cursor-pointer">Fair</Label>
                    <p className="text-xs text-muted-foreground">Visible wear, still playable</p>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>
          </motion.div>
        )}

        {/* Completeness */}
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <Label className="text-sm font-medium block">Completeness</Label>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground">All pieces included</p>
                <p className="text-xs text-muted-foreground">Game is complete with no missing parts</p>
              </div>
              <Switch checked={isComplete} onCheckedChange={setIsComplete} />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground">Manual included</p>
                <p className="text-xs text-muted-foreground">Original instruction manual</p>
              </div>
              <Switch checked={hasManual} onCheckedChange={setHasManual} />
            </div>
          </motion.div>
        )}

        {/* Pricing Display */}
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Monthly Rental Price</h3>
                  <span className="text-2xl font-bold text-primary">£{calculatedRentalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Price set by Switchboard based on game popularity, condition, and completeness.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sell After Rent Option */}
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="p-4 bg-muted/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Open to sell after rent</p>
                  <p className="text-xs text-muted-foreground">Let renters buy this game</p>
                </div>
                <Switch checked={sellAfterRent} onCheckedChange={setSellAfterRent} />
              </div>

              {sellAfterRent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-3 border-t border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Sell Price</p>
                      <p className="text-xs text-muted-foreground">50% of avg. retail price</p>
                    </div>
                    <span className="text-xl font-bold text-accent">£{calculatedSellPrice.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={handleSubmit} 
              className="w-full h-12" 
              size="lg"
              disabled={!isComplete || isSubmitting}
            >
              <Check className="h-5 w-5 mr-2" />
              {isSubmitting ? "Adding..." : "Add Game"}
            </Button>
            {!isComplete && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Games must have all pieces included to be listed
              </p>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Search for a game above to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddGame;