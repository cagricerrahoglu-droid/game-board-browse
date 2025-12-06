import { Users, Calendar, Clock, Gauge } from "lucide-react";
import FilterChip from "./FilterChip";
import { useState } from "react";

const filters = [
  { id: "players", icon: Users, label: "Players" },
  { id: "age", icon: Calendar, label: "Age" },
  { id: "duration", icon: Clock, label: "Duration" },
  { id: "difficulty", icon: Gauge, label: "Difficulty" },
];

const FiltersSection = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <section className="px-4 py-3">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              icon={filter.icon}
              label={filter.label}
              isActive={activeFilter === filter.id}
              onClick={() =>
                setActiveFilter(activeFilter === filter.id ? null : filter.id)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
