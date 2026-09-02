import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game/GameCard";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-muted/40 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mb-6">
            Practice Game-Based Aptitude Before the Real Test
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Free interactive simulations designed to help you build speed, accuracy, memory and spatial reasoning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/practice">Start Practicing</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/mock">Take Full Mock</Link>
            </Button>
          </div>
          <div className="mt-8 flex gap-6 text-sm text-muted-foreground flex-wrap justify-center">
            <div className="flex items-center gap-2">✓ Free practice</div>
            <div className="flex items-center gap-2">✓ No signup required</div>
            <div className="flex items-center gap-2">✓ Timed simulations</div>
            <div className="flex items-center gap-2">✓ Performance tracking</div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="w-full py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Practice Games</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simulations based on reported current patterns for cognitive assessment tests.
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
      </section>
    </div>
  );
}
