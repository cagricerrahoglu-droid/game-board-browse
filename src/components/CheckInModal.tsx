import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Package, Puzzle, BookOpen, AlertCircle, Box, Wind, Clock, PackageOpen, HelpCircle, Languages, MessageSquare, Check, Sparkles } from "lucide-react";
import { useCheckIn } from "@/contexts/CheckInContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Step = "rating" | "issues" | "confirmation";

interface IssueOption {
  id: string;
  label: string;
  icon: React.ElementType;
  category: string;
}

const issueOptions: IssueOption[] = [
  // Contents & completeness
  { id: "missing_pieces", label: "Missing piece(s)", icon: Puzzle, category: "Contents & completeness" },
  { id: "incorrect_components", label: "Incorrect components", icon: Package, category: "Contents & completeness" },
  { id: "rulebook_issue", label: "Rulebook missing or damaged", icon: BookOpen, category: "Contents & completeness" },
  // Condition
  { id: "bad_condition", label: "Game in bad condition", icon: AlertCircle, category: "Condition" },
  { id: "box_damaged", label: "Box damaged", icon: Box, category: "Condition" },
  { id: "smell_hygiene", label: "Smell / hygiene issue", icon: Wind, category: "Condition" },
  // Delivery & packaging
  { id: "late_arrival", label: "Late arrival", icon: Clock, category: "Delivery & packaging" },
  { id: "packaging_inadequate", label: "Packaging inadequate", icon: PackageOpen, category: "Delivery & packaging" },
  { id: "arrived_opened", label: "Game arrived opened / unsealed", icon: PackageOpen, category: "Delivery & packaging" },
  // Understanding & expectations
  { id: "difficult_understand", label: "Difficult to understand", icon: HelpCircle, category: "Understanding & expectations" },
  { id: "not_as_described", label: "Not as described", icon: AlertCircle, category: "Understanding & expectations" },
  { id: "language_mismatch", label: "Language / version mismatch", icon: Languages, category: "Understanding & expectations" },
  // Other
  { id: "other", label: "Other", icon: MessageSquare, category: "Other" },
];

const CheckInModal = () => {
  const { isCheckInModalOpen, currentCheckIn, closeCheckInModal, completeCheckIn } = useCheckIn();
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleRatingSelect = (value: number) => {
    setRating(value);
    // Auto-advance after a brief delay
    setTimeout(() => {
      if (value === 5) {
        handleSubmit(value);
      } else {
        setStep("issues");
      }
    }, 300);
  };

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = (finalRating?: number) => {
    if (!currentCheckIn) return;
    
    completeCheckIn({
      rentalId: currentCheckIn.rentalId,
      gameName: currentCheckIn.gameName,
      gameImage: currentCheckIn.gameImage,
      rating: finalRating ?? rating,
      issues: selectedIssues,
      otherIssueText: selectedIssues.includes("other") ? otherText : undefined,
    });
    
    setStep("confirmation");
  };

  const handleClose = () => {
    closeCheckInModal();
    // Reset state after animation
    setTimeout(() => {
      setStep("rating");
      setRating(0);
      setSelectedIssues([]);
      setOtherText("");
      setHoveredStar(0);
    }, 300);
  };

  const handleStartPlaying = () => {
    handleClose();
  };

  if (!isCheckInModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-lg font-semibold text-foreground">
              {step === "confirmation" ? "All done!" : "Check in your game"}
            </h1>
            {step !== "confirmation" && (
              <button
                onClick={handleClose}
                className="p-2 -mr-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Step: Rating */}
          {step === "rating" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6 py-8"
            >
              <div className="text-center max-w-sm">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  How was the game when it arrived?
                </h2>
                <p className="text-muted-foreground mb-8">
                  {currentCheckIn?.gameName}
                </p>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleRatingSelect(value)}
                      onMouseEnter={() => setHoveredStar(value)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-2 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={cn(
                          "h-12 w-12 transition-colors",
                          (hoveredStar >= value || rating >= value)
                            ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step: Issues */}
          {step === "issues" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0 text-center px-4 pt-6 pb-4">
                <h2 className="text-xl font-bold text-foreground mb-1">
                  What wasn't quite right?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select all that apply
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {issueOptions.map((issue) => {
                    const isSelected = selectedIssues.includes(issue.id);
                    const Icon = issue.icon;
                    return (
                      <button
                        key={issue.id}
                        onClick={() => toggleIssue(issue.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card hover:border-muted-foreground/30"
                        )}
                      >
                        <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                        <span className={cn("text-sm font-medium leading-tight", isSelected ? "text-primary" : "text-foreground")}>
                          {issue.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Other text input */}
                <AnimatePresence>
                  {selectedIssues.includes("other") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <Textarea
                        placeholder="Tell us what happened (optional)"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-shrink-0 px-4 pt-4 pb-6 bg-background border-t border-border">
                <Button
                  onClick={() => handleSubmit()}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  Submit check-in
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Confirmation */}
          {step === "confirmation" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-6 py-8"
            >
              <div className="text-center max-w-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="h-10 w-10 text-secondary" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Thanks! You've checked in this game.
                </h2>
                
                {selectedIssues.length > 0 && (
                  <p className="text-muted-foreground mb-8">
                    This helps us improve quality and protect renters.
                  </p>
                )}

                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={cn(
                        "h-6 w-6",
                        rating >= value
                          ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleStartPlaying}
                  className="w-full h-12 text-base font-semibold gap-2"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Start playing
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckInModal;
