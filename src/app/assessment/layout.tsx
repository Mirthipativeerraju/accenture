import { BrainCircuit } from "lucide-react";

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Assessment Header (Minimal, No marketing nav) */}
      <header className="h-14 border-b flex items-center justify-between px-4 md:px-8 bg-card text-card-foreground">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Assessment Simulator</span>
        </div>
        {/* Timer will be injected here by the actual assessment engine */}
        <div id="assessment-timer-portal"></div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
