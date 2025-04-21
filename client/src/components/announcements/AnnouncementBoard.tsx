
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  message: string;
  postedBy: string;
  created: string;
}

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdmin] = useState(pb.authStore.model?.role === 'admin');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  useEffect(() => {
    pb.collection('announcements').subscribe('*', function (e) {
      setAnnouncements(prev => [...prev, e.record]);
    });

    loadAnnouncements();

    return () => pb.collection('announcements').unsubscribe('*');
  }, []);

  const loadAnnouncements = async () => {
    const records = await pb.collection('announcements').getList(1, 50, {
      sort: '-created',
    });
    setAnnouncements(records.items);
  };

  const handleSubmit = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message) return;

    try {
      if (isEditing) {
        await pb.collection('announcements').update(editingId, {
          title: newAnnouncement.title,
          message: newAnnouncement.message,
        });
      } else {
        await pb.collection('announcements').create({
          title: newAnnouncement.title,
          message: newAnnouncement.message,
          postedBy: pb.authStore.model?.username || 'GENZ TEAM',
        });
      }
      setNewAnnouncement({ title: '', message: '' });
      setIsEditing(false);
      setEditingId('');
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
    });
    setIsEditing(true);
    setEditingId(announcement.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection('announcements').delete(id);
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">GENZ Announcements</h2>
          <p className="text-muted-foreground">Stay Updated with TeamGENZ News</p>
        </div>
      </div>

      {isAdmin && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Announcement Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Announcement Message"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
              />
              <Button onClick={handleSubmit}>
                <Plus className="h-4 w-4 mr-2" />
                {isEditing ? 'Update' : 'Post'} Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{announcement.title}</CardTitle>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{announcement.message}</p>
              <div className="mt-4 text-sm text-muted-foreground">
                Posted by {announcement.postedBy} on {format(new Date(announcement.created), 'PPP – pp')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
