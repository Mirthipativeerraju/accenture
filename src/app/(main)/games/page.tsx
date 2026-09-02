import { GameCard } from "@/components/game/GameCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Games</h1>
        <p className="text-muted-foreground max-w-3xl">
          Choose a game to focus on specific cognitive skills. Each game offers multiple difficulty levels and practice modes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard 
          id="memory-maze"
          title="Memory Maze"
          description="Memorize the grid, then navigate to collect keys and reach the exit while avoiding hidden walls."
          skills={["Working Memory", "Spatial Navigation"]}
          difficulty="Variable"
        />
        <GameCard 
          id="bubble-math"
          title="Bubble Math"
          description="Rapidly calculate expressions and select the correct bubbles in ascending order under time pressure."
          skills={["Numerical Dexterity", "Processing Speed"]}
          difficulty="Variable"
        />
        <GameCard 
          id="path-finder"
          title="Path Finder"
          description="Rotate logical path tiles to connect the start and end points as efficiently as possible."
          skills={["Logical Reasoning", "Spatial Planning"]}
          difficulty="Variable"
        />
      </div>
    </div>
  );
}
