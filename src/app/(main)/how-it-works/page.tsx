import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 prose prose-slate">
      <h1 className="text-3xl font-bold tracking-tight mb-6">How It Works</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Game-Based Cognitive Assessment</h2>
          <p>
            Modern hiring processes often use game-based assessments to measure cognitive abilities rather than traditional Q&A tests. These interactive simulations evaluate how quickly and accurately you process information, solve spatial problems, and utilize working memory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our Simulator</h2>
          <p>
            This platform provides assessment-style practice based on reported patterns from candidate experiences. Our goal is to help you familiarize yourself with the mechanics, timing, and pressure of these digital puzzles so you can perform your best.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Skills</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Working Memory:</strong> Temporarily holding and manipulating information (Memory Maze).</li>
            <li><strong>Numerical Dexterity & Speed:</strong> Rapid arithmetic calculation under pressure (Bubble Math).</li>
            <li><strong>Spatial & Logical Reasoning:</strong> Visualizing paths and rotating mental models (Path Finder).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
