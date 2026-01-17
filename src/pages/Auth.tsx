import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dice5, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupRoles, setSignupRoles] = useState<string[]>(["renter", "lender"]);
  const [signinRole, setSigninRole] = useState("renter");
  const navigate = useNavigate();
  const { login, signup, isLoading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isLogin && signupRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password, signinRole);
        toast.success("Welcome back!");
        // Redirect to lender dashboard if signing in as lender
        navigate(signinRole === "lender" ? "/lender" : "/");
      } else {
        await signup(email, password, signupRoles);
        toast.success("Account created successfully! Check your email for verification code.");
        // Store email for confirmation page and redirect
        localStorage.setItem('switchboard_pending_email', email);
        navigate("/confirm");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || authLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-5 py-4">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-2.5 bg-primary rounded-2xl shadow-soft">
              <Dice5 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              SwitchBoard
            </h1>
          </button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center p-5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to access your game library" 
                : "Join SwitchBoard and start playing today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              {!isLogin && (
                <div className="space-y-3 pt-2">
                  <Label>What would you like to do?</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="renter"
                        checked={signupRoles.includes("renter")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSignupRoles([...signupRoles, "renter"]);
                          } else {
                            setSignupRoles(signupRoles.filter(r => r !== "renter"));
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="renter" className="font-normal cursor-pointer">
                        Rent games from others
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lender"
                        checked={signupRoles.includes("lender")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSignupRoles([...signupRoles, "lender"]);
                          } else {
                            setSignupRoles(signupRoles.filter(r => r !== "lender"));
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="lender" className="font-normal cursor-pointer">
                        Lend your games to others
                      </Label>
                    </div>
                  </div>
                </div>
              )}
              {isLogin && (
                <div className="space-y-3 pt-2">
                  <Label>Sign in as</Label>
                  <RadioGroup value={signinRole} onValueChange={setSigninRole} disabled={isSubmitting}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="renter" id="signin-renter" disabled={isSubmitting} />
                      <Label htmlFor="signin-renter" className="font-normal cursor-pointer">
                        Renter
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lender" id="signin-lender" disabled={isSubmitting} />
                      <Label htmlFor="signin-lender" className="font-normal cursor-pointer">
                        Lender
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isSubmitting}
                className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Auth;