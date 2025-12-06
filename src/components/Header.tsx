import { Dice5 } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-2xl shadow-soft transition-transform hover:scale-105 active:scale-95">
            <Dice5 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            SwitchBoard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium px-3 py-1.5 bg-muted/60 rounded-full">
            Welcome back! 👋
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
