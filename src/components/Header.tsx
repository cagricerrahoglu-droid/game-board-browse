import { Dice5 } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-xl">
            <Dice5 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-xl text-foreground">
            SwitchBoard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            Welcome back!
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
