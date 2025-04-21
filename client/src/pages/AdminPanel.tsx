import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
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
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Book, Download, Edit, Trash, MoreVertical, Plus, Users, BookPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { books as mockBooks, bookRequests, users } from '@/lib/mockData';

export default function AdminPanel() {
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('books');
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // In a real app, we would fetch this data from the server
  /*
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: ['/api/books/admin'],
  });
  
  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['/api/book-requests'],
  });
  
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/users'],
  });
  */

  const deleteBookMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, we would call the API
      // await apiRequest('DELETE', `/api/books/${id}`);
      console.log(`Deleting book with id ${id}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Book Deleted",
        description: "The book has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      // In a real app, we would invalidate the query
      // queryClient.invalidateQueries({ queryKey: ['/api/books/admin'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete book",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const approveRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, we would call the API
      // await apiRequest('PATCH', `/api/book-requests/${id}`, { status: 'approved' });
      console.log(`Approving request with id ${id}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Request Approved",
        description: "The book request has been approved.",
      });
      // In a real app, we would invalidate the query
      // queryClient.invalidateQueries({ queryKey: ['/api/book-requests'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to approve request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div>
                <h2 className="text-xl font-bold">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  You need administrator privileges to access this page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handleDeleteClick(id: number) {
    setBookToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (bookToDelete) {
      deleteBookMutation.mutate(bookToDelete);
    }
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage books, requests, and users
          </p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </div>

      <Tabs defaultValue="books" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="books" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Books</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <BookPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle>Books & Resources</CardTitle>
              <CardDescription>
                Manage all educational resources in the library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden md:table-cell">Class/Category</TableHead>
                      <TableHead className="hidden md:table-cell">Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.class && (
                            <Badge variant="outline">{book.class}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1 text-gray-500" />
                            {book.downloadCount}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400"
                                onClick={() => handleDeleteClick(book.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Book Requests</CardTitle>
              <CardDescription>
                Review and manage pending book requests from users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookRequests.map((request) => {
                      const requestUser = users.find(u => u.id === request.requestedBy);
                      
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.title}</TableCell>
                          <TableCell>{requestUser?.fullName || 'Unknown'}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={request.status === 'pending' ? 'outline' : 
                              request.status === 'approved' ? 'secondary' : 'default'}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                {request.status === 'pending' && (
                                  <DropdownMenuItem
                                    onClick={() => approveRequestMutation.mutate(request.id)}
                                  >
                                    Approve Request
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={`${user.fullName}'s avatar`} 
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium">{user.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={user.role === 'admin' ? 'default' : 
                            user.role === 'moderator' ? 'secondary' : 'outline'}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the book and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
