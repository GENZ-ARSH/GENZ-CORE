import React, { createContext, useContext, useState, useCallback } from 'react';
import CollaborationPanel from '@/components/collaboration/CollaborationPanel';

interface CollaborationContextType {
  startCollaboration: (resourceType: string, resourceId: number) => void;
  endCollaboration: () => void;
  isCollaborating: boolean;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [resourceType, setResourceType] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<number | null>(null);

  const startCollaboration = useCallback((type: string, id: number) => {
    setResourceType(type);
    setResourceId(id);
    setIsCollaborating(true);
    setIsMinimized(false);
  }, []);

  const endCollaboration = useCallback(() => {
    setIsCollaborating(false);
    setResourceType(null);
    setResourceId(null);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  return (
    <CollaborationContext.Provider
      value={{
        startCollaboration,
        endCollaboration,
        isCollaborating,
      }}
    >
      {children}
      
      {isCollaborating && resourceType && resourceId !== null && (
        <CollaborationPanel
          resourceType={resourceType}
          resourceId={resourceId}
          isMinimized={isMinimized}
          onToggleMinimize={toggleMinimize}
        />
      )}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}