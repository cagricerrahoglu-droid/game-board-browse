import { Dice5, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    logout,
    selectedRole,
    switchRole
  } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleSwitchRole = () => {
    if (selectedRole === "renter") {
      switchRole("lender");
      navigate("/lender-home");
    } else {
      switchRole("renter");
      navigate("/");
    }
  };

  // Only show toggle on home pages
  const showRoleToggle = isLoggedIn && (location.pathname === "/" || location.pathname === "/lender-home");
  return <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-2xl shadow-soft transition-transform hover:scale-105 active:scale-95">
            <Dice5 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            SwitchBoard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Toggle - Right aligned */}
          {showRoleToggle && <button onClick={handleSwitchRole} className="relative flex items-center bg-muted rounded-full p-0.5 w-28 h-8">
              <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
                <span className={selectedRole === "renter" ? "text-primary-foreground z-10" : "text-muted-foreground"}>
                  Renter
                </span>
                <span className={selectedRole === "lender" ? "text-primary-foreground z-10" : "text-muted-foreground"}>
                  Lender
                </span>
              </div>
              <div className="absolute w-[calc(50%-2px)] h-7 bg-primary rounded-full transition-all duration-300" style={{
            [selectedRole === "lender" ? "right" : "left"]: "2px"
          }} />
            </button>}

          {!isLoggedIn && <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth?mode=login")}>
              Log In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth?mode=signup")}>
              Sign Up
            </Button>
          </>}
        </div>
      </div>
    </header>;
};
export default Header;