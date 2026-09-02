import { Clock } from "lucide-react";

interface AssessmentTimerProps {
  remainingSeconds: number;
  totalSeconds?: number;
  label?: string;
}

export function AssessmentTimer({ remainingSeconds, label = "Time Remaining" }: AssessmentTimerProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  const isWarning = remainingSeconds <= 30 && remainingSeconds > 0;
  const isCritical = remainingSeconds <= 10 && remainingSeconds > 0;

  return (
    <div className={`flex items-center space-x-2 font-mono font-medium px-3 py-1.5 rounded-md ${
      isCritical ? "bg-error/10 text-error animate-pulse" : 
      isWarning ? "bg-warning/10 text-warning" : 
      "bg-secondary text-secondary-foreground"
    }`}>
      <Clock className="w-4 h-4" />
      <span className="text-xs uppercase tracking-wider hidden sm:inline-block mr-1">{label}</span>
      <span className="text-sm">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
