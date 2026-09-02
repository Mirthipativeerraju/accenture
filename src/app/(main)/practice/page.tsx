
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Modes</h1>
        <p className="text-muted-foreground max-w-3xl">
          Select how you want to practice. You can learn the rules, practice without a timer, or challenge yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Learn</CardTitle>
            <CardDescription>Read detailed instructions and strategies for each game.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>Coming in N3-N5</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guided Practice</CardTitle>
            <CardDescription>Play without strict time limits to understand the mechanics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>Coming in N3-N5</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timed Practice</CardTitle>
            <CardDescription>Simulate the pressure of the real assessment with strict timers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>Coming in N3-N5</Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50 shadow-sm shadow-primary/10">
          <CardHeader>
            <CardTitle>Challenge</CardTitle>
            <CardDescription>Highest difficulty settings to truly test your limits.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="w-full" disabled>Coming in N3-N5</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
