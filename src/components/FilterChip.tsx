import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FilterChipProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const FilterChip = ({ icon: Icon, label, isActive = false, onClick }: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full",
        "font-medium text-sm whitespace-nowrap",
        "transition-all duration-200 ease-out",
        "border-2",
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-md"
          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export default FilterChip;
