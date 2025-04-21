import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();

  const downloadMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("POST", `/api/books/${id}/download`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/books'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/stats'],
      });
    },
  });

  const handleDownload = () => {
    downloadMutation.mutate(book.id);
    // In a real app, this would trigger the actual file download
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would make an API call to save the favorite status
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative pb-[140%]">
        <img
          src={book.coverImage}
          className="absolute inset-0 w-full h-full object-cover"
          alt={book.title}
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <i
              className={`${
                isFavorite ? "ri-heart-fill text-red-500" : "ri-heart-line"
              } text-lg`}
            ></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg leading-tight mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {book.author}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
            {book.classLevel} • {book.subject}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <i className="ri-download-line mr-1"></i>
            <span>{book.downloadCount}</span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {book.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleDownload}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <i className="ri-download-line mr-2"></i>
            Download
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                <i className="ri-more-2-fill"></i>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{book.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-start">
                  <img
                    src={book.coverImage}
                    className="w-24 h-32 object-cover rounded mr-4"
                    alt={book.title}
                  />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Subject:</strong> {book.subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Class/Exam:</strong> {book.classLevel}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>File Type:</strong> {book.fileType}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>File Size:</strong> {book.fileSize}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Downloads:</strong> {book.downloadCount}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {book.description || "No description available."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <i
                      className={`${
                        isFavorite ? "ri-heart-fill text-red-500" : "ri-heart-line"
                      } mr-2`}
                    ></i>
                    {isFavorite ? "Favorited" : "Add to Favorites"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;
