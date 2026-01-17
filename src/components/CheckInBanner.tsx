import { motion, AnimatePresence } from "framer-motion";
import { Dice5, X } from "lucide-react";
import { useCheckIn } from "@/contexts/CheckInContext";

const CheckInBanner = () => {
  const { pendingCheckIns, openCheckInModal, removePendingCheckIn } = useCheckIn();

  if (pendingCheckIns.length === 0) return null;

  const latestCheckIn = pendingCheckIns[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <div
          onClick={() => openCheckInModal(latestCheckIn)}
          className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              removePendingCheckIn(latestCheckIn.rentalId);
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Dice5 className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base">
                Your game has arrived 🎲
              </p>
              <p className="text-sm opacity-90 truncate">
                Check in <span className="font-medium">{latestCheckIn.gameName}</span> to confirm everything's OK
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckInBanner;
