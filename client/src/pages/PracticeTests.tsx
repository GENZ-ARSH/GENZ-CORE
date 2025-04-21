
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PracticeTests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Practice Tests</h1>
        <p className="text-muted-foreground">Test your knowledge with mock exams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-md bg-card/80 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all">
          <CardHeader>
            <h3 className="text-xl font-semibold">NEET Mock Test</h3>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Duration: 3 hours | Questions: 180</p>
            <Button className="w-full bg-primary/80 backdrop-blur-sm">Start Test</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
