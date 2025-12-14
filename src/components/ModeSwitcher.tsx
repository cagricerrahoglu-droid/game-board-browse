import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface ModeSwitcherProps {
  mode: "renter" | "lister";
  onSwitch: () => void;
}

const ModeSwitcher = ({ mode, onSwitch }: ModeSwitcherProps) => {
  return (
    <motion.button
      onClick={onSwitch}
      className="fixed bottom-24 right-4 z-40 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <RefreshCw className="h-4 w-4" />
      <span className="text-sm">
        Switch to {mode === "renter" ? "Lister" : "Renter"}
      </span>
    </motion.button>
  );
};

export default ModeSwitcher;
