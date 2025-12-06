import { Users, Calendar, Clock, Gauge, ChevronDown } from "lucide-react";
import FilterChip from "./FilterChip";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const filters = [
  { id: "players", icon: Users, label: "Players" },
  { id: "age", icon: Calendar, label: "Age" },
  { id: "duration", icon: Clock, label: "Duration" },
  { id: "difficulty", icon: Gauge, label: "Difficulty" },
];

const ageRanges = [
  { id: "under-8", label: "Under 8" },
  { id: "8-12", label: "8-12" },
  { id: "12+", label: "12+" },
];

const durationRanges = [
  { id: "under-30", label: "<30 mins" },
  { id: "30-60", label: "30-60 mins" },
  { id: "60+", label: "60+ mins" },
];

const difficultyLevels = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "difficult", label: "Difficult" },
];

const playerCounts = [
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

const FiltersSection = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string | null>(null);

  const handleAgeSelect = (ageId: string) => {
    setSelectedAge(selectedAge === ageId ? null : ageId);
    setActiveFilter(selectedAge === ageId ? null : "age");
  };

  const handleDurationSelect = (durationId: string) => {
    setSelectedDuration(selectedDuration === durationId ? null : durationId);
    setActiveFilter(selectedDuration === durationId ? null : "duration");
  };

  const handleDifficultySelect = (difficultyId: string) => {
    setSelectedDifficulty(selectedDifficulty === difficultyId ? null : difficultyId);
    setActiveFilter(selectedDifficulty === difficultyId ? null : "difficulty");
  };

  const handlePlayersSelect = (playersId: string) => {
    setSelectedPlayers(selectedPlayers === playersId ? null : playersId);
    setActiveFilter(selectedPlayers === playersId ? null : "players");
  };

  return (
    <section className="px-4 py-3">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {filters.map((filter) => {
            if (filter.id === "players") {
              return (
                <Popover key={filter.id}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full",
                        "font-medium text-sm whitespace-nowrap",
                        "transition-all duration-200 ease-out",
                        "border-2",
                        selectedPlayers
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted"
                      )}
                    >
                      <Users className="w-4 h-4" />
                      <span>{selectedPlayers ? `${selectedPlayers} Players` : "Players"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2" align="start">
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                      {playerCounts.map((count) => (
                        <button
                          key={count.id}
                          onClick={() => handlePlayersSelect(count.id)}
                          className={cn(
                            "px-3 py-2 text-sm rounded-lg text-left transition-colors",
                            selectedPlayers === count.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {count.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            if (filter.id === "age") {
              return (
                <Popover key={filter.id}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full",
                        "font-medium text-sm whitespace-nowrap",
                        "transition-all duration-200 ease-out",
                        "border-2",
                        selectedAge
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted"
                      )}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{selectedAge ? ageRanges.find(a => a.id === selectedAge)?.label : "Age"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2" align="start">
                    <div className="flex flex-col gap-1">
                      {ageRanges.map((age) => (
                        <button
                          key={age.id}
                          onClick={() => handleAgeSelect(age.id)}
                          className={cn(
                            "px-3 py-2 text-sm rounded-lg text-left transition-colors",
                            selectedAge === age.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {age.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            if (filter.id === "duration") {
              return (
                <Popover key={filter.id}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full",
                        "font-medium text-sm whitespace-nowrap",
                        "transition-all duration-200 ease-out",
                        "border-2",
                        selectedDuration
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted"
                      )}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{selectedDuration ? durationRanges.find(d => d.id === selectedDuration)?.label : "Duration"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2" align="start">
                    <div className="flex flex-col gap-1">
                      {durationRanges.map((duration) => (
                        <button
                          key={duration.id}
                          onClick={() => handleDurationSelect(duration.id)}
                          className={cn(
                            "px-3 py-2 text-sm rounded-lg text-left transition-colors",
                            selectedDuration === duration.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {duration.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            if (filter.id === "difficulty") {
              return (
                <Popover key={filter.id}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full",
                        "font-medium text-sm whitespace-nowrap",
                        "transition-all duration-200 ease-out",
                        "border-2",
                        selectedDifficulty
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted"
                      )}
                    >
                      <Gauge className="w-4 h-4" />
                      <span>{selectedDifficulty ? difficultyLevels.find(d => d.id === selectedDifficulty)?.label : "Difficulty"}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2" align="start">
                    <div className="flex flex-col gap-1">
                      {difficultyLevels.map((difficulty) => (
                        <button
                          key={difficulty.id}
                          onClick={() => handleDifficultySelect(difficulty.id)}
                          className={cn(
                            "px-3 py-2 text-sm rounded-lg text-left transition-colors",
                            selectedDifficulty === difficulty.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {difficulty.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }
            
            return (
              <FilterChip
                key={filter.id}
                icon={filter.icon}
                label={filter.label}
                isActive={activeFilter === filter.id}
                onClick={() =>
                  setActiveFilter(activeFilter === filter.id ? null : filter.id)
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;