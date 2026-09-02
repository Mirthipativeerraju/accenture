import { Metadata } from "next";
import { BarChart3 } from "lucide-react";


export const metadata: Metadata = {
  title: "Your Progress",
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your performance, speed, and accuracy over time.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <BarChart3 className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No data available yet</h2>
        <p className="text-muted-foreground max-w-md">
          Your progress will appear here after you complete your first practice session.
        </p>
      </div>
    </div>
  );
}
