import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Truck, Info, ShieldCheck, XCircle, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/contexts/BasketContext";
import BasketItemCard from "@/components/BasketItemCard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DELIVERY_FEE = 3.99;

const Basket = () => {
  const navigate = useNavigate();
  const { items, removeFromBasket, getSubtotal } = useBasket();

  const subtotal = getSubtotal();
  const total = subtotal + DELIVERY_FEE;

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="px-5 py-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </header>

        {/* Empty State Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-6xl">🎲</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Your basket is empty… for now!
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Browse games and add one to get started.
          </p>
          <Button
            onClick={() => navigate("/browse")}
            className="rounded-full px-8"
            size="lg"
          >
            Browse games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl px-5 py-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="mt-2">
          <h1 className="font-display text-2xl font-bold text-foreground">Your Basket</h1>
          <p className="text-muted-foreground text-sm">Almost game night 🎲</p>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Basket Items */}
        <section className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <BasketItemCard item={item} onRemove={removeFromBasket} />
            </div>
          ))}
        </section>

        {/* Delivery Summary */}
        <section className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Home delivery</p>
                <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  123 Game Street, London
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="text-primary text-sm font-medium hover:underline"
            >
              Change
            </button>
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="bg-card rounded-2xl p-4 shadow-soft border border-border/50 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({items.length} game{items.length > 1 ? "s" : ""})</span>
            <span className="text-foreground font-medium">£{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery fee</span>
            <span className="text-foreground font-medium">£{DELIVERY_FEE.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              Damage protection
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-primary">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>All rentals include damage protection covering accidental spills, torn cards, and lost pieces up to £50.</p>
                </TooltipContent>
              </Tooltip>
            </span>
            <span className="text-emerald-600 font-medium">Included</span>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Late returns are charged at the daily rate. We'll send you reminders before your rental ends.</p>
          </div>

          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-display font-bold text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-foreground">£{total.toFixed(2)}</span>
          </div>
        </section>

        {/* Trust & Reassurance */}
        <section className="flex justify-center gap-6 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cleaned & checked</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel before dispatch</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure payments</span>
          </div>
        </section>
      </main>

      {/* Sticky Footer CTAs */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 px-5 py-4 space-y-3">
        <Button
          onClick={() => navigate("/checkout")}
          className="w-full rounded-full font-display font-semibold"
          size="lg"
        >
          Proceed to checkout
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="w-full text-muted-foreground"
        >
          Continue browsing
        </Button>
      </div>
    </div>
  );
};

export default Basket;
