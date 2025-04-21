import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, FileText, MoreVertical, Copy, Clock, ArrowUpDown, FileType2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { books as mockBooks } from '@/lib/mockData';

export default function DownloadCenter() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'downloads'>('downloads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Group books by subject
  const booksBySubject: Record<string, typeof mockBooks> = {};
  
  mockBooks.forEach(book => {
    book.tags?.forEach(tag => {
      if (!booksBySubject[tag]) {
        booksBySubject[tag] = [];
      }
      booksBySubject[tag].push(book);
    });
  });
  
  // Get unique subjects for tabs
  const subjects = Object.keys(booksBySubject);

  // Filter books based on search query and active tab
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || 
      book.tags?.includes(activeTab);
    
    return matchesSearch && matchesTab;
  });

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let valueA, valueB;
    
    if (sortBy === 'name') {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else if (sortBy === 'size') {
      valueA = a.fileSize || 0;
      valueB = b.fileSize || 0;
    } else {
      valueA = a.downloadCount || 0;
      valueB = b.downloadCount || 0;
    }
    
    return sortOrder === 'asc' 
      ? valueA - valueB 
      : valueB - valueA;
  });

  const handleSort = (newSortBy: 'name' | 'size' | 'downloads') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleDownload = (id: number, title: string) => {
    // In a real app, we would call the API and start the download
    // window.open(`/api/books/${id}/download`, '_blank');
    
    toast({
      title: "Download Started",
      description: `${title} is now downloading.`,
    });
  };

  const handleCopyLink = (id: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/api/books/${id}/download`);
    
    toast({
      title: "Link Copied",
      description: "Download link has been copied to clipboard.",
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getFileTypeIcon = (fileType?: string) => {
    const type = fileType?.toLowerCase();
    
    if (type === 'pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (type === 'xlsx' || type === 'xls') {
      return <FileText className="h-4 w-4 text-green-500" />;
    } else if (type === 'docx' || type === 'doc') {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else {
      return <FileType2 className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Download Center</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Download educational resources organized by subject
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search resources by title, subject, or class..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resources Tabs & Table */}
      <Card>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Resources</CardTitle>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                {subjects.slice(0, 3).map(subject => (
                  <TabsTrigger key={subject} value={subject}>
                    {subject}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <CardDescription className="pt-2">
              Files grouped by subject for easy access
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('name')}
                        className="p-0 h-auto font-medium"
                      >
                        Name
                        {sortBy === 'name' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('size')}
                        className="p-0 h-auto font-medium"
                      >
                        Size
                        {sortBy === 'size' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('downloads')}
                        className="p-0 h-auto font-medium"
                      >
                        Downloads
                        {sortBy === 'downloads' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBooks.length > 0 ? (
                    sortedBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <div className="flex items-start">
                            <div className="mr-3 bg-gray-100 dark:bg-gray-700 p-2 rounded flex items-center justify-center">
                              {getFileTypeIcon(book.fileType)}
                            </div>
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {book.tags?.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.fileType || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {formatFileSize(book.fileSize)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-gray-500" />
                            {book.downloadCount}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hidden md:flex items-center"
                              onClick={() => handleDownload(book.id, book.title)}
                            >
                              <Download className="h-3 w-3 mr-2" />
                              Download
                            </Button>
                            <Button 
                              variant="default" 
                              size="icon"
                              className="md:hidden h-8 w-8"
                              onClick={() => handleDownload(book.id, book.title)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCopyLink(book.id)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-muted-foreground">No resources found</p>
                        {searchQuery && (
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setSearchQuery('')}
                          >
                            Clear Search
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
