
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ProgressTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>

      <div className="grid gap-6">
        <Card className="backdrop-blur-md bg-card/80">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Physics</h3>
            <Progress value={75} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">75% Complete</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
