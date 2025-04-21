import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface NotificationCardProps {
  notifications: Notification[];
  isLoading: boolean;
}

const NotificationCard = ({ notifications, isLoading }: NotificationCardProps) => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("PATCH", `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/notifications'],
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/notifications/mark-all-read", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/notifications'],
      });
    },
  });

  const handleMarkAsRead = (id: number, currentState: boolean) => {
    if (!currentState) {
      markAsReadMutation.mutate(id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-primary-600 dark:text-primary-400 font-medium"
        >
          Mark all as read
        </button>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading
          ? Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="p-4 sm:px-6">
                  <div className="flex">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-4 space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </div>
              ))
          : notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 sm:px-6 ${
                  notification.read ? "" : "bg-primary-50 dark:bg-primary-900/10"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                      <i className="ri-notification-3-line text-xl"></i>
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </span>
                      <button
                        onClick={() => handleMarkAsRead(notification.id, notification.read)}
                        className="text-xs text-primary-600 dark:text-primary-400 font-medium"
                      >
                        {notification.read ? "Mark as unread" : "Mark as read"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
        <button className="text-sm text-primary-600 dark:text-primary-400 font-medium">
          View all notifications
        </button>
      </div>
    </Card>
  );
};

export default NotificationCard;
