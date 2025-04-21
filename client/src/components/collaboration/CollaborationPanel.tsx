import { useState, useEffect, useCallback } from 'react';
import useWebSocket from '@/hooks/useWebSocket';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Users,
  Send,
  UserCheck,
  UserMinus,
  X,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface ChatMessage {
  userId: number;
  username: string;
  message: string;
  timestamp: string;
}

interface ActiveUser {
  userId: number;
  username: string;
}

interface CollaborationPanelProps {
  resourceType: string;
  resourceId: number;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function CollaborationPanel({
  resourceType,
  resourceId,
  isMinimized = false,
  onToggleMinimize
}: CollaborationPanelProps) {
  const { user } = useUser();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'users'>('chat');
  
  const {
    isConnected,
    isConnecting,
    joinSession,
    leaveSession,
    sendChatMessage,
    addMessageHandler,
    reconnect
  } = useWebSocket({
    autoReconnect: true,
    maxReconnectAttempts: 10
  });
  
  // Handle user joined event
  const handleUserJoined = useCallback((data: any) => {
    if (data.userId === user?.id) return;
    
    setActiveUsers(prev => {
      // Check if user already exists
      if (prev.some(u => u.userId === data.userId)) {
        return prev;
      }
      
      return [...prev, { userId: data.userId, username: data.username }];
    });
    
    // Add system message
    setChatMessages(prev => [
      ...prev,
      {
        userId: -1, // System message
        username: 'System',
        message: `${data.username} has joined the session`,
        timestamp: data.timestamp || new Date().toISOString()
      }
    ]);
  }, [user?.id]);
  
  // Handle user left event
  const handleUserLeft = useCallback((data: any) => {
    setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
    
    // Add system message
    setChatMessages(prev => [
      ...prev,
      {
        userId: -1, // System message
        username: 'System',
        message: `${data.username} has left the session`,
        timestamp: data.timestamp || new Date().toISOString()
      }
    ]);
  }, []);
  
  // Handle initial session users
  const handleSessionUsers = useCallback((data: any) => {
    if (data.users && Array.isArray(data.users)) {
      setActiveUsers(data.users.filter((u: any) => u.userId && u.username));
    }
  }, []);
  
  // Handle chat message
  const handleChatMessage = useCallback((data: any) => {
    setChatMessages(prev => [
      ...prev,
      {
        userId: data.userId,
        username: data.username,
        message: data.message,
        timestamp: data.timestamp
      }
    ]);
  }, []);
  
  // Join the collaboration session when component mounts and connection is established
  useEffect(() => {
    if (isConnected && resourceType && resourceId) {
      joinSession(resourceType, resourceId);
    }
  }, [isConnected, resourceType, resourceId, joinSession]);
  
  // Leave the session when component unmounts
  useEffect(() => {
    return () => {
      if (isConnected) {
        leaveSession();
      }
    };
  }, [isConnected, leaveSession]);
  
  // Add message handlers
  useEffect(() => {
    const removeUserJoinedHandler = addMessageHandler('user_joined', handleUserJoined);
    const removeUserLeftHandler = addMessageHandler('user_left', handleUserLeft);
    const removeSessionUsersHandler = addMessageHandler('session_users', handleSessionUsers);
    const removeChatHandler = addMessageHandler('chat', handleChatMessage);
    
    return () => {
      removeUserJoinedHandler();
      removeUserLeftHandler();
      removeSessionUsersHandler();
      removeChatHandler();
    };
  }, [
    addMessageHandler,
    handleUserJoined,
    handleUserLeft,
    handleSessionUsers,
    handleChatMessage
  ]);
  
  // Send chat message
  const handleSendMessage = () => {
    if (chatMessage.trim() && isConnected) {
      sendChatMessage(resourceType, resourceId, chatMessage);
      setChatMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={onToggleMinimize}
          className="rounded-full h-14 w-14 shadow-lg"
          variant="default"
        >
          <MessageSquare className="h-6 w-6" />
          {activeUsers.length > 0 && (
            <Badge 
              variant="destructive"
              className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center rounded-full"
            >
              {activeUsers.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-background border border-border rounded-lg shadow-lg flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'destructive'} className="h-2 w-2 p-0 rounded-full" />
          <span className="font-medium">
            {isConnecting ? 'Connecting...' : (isConnected ? 'Connected' : 'Disconnected')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!isConnected && (
            <Button 
              onClick={reconnect} 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={onToggleMinimize}
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Tab Buttons */}
      <div className="flex border-b">
        <Button
          onClick={() => setActiveTab('chat')}
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          className="flex-1 rounded-none h-10"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
        <Button
          onClick={() => setActiveTab('users')}
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          className="flex-1 rounded-none h-10"
        >
          <Users className="h-4 w-4 mr-2" />
          Users {activeUsers.length > 0 && `(${activeUsers.length})`}
        </Button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === 'chat' ? (
          <>
            {!isConnected ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-8 w-8" />
                <p>Connection lost. Messages cannot be sent or received.</p>
                <Button size="sm" variant="outline" onClick={reconnect}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect
                </Button>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                <MessageSquare className="h-8 w-8" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-2 ${msg.userId === user?.id ? 'justify-end' : ''}`}>
                    {msg.userId !== user?.id && msg.userId !== -1 && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg p-2 max-w-[80%] ${
                        msg.userId === -1 
                          ? 'bg-muted text-muted-foreground text-xs italic mx-auto text-center' 
                          : msg.userId === user?.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                      }`}
                    >
                      {msg.userId !== -1 && msg.userId !== user?.id && (
                        <div className="text-xs font-medium mb-1">{msg.username}</div>
                      )}
                      <div>{msg.message}</div>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {activeUsers.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                <Users className="h-8 w-8" />
                <p>No other users are currently collaborating.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-medium">You</div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.fullName || 'You'}</div>
                    <div className="text-xs text-muted-foreground">Currently active</div>
                  </div>
                  <Badge variant="outline" className="ml-auto">You</Badge>
                </div>
                
                {activeUsers.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="font-medium">Other collaborators</div>
                    {activeUsers.map((user) => (
                      <div key={user.userId} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-muted-foreground">Currently active</div>
                        </div>
                        <UserCheck className="ml-auto h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Chat Input */}
      {activeTab === 'chat' && (
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={!isConnected}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!isConnected || !chatMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}