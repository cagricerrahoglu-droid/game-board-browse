import GameCard, { GameCardProps } from "./GameCard";

interface VerticalGameListProps {
  title: string;
  games: GameCardProps[];
}

const VerticalGameList = ({ title, games }: VerticalGameListProps) => {
  return (
    <section className="flex flex-col gap-4 px-4 pb-24">
      <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <GameCard {...game} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerticalGameList;
