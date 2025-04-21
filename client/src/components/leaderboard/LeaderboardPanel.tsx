
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Crown, Medal, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface LeaderboardUser {
  id: string;
  username: string;
  role: string;
  points: number;
  level: number;
  avatar: string;
  completedTasks: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Trophy className="h-6 w-6 text-amber-700" />;
    default:
      return null;
  }
};

export default function LeaderboardPanel() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    pb.collection('users').subscribe('*', function (e) {
      loadUsers();
    });

    loadUsers();
    return () => pb.collection('users').unsubscribe('*');
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const filter = activeTab !== 'all' ? `role = "${activeTab}"` : '';
      const records = await pb.collection('users').getList(1, 50, {
        sort: '-points',
        filter
      });
      setUsers(records.items);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const calculateLevel = (points: number) => Math.floor(points / 100) + 1;
  const calculateProgress = (points: number) => (points % 100);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">GENZ Leaderboard</h2>
        <p className="text-muted-foreground">Track Progress. Celebrate Wins.</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="dev">Devs</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="user">Users</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {users.map((user, index) => (
              <Card key={user.id} className={`${index < 3 ? 'border-2 border-primary' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                          <div className="absolute -top-2 -right-2">
                            {getRankIcon(index + 1)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.username}</h3>
                          <Badge variant={
                            user.role === 'admin' ? 'default' :
                            user.role === 'dev' ? 'secondary' : 'outline'
                          }>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Level {calculateLevel(user.points)} GENZ {user.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{user.points} points</div>
                      <div className="text-sm text-muted-foreground">
                        Rank #{index + 1}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to Level {calculateLevel(user.points) + 1}</span>
                      <span>{calculateProgress(user.points)}%</span>
                    </div>
                    <Progress value={calculateProgress(user.points)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
