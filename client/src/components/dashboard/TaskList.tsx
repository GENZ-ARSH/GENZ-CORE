import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onTaskToggle: (id: number, completed: boolean) => void;
  onAddTask?: () => void;
}

export default function TaskList({ 
  tasks, 
  title = "Pending Tasks", 
  showViewAll = true, 
  onViewAll,
  onTaskToggle,
  onAddTask
}: TaskListProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-white dark:bg-gray-800">
        <h2 className="font-semibold">{title}</h2>
        {showViewAll && (
          <button 
            className="text-sm text-primary hover:text-primary/80"
            onClick={onViewAll}
          >
            View All
          </button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start">
              <Checkbox 
                id={`task-${task.id}`}
                className="mt-1 mr-3"
                checked={task.completed}
                onCheckedChange={(checked) => onTaskToggle(task.id, checked as boolean)}
              />
              <div>
                <label 
                  htmlFor={`task-${task.id}`}
                  className={`font-medium ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                >
                  {task.title}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </CardFooter>
    </Card>
  );
}
