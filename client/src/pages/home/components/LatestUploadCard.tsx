import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@shared/schema";
import { useLocation } from "wouter";

interface LatestUploadCardProps {
  books: Book[];
  isLoading: boolean;
}

const LatestUploadCard = ({ books, isLoading }: LatestUploadCardProps) => {
  const [_, navigate] = useLocation();

  const handleViewAll = () => {
    navigate("/library");
  };

  const handleDownload = (bookId: number) => {
    fetch(`/api/books/${bookId}/download`, {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) {
          // In a real app, this would redirect to the file or trigger a download
          console.log(`Downloading book ${bookId}`);
        }
      })
      .catch((err) => console.error("Error downloading book:", err));
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Latest Uploads</h3>
        <button
          onClick={handleViewAll}
          className="text-sm text-primary-600 dark:text-primary-400 font-medium"
        >
          View all
        </button>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading
          ? Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="p-4 sm:px-6 flex items-center">
                  <Skeleton className="w-16 h-20 rounded mr-4" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))
          : books.map((book) => (
              <div
                key={book.id}
                className="p-4 sm:px-6 flex items-center"
              >
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={book.coverImage}
                    className="w-16 h-20 object-cover rounded"
                    alt={`Cover of ${book.title}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{book.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {book.classLevel} • {book.subject}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {book.fileType}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {book.fileSize} • {book.description}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(book.id)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <i className="ri-download-line text-lg"></i>
                  </button>
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
};

export default LatestUploadCard;
