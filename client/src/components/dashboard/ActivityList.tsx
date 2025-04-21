import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader
} from '@/components/ui/card';
import { Upload, Download, UserPlus, Mail } from 'lucide-react';

interface Activity {
  id: number;
  type: 'upload' | 'download' | 'user' | 'request';
  title: string;
  description: string;
  time: string;
}

interface ActivityListProps {
  activities: Activity[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function ActivityList({ 
  activities, 
  title = "Recent Activity", 
  showViewAll = true, 
  onViewAll 
}: ActivityListProps) {
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'upload':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <Upload className="h-4 w-4 text-green-500" />
          </div>
        );
      case 'download':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Download className="h-4 w-4 text-blue-500" />
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <UserPlus className="h-4 w-4 text-purple-500" />
          </div>
        );
      case 'request':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <Mail className="h-4 w-4 text-amber-500" />
          </div>
        );
      default:
        return null;
    }
  };

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
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <div className="flex justify-between">
                  <p>
                    <span className="font-medium">{activity.title}</span> {activity.description}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.type === 'user' ? 'New member' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
