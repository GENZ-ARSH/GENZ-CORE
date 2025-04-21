
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StudyGroups() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Study Groups</h1>
          <p className="text-muted-foreground">Collaborate and learn together</p>
        </div>
        <Button className="bg-primary/80 backdrop-blur-sm hover:bg-primary/90">
          Create Group
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-md bg-card/80 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all">
          <CardHeader className="font-semibold">JEE Physics Group</CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active Members: 15</p>
            <p className="text-sm text-muted-foreground">Next Session: Tomorrow</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
