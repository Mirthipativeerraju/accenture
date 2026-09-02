import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Disclaimer",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">About</h1>
      
      <Card className="border-warning/50 bg-warning/5 mb-8">
        <CardContent className="pt-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
          <div>
            <h2 className="font-semibold text-warning-foreground mb-2 text-foreground">Important Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Assessment formats can vary by role, hiring drive, provider, and test version. 
              This simulator is an independent educational practice resource based on publicly available 
              information and reported candidate experiences. It is not affiliated with, endorsed by, 
              or connected to Accenture or any official assessment provider.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="prose prose-slate text-muted-foreground space-y-4">
        <p>
          This project was created to provide a free, accessible way for candidates to practice game-based cognitive assessments. 
        </p>
        <p>
          We do not claim to possess official scoring algorithms or exact leaked questions. 
          The practice score provided by this platform is an educational metric designed to help you track your own improvement, 
          not a prediction of official hiring outcomes.
        </p>
      </div>
    </div>
  );
}
