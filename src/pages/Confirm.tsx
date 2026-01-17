import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dice5, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Confirm = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { confirm, isLoading: authLoading } = useAuth();

  // Get email from localStorage (set during signup)
  useEffect(() => {
    const pendingEmail = localStorage.getItem('switchboard_pending_email');
    if (!pendingEmail) {
      toast.error("No pending verification found");
      navigate("/auth");
      return;
    }
    setEmail(pendingEmail);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.trim().length === 0) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      await confirm(email, code);
      toast.success("Email verified successfully! Please sign in.");
      // Clear the pending email
      localStorage.removeItem('switchboard_pending_email');
      // Redirect to auth page for login
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Verification failed. Please try again.");
      console.error("Confirmation error:", error);
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
            onClick={() => navigate("/auth")}
            className="gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Confirmation Form */}
      <main className="flex-1 flex items-center justify-center p-5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">
              Verify Your Email
            </CardTitle>
            <CardDescription>
              {email && `Enter the code sent to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter the code from your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Didn't receive a code?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
                onClick={() => {
                  toast.info("Resend code functionality coming soon");
                }}
              >
                Resend Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Confirm;
