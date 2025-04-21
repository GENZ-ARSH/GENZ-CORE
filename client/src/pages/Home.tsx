import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Book, LibraryBig, Download, Upload, User } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityList from '@/components/dashboard/ActivityList';
import TaskList from '@/components/dashboard/TaskList';
import BookList from '@/components/dashboard/BookList';
import { useUser } from '@/contexts/UserContext';
import { 
  books as mockBooks, 
  statsData, 
  dashboardActivities, 
  pendingTasks, 
  recentDownloads 
} from '@/lib/mockData';

export default function Home() {
  const { user } = useUser();
  const [, navigate] = useLocation();

  // In a real app, we would fetch this data from the server
  /*
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  const { data: activities } = useQuery({
    queryKey: ['/api/activities/recent'],
  });
  
  const { data: tasks } = useQuery({
    queryKey: ['/api/tasks/pending'],
  });
  
  const { data: recentDownloads } = useQuery({
    queryKey: ['/api/downloads/recent'],
  });
  
  const { data: popularBooks } = useQuery({
    queryKey: ['/api/books/popular'],
  });
  */

  const icons = {
    book: <Book className="h-5 w-5" />,
    download: <Download className="h-5 w-5" />,
    upload: <Upload className="h-5 w-5" />,
    user: <User className="h-5 w-5" />,
  };

  const iconBgClasses = {
    book: 'bg-primary-100 dark:bg-primary-900/30',
    download: 'bg-green-100 dark:bg-green-900/30',
    upload: 'bg-amber-100 dark:bg-amber-900/30',
    user: 'bg-purple-100 dark:bg-purple-900/30',
  };

  const iconColorClasses = {
    book: 'text-primary',
    download: 'text-green-500',
    upload: 'text-amber-500',
    user: 'text-purple-500',
  };

  const handleTaskToggle = (id: number, completed: boolean) => {
    console.log(`Task ${id} toggled to ${completed}`);
    // In a real app, we would call the API to update the task
    // apiRequest('PATCH', `/api/tasks/${id}`, { completed });
  };

  const handleAddTask = () => {
    navigate('/tasks');
  };

  return (
    <div className="fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!</h1>
            <p className="opacity-90">You have {pendingTasks.length} pending tasks and {mockBooks.length} resources to explore.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              className="bg-white text-primary-700 font-medium px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              onClick={() => navigate('/tasks')}
            >
              View Tasks
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={icons[stat.icon as keyof typeof icons]}
            change={stat.change}
            iconBgClass={iconBgClasses[stat.icon as keyof typeof iconBgClasses]}
            iconColorClass={iconColorClasses[stat.icon as keyof typeof iconColorClasses]}
          />
        ))}
      </div>
      
      {/* Recent Activity & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityList 
            activities={dashboardActivities}
            onViewAll={() => navigate('/library')}
          />
        </div>
        
        {/* Pending Tasks & Recent Downloads */}
        <div className="space-y-6">
          <TaskList 
            tasks={pendingTasks}
            onTaskToggle={handleTaskToggle}
            onAddTask={handleAddTask}
            onViewAll={() => navigate('/tasks')}
          />
          
          <BookList 
            downloads={recentDownloads}
            title="Recently Downloaded"
          />
        </div>
      </div>
      
      {/* Popular Books */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Popular Books</h2>
          <button 
            className="text-sm text-primary hover:text-primary/80"
            onClick={() => navigate('/library')}
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockBooks.slice(0, 4).map((book) => (
            <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden card-hover">
              <img 
                src={book.coverImage || ''} 
                alt={`Book cover for ${book.title}`} 
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{book.title}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <Download className="h-4 w-4 mr-1" />
                  <span>{book.downloadCount} downloads</span>
                </div>
                <div className="flex mt-3 space-x-2">
                  {book.tags?.slice(0, 2).map((tag, index) => (
                    <span key={index} className={`px-2 py-1 text-xs bg-${index === 0 ? 'blue' : 'purple'}-100 dark:bg-${index === 0 ? 'blue' : 'purple'}-900/30 text-${index === 0 ? 'blue' : 'purple'}-700 dark:text-${index === 0 ? 'blue' : 'purple'}-300 rounded`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
