import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Users, UserCheck, ChevronRight } from 'lucide-react';
import { users } from '@/lib/mockData';

interface TeamMember {
  id: number;
  fullName: string;
  avatar: string | null;
  role: string;
  tasks: {
    total: number;
    completed: number;
  };
  status: 'active' | 'away' | 'offline';
  joinDate: string;
  currentProject: string;
}

// Transform user data to team member format
const teamMembers: TeamMember[] = users.map(user => ({
  id: user.id,
  fullName: user.fullName,
  avatar: user.avatar,
  role: user.role,
  tasks: {
    total: Math.floor(Math.random() * 15) + 5, // Random number between 5-20
    completed: Math.floor(Math.random() * 5) + 2, // Random number between 2-7
  },
  status: ['active', 'away', 'offline'][Math.floor(Math.random() * 3)] as 'active' | 'away' | 'offline',
  joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
  currentProject: ['Physics Resources', 'Chemistry Formula Sheet', 'Biology Notes', 'Mathematics Problems'][Math.floor(Math.random() * 4)]
}));

// Team stats
const teamStats = {
  totalMembers: teamMembers.length,
  activeMembers: teamMembers.filter(member => member.status === 'active').length,
  totalTasks: teamMembers.reduce((acc, member) => acc + member.tasks.total, 0),
  completedTasks: teamMembers.reduce((acc, member) => acc + member.tasks.completed, 0),
};

export default function TeamDashboard() {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">TeamGENZ Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of team members, roles, and tasks
          </p>
        </div>
        
        <Button>
          <UserCheck className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
                <h3 className="text-2xl font-bold mt-1">{teamStats.totalMembers}</h3>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Now</p>
                <h3 className="text-2xl font-bold mt-1">{teamStats.activeMembers}</h3>
              </div>
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
                <h3 className="text-2xl font-bold mt-1">{teamStats.totalTasks}</h3>
              </div>
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Team Progress</p>
                <span className="text-sm font-medium">
                  {Math.round((teamStats.completedTasks / teamStats.totalTasks) * 100)}%
                </span>
              </div>
              <Progress value={(teamStats.completedTasks / teamStats.totalTasks) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            See who's on the team and their current progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Projects</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={`${member.fullName}'s avatar`} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{member.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Joined {member.joinDate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        member.role === 'admin' ? 'default' : 
                        member.role === 'moderator' ? 'secondary' : 'outline'
                      }>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          member.status === 'active' ? 'bg-green-500' : 
                          member.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="capitalize">{member.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">{member.currentProject}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(member.tasks.completed / member.tasks.total) * 100} 
                          className="h-2 w-24 md:w-32" 
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {member.tasks.completed}/{member.tasks.total}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Current Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
          <CardDescription>
            Ongoing projects with team assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Physics Formula Sheet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Comprehensive guide to physics formulas for JEE
                  </p>
                </div>
                <Badge>High Priority</Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="h-8 w-8 rounded-full border-2 border-background" style={{ zIndex: 10 - user.id }}>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={`${user.fullName}'s avatar`} 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-primary text-white flex items-center justify-center text-xs">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm">
                  <span className="mr-1">Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Chemistry NCERT Solutions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Solution manual for all NCERT chemistry exercises
                  </p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Progress</span>
                  <span>42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {users.slice(1, 4).map((user) => (
                    <div key={user.id} className="h-8 w-8 rounded-full border-2 border-background" style={{ zIndex: 10 - user.id }}>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={`${user.fullName}'s avatar`} 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-primary text-white flex items-center justify-center text-xs">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm">
                  <span className="mr-1">Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">View All Projects</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
