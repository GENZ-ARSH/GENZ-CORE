import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LibraryFilters from "./components/LibraryFilters";
import BookCard from "./components/BookCard";
import { Book } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const LibraryPage = () => {
  const [classFilter, setClassFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['/api/books', classFilter, tagFilter, searchQuery],
    queryFn: async () => {
      let url = '/api/books?';
      
      if (classFilter !== 'all') {
        url += `class=${classFilter}&`;
      }
      
      if (tagFilter !== 'all') {
        url += `tags=${tagFilter}&`;
      }
      
      if (searchQuery) {
        url += `search=${searchQuery}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });

  const handleReset = () => {
    setClassFilter("all");
    setTagFilter("all");
    setSearchQuery("");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Library / Resources</h1>
        <div className="mt-3 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            <i className="ri-add-line mr-2"></i>
            Add Resource
          </button>
        </div>
      </div>

      {/* Filters */}
      <LibraryFilters
        classFilter={classFilter}
        tagFilter={tagFilter}
        searchQuery={searchQuery}
        onClassChange={setClassFilter}
        onTagChange={setTagFilter}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
      />

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <Skeleton className="w-full h-64" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
          : books.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}

        {!isLoading && books.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-medium mb-2">No resources found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={handleReset}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <i className="ri-refresh-line mr-2"></i>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
