import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, FileDown } from 'lucide-react';
import BookCard from '@/components/library/BookCard';
import { books as mockBooks } from '@/lib/mockData';
import { Book } from '@shared/schema';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'popular'>('popular');
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);


  // In a real app, we would fetch books from the server with filters
  /*
  const { data: books, isLoading } = useQuery({
    queryKey: ['/api/books', { 
      search: searchQuery,
      class: selectedClass,
      subject: selectedSubject,
      sort: sortOrder
    }],
  });
  */

  // For demo, filter books locally
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = selectedClass === '' || book.class === selectedClass;

    const matchesSubject = selectedSubject === '' || 
      book.tags?.some(tag => tag.toLowerCase() === selectedSubject.toLowerCase());

    return matchesSearch && matchesClass && matchesSubject;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.downloadCount || 0) - (a.downloadCount || 0);
    }
  });

  // Extract unique classes and subjects from books
  const classes = Array.from(new Set(mockBooks.map(book => book.class).filter(Boolean)));
  const subjects = Array.from(
    new Set(
      mockBooks.flatMap(book => book.tags || [])
        .filter(tag => !classes.includes(tag))
    )
  );

  const handleDownload = (id: number) => {
    console.log(`Downloading book with id ${id}`);
    // In a real app, we would call the API to increment download count and start the download
    // window.open(`/api/books/${id}/download`, '_blank');
  };

  const handleAdminSuccess = () => {
    setIsAdminMode(true);
    setShowAdminAuth(false);
  };

  return (
    <div className="fade-in">
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <Input 
              placeholder="Search books..." 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Library & Resources</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Browse through our collection of educational resources
            </p>
          </div>
          <AdminButton onSuccess={() => setIsAdminMode(true)} />
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowAdminAuth(true)}
        >
          {isAdminMode ? "Admin Mode Active" : "Admin Login"}
        </Button>
      </div>

      {/* Placeholder for Admin Auth Dialog - Requires additional component implementation */}
      {/* This is a placeholder, a real implementation would be needed here */}
      <div>
        {/*AdminAuthDialog would go here*/}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <h2 className="text-lg font-semibold">Search & Filter</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative col-span-1 md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by title, tag, or subject..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {filteredBooks.length} results
                  </span>
                )}
              </div>
            </div>

            {/* Class Filter */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subject Filter */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort and active filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
              {selectedClass && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Class: {selectedClass}
                  <button 
                    className="ml-1 hover:text-red-500"
                    onClick={() => setSelectedClass('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedSubject && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Subject: {selectedSubject}
                  <button 
                    className="ml-1 hover:text-red-500"
                    onClick={() => setSelectedSubject('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(selectedClass || selectedSubject || searchQuery) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedClass('');
                    setSelectedSubject('');
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Sort by:</span>
              <div className="flex">
                <Button
                  variant={sortOrder === 'popular' ? "default" : "outline"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setSortOrder('popular')}
                >
                  Popular
                </Button>
                <Button
                  variant={sortOrder === 'newest' ? "default" : "outline"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setSortOrder('newest')}
                >
                  Newest
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {sortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} onDownload={handleDownload} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No books found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            className="mt-4"
            onClick={() => {
              setSelectedClass('');
              setSelectedSubject('');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}