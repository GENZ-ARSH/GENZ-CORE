import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Book } from "@shared/schema";

const ResourceManagement = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['/api/books', page, itemsPerPage],
    queryFn: async () => {
      const res = await fetch(`/api/books?page=${page}&limit=${itemsPerPage}`);
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/books/${id}`, {});
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      deleteBookMutation.mutate(id);
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Resource
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Class/Exam
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Downloads
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading
              ? Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded mr-4" />
                          <div className="ml-4 space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-10" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
              : books.map((book: Book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded">
                          {book.coverImage && (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">
                            {book.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {book.fileType} • {book.fileSize}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {book.classLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {book.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-3"
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Resource</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p>Edit functionality coming soon</p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of 8
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === 8}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResourceManagement;
