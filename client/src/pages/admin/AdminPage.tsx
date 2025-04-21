import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ResourceManagement from "./components/ResourceManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("resources");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            <i className="ri-add-line mr-2"></i>
            Add Resource
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            <i className="ri-user-add-line mr-2"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
              <i className="ri-file-upload-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Uploads Today
              </p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <i className="ri-user-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                New Users
              </p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
              <i className="ri-file-list-3-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Requests
              </p>
              <p className="text-2xl font-bold">
                {statsLoading ? "-" : stats?.pendingRequests || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
              <i className="ri-error-warning-line text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Issues
              </p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resources" onValueChange={setActiveTab}>
        <TabsList className="border-b border-gray-200 dark:border-gray-700 w-full justify-start mb-6">
          <TabsTrigger value="resources" className="text-sm">
            Resources Management
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm">
            User Management
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-sm">
            Book Requests
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <ResourceManagement />
        </TabsContent>

        <TabsContent value="users">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            User management interface - coming soon
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Book request management - coming soon
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            System settings configuration - coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
