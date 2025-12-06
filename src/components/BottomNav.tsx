import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Search;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Search, label: "Browse", path: "/" },
  { icon: Heart, label: "Favourites", path: "/favourites" },
  { icon: ShoppingCart, label: "Basket", path: "/basket" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-background shadow-nav safe-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl",
                "transition-all duration-200",
                isActive
                  ? "text-nav-active"
                  : "text-nav-inactive hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                "text-xs font-medium",
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
