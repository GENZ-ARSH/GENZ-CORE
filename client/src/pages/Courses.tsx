
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Courses() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = () => {
    if (adminPassword === 'GENZCLANX') {
      setIsAdminMode(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">Explore our comprehensive courses</p>
        </div>
        <Button 
          className="bg-primary/80 backdrop-blur-sm"
          onClick={() => setAdminPassword('GENZCLANX')}
        >
          {isAdminMode ? "Admin Mode Active" : "Admin Login"}
        </Button>
      </div>

      {isAdminMode && (
        <Card className="backdrop-blur-md bg-card/80">
          <CardHeader>Add New Course</CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input placeholder="Course Title" />
              <Textarea placeholder="Course Description" />
              <Button>Add Course</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
