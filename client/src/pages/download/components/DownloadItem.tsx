import { Book } from "@shared/schema";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DownloadItemProps {
  book: Book;
  onDownload: () => void;
}

const DownloadItem = ({ book, onDownload }: DownloadItemProps) => {
  const getFileTypeIconClass = () => {
    switch (book.fileType) {
      case "PDF":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
          icon: "ri-file-pdf-fill"
        };
      case "DOC":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400",
          icon: "ri-file-word-fill"
        };
      case "PPT":
        return {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-600 dark:text-orange-400",
          icon: "ri-file-ppt-fill"
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-600 dark:text-gray-400",
          icon: "ri-file-fill"
        };
    }
  };

  const iconClasses = getFileTypeIconClass();

  return (
    <div className="px-6 py-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <div className={`w-10 h-10 rounded-lg ${iconClasses.bg} ${iconClasses.text} flex items-center justify-center`}>
          <i className={`${iconClasses.icon} text-xl`}></i>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h4 className="text-sm font-medium truncate">{book.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {book.fileType} • {book.fileSize} • {book.classLevel} {book.subject}
            </p>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-4">
              {book.downloadCount} downloads
            </span>
            <button
              onClick={onDownload}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <i className="ri-download-line text-lg"></i>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <i className="ri-more-2-fill text-lg"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDownload}>
                  <i className="ri-download-line mr-2"></i>
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-share-line mr-2"></i>
                  Share Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-eye-line mr-2"></i>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-bookmark-line mr-2"></i>
                  Save for Later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadItem;
