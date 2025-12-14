import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useBasket } from "@/contexts/BasketContext";

interface NavItem {
  icon: typeof Search;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Browse", path: "/browse" },
  { icon: Heart, label: "Favourites", path: "/favourites" },
  { icon: ShoppingCart, label: "Basket", path: "/basket" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount } = useBasket();
  const basketCount = getItemCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-background/95 backdrop-blur-xl shadow-nav border-t border-border/30 safe-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl",
                "transition-all duration-300 ease-out",
                "active:scale-90",
                isActive
                  ? "text-nav-active"
                  : "text-nav-inactive hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative p-2 rounded-xl transition-all duration-300 ease-out",
                  isActive && "bg-primary/12 shadow-glow"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive && item.icon === Heart ? "currentColor" : "none"}
                />
                {item.label === "Basket" && basketCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1">
                    {basketCount > 99 ? "99+" : basketCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-semibold tracking-wide",
                isActive && "font-bold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
