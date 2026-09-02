import { AssessmentTimer } from "@/components/game/AssessmentTimer";

export default function AssessmentDemoPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 border rounded-lg bg-card text-card-foreground shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Assessment Shell Preview</h1>
        <p className="text-muted-foreground mb-8">
          This is the focused layout for gameplay. No marketing navigation is visible.
        </p>
        
        <div className="flex justify-center mb-4">
          <AssessmentTimer remainingSeconds={125} label="Practice Time" />
        </div>
        
        <p className="text-xs text-muted-foreground mt-8">
          (Game canvas will render here)
        </p>
      </div>
    </div>
  );
}
