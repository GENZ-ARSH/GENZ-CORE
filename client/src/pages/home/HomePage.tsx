import { useQuery } from "@tanstack/react-query";
import StatsCard from "./components/StatsCard";
import WelcomeCard from "./components/WelcomeCard";
import LatestUploadCard from "./components/LatestUploadCard";
import NotificationCard from "./components/NotificationCard";

const HomePage = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['/api/books'],
    queryFn: async () => {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
  });

  const handleRefreshData = () => {
    // Invalidate queries to refetch data
    // This would typically be more targeted in a real app
    queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/books'] });
    queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Home Dashboard</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefreshData}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <i className="ri-refresh-line mr-2"></i>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <WelcomeCard />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array(4)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 animate-pulse"
              >
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))
        ) : (
          <>
            <StatsCard
              title="Total Books"
              value={stats?.totalBooks || 0}
              icon="ri-book-2-line"
              color="primary"
              trend={{ value: "12%", direction: "up" }}
              subtitle="from last month"
            />
            <StatsCard
              title="Downloads"
              value={stats?.totalDownloads || 0}
              icon="ri-download-2-line"
              color="secondary"
              trend={{ value: "8%", direction: "up" }}
              subtitle="from last week"
            />
            <StatsCard
              title="Active Users"
              value={stats?.activeUsers || 0}
              icon="ri-user-3-line"
              color="accent"
              trend={{ value: "24%", direction: "up" }}
              subtitle="from last week"
            />
            <StatsCard
              title="Book Requests"
              value={stats?.pendingRequests || 0}
              icon="ri-file-list-3-line"
              color="yellow"
              subtitle="Need review"
              actionLabel="View all"
              onAction={() => {
                // Navigate to requests page
              }}
            />
          </>
        )}
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Uploads */}
        <div className="lg:col-span-2">
          <LatestUploadCard books={books.slice(0, 3)} isLoading={booksLoading} />
        </div>

        {/* Notifications */}
        <div>
          <NotificationCard 
            notifications={notifications} 
            isLoading={notificationsLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
