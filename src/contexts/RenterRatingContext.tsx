import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API } from "@/services/api";

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
  refetchRating: () => Promise<void>;
}

const RenterRatingContext = createContext<RenterRatingContextType | undefined>(undefined);

const MIN_RENTALS_FOR_RATING = 3;

export const RenterRatingProvider = ({ children }: { children: ReactNode }) => {
  const [renterRating, setRenterRating] = useState<RenterRatingData>(() => {
    const stored = localStorage.getItem("renter_rating_data");
    if (stored) {
      return JSON.parse(stored);
    }
    // Default data until backend loads
    return {
      averageRating: 5.0,
      totalRatings: 0,
      hasSeenRatingBanner: false,
    };
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch rating from backend
  const fetchRating = async () => {
    try {
      const userId = API.getCurrentUserId();
      if (!userId || !API.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      const ratingData = await API.getUserRating(userId);
      const stored = localStorage.getItem("renter_rating_data");
      const hasSeenBanner = stored ? JSON.parse(stored).hasSeenRatingBanner : false;

      setRenterRating({
        averageRating: ratingData.averageRating,
        totalRatings: ratingData.totalRatings,
        hasSeenRatingBanner: hasSeenBanner
      });
    } catch (error) {
      console.error('Failed to fetch renter rating:', error);
      // Keep default values if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchRating();
  }, []);

  const isRatingVisible = renterRating.totalRatings >= MIN_RENTALS_FOR_RATING;
  const showFirstTimeBanner = isRatingVisible && !renterRating.hasSeenRatingBanner && !isLoading;

  // Persist banner dismissal to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("renter_rating_data");
    const storedData = stored ? JSON.parse(stored) : {};
    localStorage.setItem("renter_rating_data", JSON.stringify({
      ...storedData,
      hasSeenRatingBanner: renterRating.hasSeenRatingBanner
    }));
  }, [renterRating.hasSeenRatingBanner]);

  const dismissBanner = () => {
    setRenterRating((prev) => ({ ...prev, hasSeenRatingBanner: true }));
  };

  const refetchRating = async () => {
    await fetchRating();
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
        refetchRating,
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
