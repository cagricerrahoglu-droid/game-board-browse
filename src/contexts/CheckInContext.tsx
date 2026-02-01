import { createContext, useContext, useState, ReactNode } from "react";

export interface CheckInData {
  rentalId: number;
  gameName: string;
  gameImage?: string;
  rating: number;
  issues: string[];
  otherIssueText?: string;
  checkedInAt: string;
}

interface PendingCheckIn {
  rentalId: number;
  gameName: string;
  gameImage?: string;
  arrivedAt: string;
}

interface CheckInContextType {
  pendingCheckIns: PendingCheckIn[];
  completedCheckIns: CheckInData[];
  currentCheckIn: PendingCheckIn | null;
  isCheckInModalOpen: boolean;
  addPendingCheckIn: (checkIn: PendingCheckIn) => void;
  removePendingCheckIn: (rentalId: number) => void;
  openCheckInModal: (checkIn: PendingCheckIn) => void;
  closeCheckInModal: () => void;
  completeCheckIn: (data: Omit<CheckInData, "checkedInAt">) => void;
  getCheckInForRental: (rentalId: number) => CheckInData | undefined;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export const CheckInProvider = ({ children }: { children: ReactNode }) => {
  const [pendingCheckIns, setPendingCheckIns] = useState<PendingCheckIn[]>([]);
  const [completedCheckIns, setCompletedCheckIns] = useState<CheckInData[]>(() => {
    const stored = localStorage.getItem("completed_check_ins");
    return stored ? JSON.parse(stored) : [
      // Demo completed check-ins for past rentals
      { rentalId: 101, gameName: "Pandemic", rating: 5, issues: [], checkedInAt: "2025-11-20" },
      { rentalId: 102, gameName: "Codenames", rating: 4, issues: ["Late arrival"], checkedInAt: "2025-11-05" },
    ];
  });
  const [currentCheckIn, setCurrentCheckIn] = useState<PendingCheckIn | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const addPendingCheckIn = (checkIn: PendingCheckIn) => {
    setPendingCheckIns((prev) => [...prev, checkIn]);
  };

  const removePendingCheckIn = (rentalId: number) => {
    setPendingCheckIns((prev) => prev.filter((c) => c.rentalId !== rentalId));
  };

  const openCheckInModal = (checkIn: PendingCheckIn) => {
    setCurrentCheckIn(checkIn);
    setIsCheckInModalOpen(true);
  };

  const closeCheckInModal = () => {
    setIsCheckInModalOpen(false);
    setCurrentCheckIn(null);
  };

  const completeCheckIn = (data: Omit<CheckInData, "checkedInAt">) => {
    const checkInData: CheckInData = {
      ...data,
      checkedInAt: new Date().toISOString(),
    };
    const newCompleted = [...completedCheckIns, checkInData];
    setCompletedCheckIns(newCompleted);
    localStorage.setItem("completed_check_ins", JSON.stringify(newCompleted));
    removePendingCheckIn(data.rentalId);
    closeCheckInModal();
  };

  const getCheckInForRental = (rentalId: number) => {
    return completedCheckIns.find((c) => c.rentalId === rentalId);
  };

  return (
    <CheckInContext.Provider
      value={{
        pendingCheckIns,
        completedCheckIns,
        currentCheckIn,
        isCheckInModalOpen,
        addPendingCheckIn,
        removePendingCheckIn,
        openCheckInModal,
        closeCheckInModal,
        completeCheckIn,
        getCheckInForRental,
      }}
    >
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error("useCheckIn must be used within a CheckInProvider");
  }
  return context;
};
