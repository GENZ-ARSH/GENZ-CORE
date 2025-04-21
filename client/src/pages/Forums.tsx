
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Forums() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Discussion Forums</h1>
          <p className="text-muted-foreground">Join the conversation</p>
        </div>
        <Button 
          className="bg-primary/80 backdrop-blur-sm"
          onClick={() => setIsAdminMode(adminPassword === 'GENZCLANX')}
        >
          {isAdminMode ? "Admin Mode Active" : "Admin Login"}
        </Button>
      </div>

      {isAdminMode && (
        <Card className="backdrop-blur-md bg-card/80">
          <CardHeader>Manage Forums</CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input placeholder="Forum Title" />
              <Input placeholder="Forum Category" />
              <Button>Create Forum</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
