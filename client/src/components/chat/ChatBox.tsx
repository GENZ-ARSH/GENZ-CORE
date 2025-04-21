
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
  room: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('general');

  useEffect(() => {
    pb.collection('messages').subscribe('*', function (e) {
      if (e.record.room === room) {
        setMessages(prev => [...prev, e.record]);
      }
    });

    // Load initial messages
    pb.collection('messages').getList(1, 50, {
      filter: `room = "${room}"`,
      sort: 'created',
    }).then(result => {
      setMessages(result.items);
    });

    return () => pb.collection('messages').unsubscribe('*');
  }, [room]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await pb.collection('messages').create({
        content: newMessage,
        room: room,
        userId: pb.authStore.model?.id,
        username: pb.authStore.model?.username
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>GENZ Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{msg.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{msg.username}</span>
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
