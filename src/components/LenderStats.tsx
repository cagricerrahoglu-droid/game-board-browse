import { Gamepad2, RotateCcw, TrendingUp, Trophy } from "lucide-react";

interface StatsData {
  gamesListed: number;
  activeRentals: number;
  earningsThisMonth: number;
  lifetimeEarnings: number;
}

interface LenderStatsProps {
  stats: StatsData;
}

const LenderStats = ({ stats }: LenderStatsProps) => {
  const statItems = [
    {
      label: "Games Listed",
      value: stats.gamesListed.toString(),
      icon: Gamepad2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Rentals",
      value: stats.activeRentals.toString(),
      icon: RotateCcw,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "This Month",
      value: `£${stats.earningsThisMonth.toFixed(0)}`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Lifetime",
      value: `£${stats.lifetimeEarnings.toFixed(0)}`,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card rounded-2xl p-4 shadow-[var(--card-shadow)] border border-border/50 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LenderStats;
