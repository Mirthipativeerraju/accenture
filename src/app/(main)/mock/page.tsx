
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Full Mock Assessment",
};

export default function MockPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Full Mock Assessment</h1>
        <p className="text-muted-foreground text-lg">
          Experience a full simulation of the cognitive assessment.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Estimated Duration</h3>
                <p className="text-sm text-muted-foreground">Approx. 15-20 minutes total (Configuration pending).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Assessment Structure</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Bubble Math (Numerical Dexterity)</li>
                  <li>Path Finder (Logical Reasoning)</li>
                  <li>Memory Maze (Working Memory)</li>
                </ol>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning mt-0.5" />
              <div>
                <h3 className="font-semibold">Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure you are in a quiet environment. Once started, the timer cannot be paused.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="w-full md:w-auto px-12" disabled>
          Start Full Mock (Coming in N7)
        </Button>
      </div>
    </div>
  );
}
