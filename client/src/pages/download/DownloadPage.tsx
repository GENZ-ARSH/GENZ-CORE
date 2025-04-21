import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@shared/schema";
import DownloadItem from "./components/DownloadItem";
import { apiRequest } from "@/lib/queryClient";

const DownloadPage = () => {
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['/api/books', subjectFilter, classFilter, fileTypeFilter, searchQuery],
    queryFn: async () => {
      let url = '/api/books?';
      
      if (classFilter !== 'all') {
        url += `class=${classFilter}&`;
      }
      
      if (subjectFilter !== 'all') {
        url += `subject=${subjectFilter}&`;
      }
      
      if (searchQuery) {
        url += `search=${searchQuery}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch books');
      return res.json();
    },
  });

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

  const handleDownload = (id: number) => {
    downloadMutation.mutate(id);
    // In a real app, this would trigger the actual file download
  };

  const handleDownloadAll = () => {
    // In a real app, this would trigger downloading all filtered books
    books.forEach(book => {
      downloadMutation.mutate(book.id);
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Download Center</h1>
        <div className="mt-3 sm:mt-0">
          <Button 
            onClick={handleDownloadAll}
            className="inline-flex items-center"
          >
            <i className="ri-download-cloud-2-line mr-2"></i>
            Download All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="subject-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Subject
            </label>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger id="subject-filter">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="class-filter-dl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Class/Exam
            </label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger id="class-filter-dl">
                <SelectValue placeholder="Select class or exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="JEE">JEE</SelectItem>
                <SelectItem value="NEET">NEET</SelectItem>
                <SelectItem value="12th">12th</SelectItem>
                <SelectItem value="11th">11th</SelectItem>
                <SelectItem value="10th">10th</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              File Type
            </label>
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
                <SelectItem value="Images">Images</SelectItem>
                <SelectItem value="Videos">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="search-downloads"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search
            </label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="search-downloads"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="Search files..."
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Download Files */}
      <Card className="shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg">All Files</h3>
          <div className="flex items-center">
            <button className="mr-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <i className="ri-list-check-2 text-lg"></i>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <i className="ri-grid-fill text-lg"></i>
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading
            ? Array(5).fill(null).map((_, index) => (
                <div key={index} className="px-6 py-4 flex items-center">
                  <Skeleton className="w-10 h-10 rounded-lg mr-4" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                  <Skeleton className="h-8 w-24 ml-2" />
                </div>
              ))
            : books.map((book: Book) => (
                <DownloadItem
                  key={book.id}
                  book={book}
                  onDownload={() => handleDownload(book.id)}
                />
              ))}

          {!isLoading && books.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="text-xl font-medium mb-2">No files found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>

        {books.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <Select defaultValue="10">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <span className="text-sm">Page 1 of 1</span>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DownloadPage;
