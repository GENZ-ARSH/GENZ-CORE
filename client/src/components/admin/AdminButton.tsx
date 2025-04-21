
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AdminAuthDialog } from './AdminAuthDialog';

interface AdminButtonProps {
  onSuccess?: () => void;
}

export function AdminButton({ onSuccess }: AdminButtonProps) {
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSuccess = () => {
    setIsAdminMode(true);
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Button 
        variant="outline"
        onClick={() => setShowAdminAuth(true)}
        className="bg-primary/80 backdrop-blur-sm flex items-center gap-2"
      >
        <Shield className="h-4 w-4" />
        {isAdminMode ? "Admin Mode Active" : "Admin Login"}
      </Button>
      
      <AdminAuthDialog 
        isOpen={showAdminAuth}
        onClose={() => setShowAdminAuth(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
