import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-bold hidden sm:inline-block">Aptitude Simulator</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          <Link href="/games" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Games
          </Link>
          <Link href="/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Practice
          </Link>
          <Link href="/progress" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Progress
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden md:inline-block">
            How It Works
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild>
            <Link href="/mock">Full Mock</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
