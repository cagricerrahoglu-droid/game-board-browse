import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Search;
  label: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { icon: Search, label: "Browse", isActive: true },
  { icon: Heart, label: "Favourites" },
  { icon: ShoppingCart, label: "Basket" },
  { icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-background shadow-nav safe-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 rounded-xl",
              "transition-all duration-200",
              item.isActive
                ? "text-nav-active"
                : "text-nav-inactive hover:text-foreground"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                item.isActive && "bg-primary/10"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  item.isActive && "scale-110"
                )}
                strokeWidth={item.isActive ? 2.5 : 2}
              />
            </div>
            <span className={cn(
              "text-xs font-medium",
              item.isActive && "font-bold"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
