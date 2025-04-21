import { useLocation } from "wouter";
import { useTheme } from "@/providers/ThemeProvider";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [location, navigate] = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen lg:w-64 w-72 transition-transform duration-300 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-hide ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-primary-600 text-white rounded-lg p-2 mr-2">
            <i className="ri-book-read-line text-xl"></i>
          </div>
          <h1 className="text-xl font-bold">GenzBroz</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      <div className="px-3 py-4">
        <div className="space-y-1">
          <button
            onClick={() => handleNavigation("/")}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/")
                ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="ri-home-4-line text-xl mr-3"></i>
            <span>Home Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("/library")}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/library")
                ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="ri-book-open-line text-xl mr-3"></i>
            <span>Library / Resources</span>
          </button>

          <button
            onClick={() => handleNavigation("/downloads")}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/downloads")
                ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="ri-download-cloud-2-line text-xl mr-3"></i>
            <span>Download Center</span>
          </button>

          <button
            onClick={() => handleNavigation("/request")}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/request")
                ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="ri-file-list-3-line text-xl mr-3"></i>
            <span>Request a Book</span>
          </button>

          <button
            onClick={() => handleNavigation("/team")}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/team")
                ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="ri-team-line text-xl mr-3"></i>
            <span>TeamGENZ Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("/admin")}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive("/admin")
                ? "bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="ri-admin-line text-xl mr-3"></i>
            <span>Admin Panel</span>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Coming Soon
          </h3>
          <div className="mt-2 space-y-1">
            <button
              disabled
              className="flex items-center opacity-60 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="ri-checkbox-circle-line text-xl mr-3"></i>
              <span>To-Do Manager</span>
            </button>
            <button
              disabled
              className="flex items-center opacity-60 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="ri-message-3-line text-xl mr-3"></i>
              <span>Announcements</span>
            </button>
            <button
              disabled
              className="flex items-center opacity-60 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <i className="ri-trophy-line text-xl mr-3"></i>
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="w-10 h-10 rounded-full mr-3"
            alt="User profile"
          />
          <div>
            <p className="font-medium">Alex Johnson</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
        <div className="mt-4 flex">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 transition-colors duration-200"
          >
            <i
              className={`${
                isDarkMode ? "ri-sun-line" : "ri-moon-line"
              } text-lg mr-2`}
            ></i>
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
