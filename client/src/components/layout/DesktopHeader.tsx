import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useQuery } from "@tanstack/react-query";

const DesktopHeader = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchResults = [] } = useQuery({
    queryKey: ['/api/books', searchQuery],
    enabled: searchQuery.length > 1,
    queryFn: async () => {
      if (searchQuery.length <= 1) return [];
      const res = await fetch(`/api/books?search=${searchQuery}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <div className="hidden lg:flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-20">
      <div className="flex-1 max-w-3xl">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery.length > 1) setShowSearchResults(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSearchResults(false), 200);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search for resources, books, or topics..."
          />
          {searchQuery.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <i className="ri-close-line"></i>
            </button>
          )}

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-2">
                {searchResults.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">
                    No results found
                  </p>
                ) : (
                  searchResults.map((result: any) => (
                    <div
                      key={result.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <div className="flex items-center">
                        <i
                          className={`${
                            result.fileType === "PDF"
                              ? "ri-file-pdf-fill"
                              : result.fileType === "DOC"
                              ? "ri-file-word-fill"
                              : "ri-file-fill"
                          } mr-3 text-primary-500`}
                        ></i>
                        <span>{result.title}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center ml-4 space-x-3">
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-1 right-1 bg-primary-500 rounded-full w-2 h-2"></span>
        </button>
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
        <div className="flex items-center ml-4">
          <img
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="w-8 h-8 rounded-full"
            alt="User profile"
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
