import { useTheme } from "@/providers/ThemeProvider";

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader = ({ toggleSidebar }: MobileHeaderProps) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="lg:hidden flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <div className="text-xl font-semibold">GenzBroz</div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <i
            className={`${
              isDarkMode ? "ri-sun-line" : "ri-moon-line"
            } text-xl`}
          ></i>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors duration-200">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-1 right-1 bg-primary-500 rounded-full w-2 h-2"></span>
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
