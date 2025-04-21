import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserCircle, 
  Mail, 
  AtSign, 
  ShieldCheck, 
  Calendar, 
  Book, 
  Clock,
  Download,
  Edit,
  FileText,
  Activity  
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { books as mockBooks } from '@/lib/mockData';

// Filter to get the user's recent downloads - in a real app, this would come from the API
const recentDownloads = mockBooks.slice(0, 3);

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <UserCircle className="h-12 w-12 text-gray-400" />
              <div>
                <h2 className="text-xl font-bold">Not Logged In</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Please log in to view your profile.
                </p>
              </div>
              <Button>Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={`${user.fullName}'s avatar`} 
                  className="h-24 w-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl mb-4">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <CardTitle>{user.fullName}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <ShieldCheck className="h-4 w-4 mr-1 text-primary" />
                <span className="capitalize">{user.role}</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <AtSign className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-medium">January 2023</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Book className="h-4 w-4 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Resources</p>
                  <p className="font-medium">12 Uploads, 42 Downloads</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
        
        {/* Activity Tabs Card */}
        <Card className="md:col-span-2">
          <Tabs defaultValue="downloads">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activity</CardTitle>
                <TabsList>
                  <TabsTrigger value="downloads" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Downloads</span>
                  </TabsTrigger>
                  <TabsTrigger value="uploads" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Uploads</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Your recent interactions and activity
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="downloads" className="mt-0">
                <h3 className="font-medium mb-4">Recent Downloads</h3>
                <div className="space-y-4">
                  {recentDownloads.map((book) => (
                    <div key={book.id} className="flex items-start">
                      <div className="mr-3 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{book.title}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(book.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{book.fileType} • {(book.fileSize / 1024).toFixed(2)} MB</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {book.tags?.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {recentDownloads.length === 0 && (
                    <div className="text-center py-8">
                      <Download className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No downloads yet</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">View All Downloads</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="uploads" className="mt-0">
                <h3 className="font-medium mb-4">Your Uploads</h3>
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No uploads yet</p>
                  <Button className="mt-4">Upload a Resource</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-0">
                <h3 className="font-medium mb-4">Recent Activity</h3>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[7px] w-[2px] bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">Downloaded JEE Chemistry Formula Sheet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Completed task: Update Biology Resources</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">5 days ago</p>
                      </div>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-amber-500"></div>
                      <div>
                        <p className="font-medium">Requested new resource: Mathematics Exemplar</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">1 week ago</p>
                      </div>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">Joined TeamGENZ</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">January 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Statistics Card */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your activity and contribution metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Downloads</p>
                <h3 className="text-2xl font-bold mt-1">42</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Uploads</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</p>
                <h3 className="text-2xl font-bold mt-1">8</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Resources Requested</p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-medium mb-4">Most Downloaded Subjects</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Physics</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Mathematics</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Chemistry</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
