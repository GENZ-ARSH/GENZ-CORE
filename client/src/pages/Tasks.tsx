import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, CheckSquare, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tasks as mockTasks, users } from '@/lib/mockData';

interface TaskItemProps {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: Date;
  assignedTo?: number;
  onStatusChange: (id: number, status: string) => void;
}

function TaskItem({ id, title, description, status, dueDate, assignedTo, onStatusChange }: TaskItemProps) {
  const assignedUser = assignedTo ? users.find(u => u.id === assignedTo) : undefined;
  
  const renderStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getNextStatus = () => {
    switch (status) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'todo';
      default:
        return 'todo';
    }
  };
  
  return (
    <div className="border rounded-lg p-4 mb-3 bg-white dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <button 
          className="mt-1"
          onClick={() => onStatusChange(id, getNextStatus())}
        >
          {renderStatusIcon()}
        </button>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-medium">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {status && (
                <Badge variant={
                  status === 'completed' ? 'default' : 
                  status === 'in-progress' ? 'secondary' : 'outline'
                }>
                  {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              )}
              
              {dueDate && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(dueDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
          )}
          
          {assignedUser && (
            <div className="flex items-center mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Assigned to:</span>
              <div className="flex items-center gap-2">
                {assignedUser.avatar ? (
                  <img 
                    src={assignedUser.avatar} 
                    alt={`${assignedUser.fullName}'s avatar`} 
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {assignedUser.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium">{assignedUser.fullName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  // In a real app, we would fetch this data from the server
  /*
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });
  */

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      // In a real app, we would call the API
      // await apiRequest('PATCH', `/api/tasks/${id}`, { status });
      console.log(`Updating task ${id} status to ${status}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Task Updated",
        description: "The task status has been updated successfully.",
      });
      // In a real app, we would invalidate the query
      // queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateTaskMutation.mutate({ id, status });
  };

  // Filter tasks based on active tab
  const filteredTasks = mockTasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  // Group tasks for display
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">To-Do & Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your tasks and deadlines
          </p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo" className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            <span className="hidden sm:inline">To Do</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">In Progress</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">Completed</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Circle className="h-4 w-4 text-gray-400" />
                  To Do
                </CardTitle>
                <CardDescription>Tasks that need to be started</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {todoTasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No tasks to do</p>
                  </div>
                ) : (
                  todoTasks.map(task => (
                    <TaskItem 
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      dueDate={task.dueDate}
                      assignedTo={task.assignedTo}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Clock className="h-4 w-4 text-amber-500" />
                  In Progress
                </CardTitle>
                <CardDescription>Tasks currently being worked on</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No tasks in progress</p>
                  </div>
                ) : (
                  inProgressTasks.map(task => (
                    <TaskItem 
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      dueDate={task.dueDate}
                      assignedTo={task.assignedTo}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Completed Column */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Completed
                </CardTitle>
                <CardDescription>Tasks that have been finished</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No completed tasks</p>
                  </div>
                ) : (
                  completedTasks.map(task => (
                    <TaskItem 
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      dueDate={task.dueDate}
                      assignedTo={task.assignedTo}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="todo">
          <Card>
            <CardHeader>
              <CardTitle>To Do</CardTitle>
              <CardDescription>
                Tasks that need to be started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todoTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No tasks to do</p>
                </div>
              ) : (
                todoTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    dueDate={task.dueDate}
                    assignedTo={task.assignedTo}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="in-progress">
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>
                Tasks currently being worked on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inProgressTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No tasks in progress</p>
                </div>
              ) : (
                inProgressTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    dueDate={task.dueDate}
                    assignedTo={task.assignedTo}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>
                Tasks that have been finished
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No completed tasks</p>
                </div>
              ) : (
                completedTasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    dueDate={task.dueDate}
                    assignedTo={task.assignedTo}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
