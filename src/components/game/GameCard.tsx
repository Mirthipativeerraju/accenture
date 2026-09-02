import Link from "next/link";
import { Brain, Calculator, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type GameType = "memory-maze" | "bubble-math" | "path-finder";

interface GameCardProps {
  id: GameType;
  title: string;
  description: string;
  skills: string[];
  difficulty: "Variable" | "Easy" | "Medium" | "Hard";
}

export function GameCard({ id, title, description, skills, difficulty }: GameCardProps) {
  const Icon = id === "memory-maze" ? Brain : id === "bubble-math" ? Calculator : Navigation;
  
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <Badge variant="outline">{difficulty}</Badge>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/practice/${id}`}>Practice</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
