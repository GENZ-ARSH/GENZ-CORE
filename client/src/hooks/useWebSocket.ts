import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';

type MessageHandler = (data: any) => void;

interface WebSocketHookOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: MessageHandler;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

type MessageType = 
  | 'join'
  | 'leave'
  | 'edit'
  | 'cursor_move'
  | 'chat'
  | 'user_joined'
  | 'user_left'
  | 'session_users';

interface WebSocketMessage {
  type: MessageType;
  [key: string]: any;
}

const useWebSocket = (options: WebSocketHookOptions = {}) => {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectIntervalRef = useRef<number | null>(null);
  const handlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
  
  const {
    onOpen,
    onClose,
    onError,
    onMessage,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;
    
    // Close any existing connection
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    setIsConnecting(true);
    
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setIsConnecting(false);
      reconnectAttemptsRef.current = 0;
      if (onOpen) onOpen();
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      setIsConnected(false);
      if (onClose) onClose();
      
      // Attempt to reconnect if enabled
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
        
        if (reconnectIntervalRef.current) {
          window.clearTimeout(reconnectIntervalRef.current);
        }
        
        reconnectIntervalRef.current = window.setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Call the general message handler if provided
        if (onMessage) onMessage(data);
        
        // Call specific handlers for this message type
        if (data.type && handlersRef.current.has(data.type)) {
          const handlers = handlersRef.current.get(data.type);
          handlers?.forEach(handler => handler(data));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socketRef.current = socket;
  }, [onOpen, onClose, onError, onMessage, autoReconnect, reconnectInterval, maxReconnectAttempts]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectIntervalRef.current) {
        window.clearTimeout(reconnectIntervalRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Send a message through the WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        ...message,
        userId: user?.id,
        username: user?.fullName
      }));
      return true;
    }
    return false;
  }, [user]);

  // Join a collaboration session
  const joinSession = useCallback((resourceType: string, resourceId: number) => {
    return sendMessage({
      type: 'join',
      resourceType,
      resourceId
    });
  }, [sendMessage]);

  // Leave a collaboration session
  const leaveSession = useCallback(() => {
    return sendMessage({
      type: 'leave'
    });
  }, [sendMessage]);

  // Send an edit event
  const sendEdit = useCallback((resourceType: string, resourceId: number, changes: any, position?: any) => {
    return sendMessage({
      type: 'edit',
      resourceType,
      resourceId,
      changes,
      position
    });
  }, [sendMessage]);

  // Send cursor position
  const sendCursorPosition = useCallback((resourceType: string, resourceId: number, position: any) => {
    return sendMessage({
      type: 'cursor_move',
      resourceType,
      resourceId,
      position
    });
  }, [sendMessage]);

  // Send chat message
  const sendChatMessage = useCallback((resourceType: string, resourceId: number, message: string) => {
    return sendMessage({
      type: 'chat',
      resourceType,
      resourceId,
      message
    });
  }, [sendMessage]);

  // Add a handler for a specific message type
  const addMessageHandler = useCallback((type: MessageType, handler: MessageHandler) => {
    if (!handlersRef.current.has(type)) {
      handlersRef.current.set(type, new Set());
    }
    
    handlersRef.current.get(type)?.add(handler);
    
    // Return a function to remove this handler
    return () => {
      const handlers = handlersRef.current.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          handlersRef.current.delete(type);
        }
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    joinSession,
    leaveSession,
    sendEdit,
    sendCursorPosition,
    sendChatMessage,
    addMessageHandler,
    reconnect: connect
  };
};

export default useWebSocket;