import { Users, Calendar, Clock, Gauge, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const ageRanges = [
  { id: "under-8", label: "Under 8" },
  { id: "8-12", label: "8-12" },
  { id: "12+", label: "12+" },
];

export const durationRanges = [
  { id: "under-30", label: "<30 mins" },
  { id: "30-60", label: "30-60 mins" },
  { id: "60+", label: "60+ mins" },
];

export const difficultyLevels = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "difficult", label: "Difficult" },
];

export const playerCounts = [
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
  { id: "6", label: "6" },
  { id: "7", label: "7" },
  { id: "8", label: "8" },
  { id: "9", label: "9" },
  { id: "10+", label: "10+" },
];

export interface FilterState {
  players: string | null;
  age: string | null;
  duration: string | null;
  difficulty: string | null;
}

interface FiltersSectionProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FiltersSection = ({ filters, onFiltersChange }: FiltersSectionProps) => {
  const handlePlayersSelect = (playersId: string) => {
    onFiltersChange({
      ...filters,
      players: filters.players === playersId ? null : playersId,
    });
  };

  const handleAgeSelect = (ageId: string) => {
    onFiltersChange({
      ...filters,
      age: filters.age === ageId ? null : ageId,
    });
  };

  const handleDurationSelect = (durationId: string) => {
    onFiltersChange({
      ...filters,
      duration: filters.duration === durationId ? null : durationId,
    });
  };

  const handleDifficultySelect = (difficultyId: string) => {
    onFiltersChange({
      ...filters,
      difficulty: filters.difficulty === difficultyId ? null : difficultyId,
    });
  };

  const FilterButton = ({
    icon: Icon,
    label,
    isActive,
    children,
  }: {
    icon: typeof Users;
    label: string;
    isActive: boolean;
    children: React.ReactNode;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full",
            "font-semibold text-sm whitespace-nowrap",
            "transition-all duration-300 ease-out",
            "border-2 active:scale-95",
            isActive
              ? "bg-primary text-primary-foreground border-primary shadow-glow"
              : "bg-card text-foreground border-border/60 hover:border-primary/40 hover:bg-muted/50 shadow-soft"
          )}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            isActive && "rotate-180"
          )} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 rounded-xl shadow-card-hover border-border/60" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );

  const FilterOption = ({
    isSelected,
    onClick,
    label,
  }: {
    isSelected: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-3 py-2.5 text-sm rounded-lg text-left font-medium transition-all duration-200",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-foreground"
      )}
    >
      {label}
    </button>
  );

  return (
    <section className="px-5 py-4">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3">
          <FilterButton
            icon={Users}
            label={filters.players ? `${filters.players} Players` : "Players"}
            isActive={!!filters.players}
          >
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {playerCounts.map((count) => (
                <FilterOption
                  key={count.id}
                  isSelected={filters.players === count.id}
                  onClick={() => handlePlayersSelect(count.id)}
                  label={count.label}
                />
              ))}
            </div>
          </FilterButton>

          <FilterButton
            icon={Calendar}
            label={filters.age ? ageRanges.find(a => a.id === filters.age)?.label || "Age" : "Age"}
            isActive={!!filters.age}
          >
            <div className="flex flex-col gap-1">
              {ageRanges.map((age) => (
                <FilterOption
                  key={age.id}
                  isSelected={filters.age === age.id}
                  onClick={() => handleAgeSelect(age.id)}
                  label={age.label}
                />
              ))}
            </div>
          </FilterButton>

          <FilterButton
            icon={Clock}
            label={filters.duration ? durationRanges.find(d => d.id === filters.duration)?.label || "Duration" : "Duration"}
            isActive={!!filters.duration}
          >
            <div className="flex flex-col gap-1">
              {durationRanges.map((duration) => (
                <FilterOption
                  key={duration.id}
                  isSelected={filters.duration === duration.id}
                  onClick={() => handleDurationSelect(duration.id)}
                  label={duration.label}
                />
              ))}
            </div>
          </FilterButton>

          <FilterButton
            icon={Gauge}
            label={filters.difficulty ? difficultyLevels.find(d => d.id === filters.difficulty)?.label || "Difficulty" : "Difficulty"}
            isActive={!!filters.difficulty}
          >
            <div className="flex flex-col gap-1">
              {difficultyLevels.map((difficulty) => (
                <FilterOption
                  key={difficulty.id}
                  isSelected={filters.difficulty === difficulty.id}
                  onClick={() => handleDifficultySelect(difficulty.id)}
                  label={difficulty.label}
                />
              ))}
            </div>
          </FilterButton>
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
