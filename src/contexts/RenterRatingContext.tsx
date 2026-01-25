import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RenterRatingData {
  averageRating: number;
  totalRatings: number;
  hasSeenRatingBanner: boolean;
}

interface RenterRatingContextType {
  renterRating: RenterRatingData;
  isRatingVisible: boolean;
  showFirstTimeBanner: boolean;
  dismissBanner: () => void;
  getRatingMessage: () => { title: string; message: string; tone: "high" | "medium" | "low" };
}

const RenterRatingContext = createContext<RenterRatingContextType | undefined>(undefined);

const MIN_RENTALS_FOR_RATING = 3;

export const RenterRatingProvider = ({ children }: { children: ReactNode }) => {
  const [renterRating, setRenterRating] = useState<RenterRatingData>(() => {
    const stored = localStorage.getItem("renter_rating_data");
    if (stored) {
      return JSON.parse(stored);
    }
    // Demo data: 4 completed rentals with ratings from lenders
    return {
      averageRating: 4.3,
      totalRatings: 4,
      hasSeenRatingBanner: false,
    };
  });

  const isRatingVisible = renterRating.totalRatings >= MIN_RENTALS_FOR_RATING;
  const showFirstTimeBanner = isRatingVisible && !renterRating.hasSeenRatingBanner;

  useEffect(() => {
    localStorage.setItem("renter_rating_data", JSON.stringify(renterRating));
  }, [renterRating]);

  const dismissBanner = () => {
    setRenterRating((prev) => ({ ...prev, hasSeenRatingBanner: true }));
  };

  const getRatingMessage = (): { title: string; message: string; tone: "high" | "medium" | "low" } => {
    const rating = renterRating.averageRating;
    
    if (rating >= 4.5) {
      return {
        title: "Excellent renter!",
        message: "You're a top-rated renter. Lenders love working with you — keep up the great care!",
        tone: "high",
      };
    } else if (rating >= 3.5) {
      return {
        title: "Good standing",
        message: "You're doing well! Returning games on time and in good condition helps maintain your rating.",
        tone: "medium",
      };
    } else if (rating >= 2.5) {
      return {
        title: "Room for improvement",
        message: "Consider returning games earlier and handling them with extra care to improve your rating.",
        tone: "medium",
      };
    } else {
      return {
        title: "Let's work on this together",
        message: "Your rating is lower than average. Timely returns and careful handling will help you build trust with lenders.",
        tone: "low",
      };
    }
  };

  return (
    <RenterRatingContext.Provider
      value={{
        renterRating,
        isRatingVisible,
        showFirstTimeBanner,
        dismissBanner,
        getRatingMessage,
      }}
    >
      {children}
    </RenterRatingContext.Provider>
  );
};

export const useRenterRating = () => {
  const context = useContext(RenterRatingContext);
  if (!context) {
    throw new Error("useRenterRating must be used within a RenterRatingProvider");
  }
  return context;
};
