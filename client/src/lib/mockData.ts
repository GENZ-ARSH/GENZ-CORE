import { Book, User, Task, Activity, BookRequest } from '@shared/schema';

// Mock User Data
export const users: User[] = [
  {
    id: 1,
    username: 'aryan.sharma',
    password: 'hashed_password',
    fullName: 'Aryan Sharma',
    email: 'aryan@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    role: 'admin'
  },
  {
    id: 2,
    username: 'rahul.kumar',
    password: 'hashed_password',
    fullName: 'Rahul Kumar',
    email: 'rahul@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    role: 'user'
  },
  {
    id: 3,
    username: 'priya.singh',
    password: 'hashed_password',
    fullName: 'Priya Singh',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    role: 'user'
  },
  {
    id: 4,
    username: 'amit.patel',
    password: 'hashed_password',
    fullName: 'Amit Patel',
    email: 'amit@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    role: 'moderator'
  }
];

// Mock Book Data
export const books: Book[] = [
  {
    id: 1,
    title: 'Physics NCERT Class 12',
    author: 'NCERT',
    description: 'Complete NCERT textbook for Class 12 Physics',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fileUrl: '/files/physics_ncert_12.pdf',
    fileSize: 15600,
    fileType: 'PDF',
    downloadCount: 428,
    tags: ['Physics', 'NCERT', 'Class 12'],
    class: 'Class 12',
    createdAt: new Date('2023-08-10'),
    createdBy: 1
  },
  {
    id: 2,
    title: 'JEE Chemistry Formula Sheet',
    author: 'Team GENZ',
    description: 'Comprehensive formula sheet for JEE Chemistry preparation',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fileUrl: '/files/jee_chemistry_formula.pdf',
    fileSize: 8200,
    fileType: 'PDF',
    downloadCount: 362,
    tags: ['Chemistry', 'JEE', 'Formula'],
    class: 'JEE',
    createdAt: new Date('2023-09-15'),
    createdBy: 1
  },
  {
    id: 3,
    title: 'NEET Biology Complete Guide',
    author: 'Dr. Verma',
    description: 'Complete study guide for NEET Biology preparation',
    coverImage: 'https://images.unsplash.com/photo-1629468855534-de343dd69843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fileUrl: '/files/neet_biology_guide.pdf',
    fileSize: 22400,
    fileType: 'PDF',
    downloadCount: 291,
    tags: ['Biology', 'NEET', 'Study Guide'],
    class: 'NEET',
    createdAt: new Date('2023-10-02'),
    createdBy: 2
  },
  {
    id: 4,
    title: 'Mathematics Practice Problems',
    author: 'RD Sharma',
    description: 'Collection of mathematics practice problems for all classes',
    coverImage: 'https://images.unsplash.com/photo-1578496479635-b23c38f5149a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fileUrl: '/files/math_practice.pdf',
    fileSize: 18600,
    fileType: 'PDF',
    downloadCount: 256,
    tags: ['Mathematics', 'Practice', 'All Classes'],
    class: 'All Classes',
    createdAt: new Date('2023-10-10'),
    createdBy: 1
  },
  {
    id: 5,
    title: 'JEE Advanced Formula Sheet',
    author: 'Team GENZ',
    description: 'Comprehensive formula sheet for JEE Advanced preparation',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fileUrl: '/files/jee_advanced_formula.pdf',
    fileSize: 2400,
    fileType: 'PDF',
    downloadCount: 189,
    tags: ['Physics', 'Chemistry', 'JEE Advanced'],
    class: 'JEE Advanced',
    createdAt: new Date('2023-11-05'),
    createdBy: 3
  },
  {
    id: 6,
    title: 'NEET Topic Weightage',
    author: 'Team GENZ',
    description: 'Analysis of topic-wise weightage for NEET exam',
    coverImage: 'https://images.unsplash.com/photo-1613843433065-87a6f58ca055?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fileUrl: '/files/neet_weightage.xlsx',
    fileSize: 1200,
    fileType: 'XLSX',
    downloadCount: 142,
    tags: ['NEET', 'Exam Strategy', 'Weightage'],
    class: 'NEET',
    createdAt: new Date('2023-11-15'),
    createdBy: 2
  }
];

// Mock Task Data
export const tasks: Task[] = [
  {
    id: 1,
    title: 'Upload Physics Formula Sheet',
    description: 'Compile and upload comprehensive formula sheet for Physics',
    dueDate: new Date('2023-12-15'),
    status: 'todo',
    assignedTo: 1,
    createdBy: 4,
    createdAt: new Date('2023-12-10')
  },
  {
    id: 2,
    title: 'Review JEE Mock Tests',
    description: 'Review and correct answers for latest JEE mock test papers',
    dueDate: new Date('2023-12-18'),
    status: 'todo',
    assignedTo: 2,
    createdBy: 1,
    createdAt: new Date('2023-12-12')
  },
  {
    id: 3,
    title: 'Update Biology Resources',
    description: 'Update biology resources with latest syllabus changes',
    dueDate: new Date('2023-12-25'),
    status: 'todo',
    assignedTo: 3,
    createdBy: 1,
    createdAt: new Date('2023-12-10')
  },
  {
    id: 4,
    title: 'Create Chemistry Flashcards',
    description: 'Design and upload chemistry reaction flashcards',
    dueDate: new Date('2023-12-20'),
    status: 'in-progress',
    assignedTo: 1,
    createdBy: 1,
    createdAt: new Date('2023-12-13')
  },
  {
    id: 5,
    title: 'Moderate Forum Discussions',
    description: 'Review and moderate new forum posts and discussions',
    dueDate: new Date('2023-12-16'),
    status: 'in-progress',
    assignedTo: 4,
    createdBy: 1,
    createdAt: new Date('2023-12-14')
  }
];

// Mock Activity Data
export const activities: Activity[] = [
  {
    id: 1,
    type: 'upload',
    description: 'was uploaded',
    userId: 1,
    resourceId: 1,
    resourceType: 'book',
    timestamp: new Date('2023-12-14T10:30:00')
  },
  {
    id: 2,
    type: 'download',
    description: 'was downloaded',
    userId: 2,
    resourceId: 2,
    resourceType: 'book',
    timestamp: new Date('2023-12-14T12:45:00')
  },
  {
    id: 3,
    type: 'user',
    description: 'joined TeamGENZ',
    userId: 3,
    resourceId: null,
    resourceType: null,
    timestamp: new Date('2023-12-13T15:20:00')
  },
  {
    id: 4,
    type: 'request',
    description: 'was submitted',
    userId: 2,
    resourceId: 1,
    resourceType: 'book-request',
    timestamp: new Date('2023-12-12T09:10:00')
  }
];

// Mock Book Request Data
export const bookRequests: BookRequest[] = [
  {
    id: 1,
    title: 'Chemistry NCERT Solutions',
    author: 'NCERT',
    description: 'Need detailed solutions for chemistry NCERT exercises',
    requestedBy: 2,
    status: 'pending',
    createdAt: new Date('2023-12-12T09:10:00')
  },
  {
    id: 2,
    title: 'Physics Previous Year Papers',
    author: 'Various',
    description: 'Collection of previous year papers with solutions for Physics',
    requestedBy: 3,
    status: 'approved',
    createdAt: new Date('2023-12-10T14:25:00')
  },
  {
    id: 3,
    title: 'Mathematics Exemplar Problems',
    author: 'NCERT',
    description: 'NCERT Exemplar book with solutions for JEE preparation',
    requestedBy: 2,
    status: 'completed',
    createdAt: new Date('2023-12-08T11:15:00')
  }
];

// Mock Download Items (for UI display)
export const recentDownloads = [
  {
    id: 1,
    title: 'JEE Advanced Formula Sheet',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    icon: 'pdf' as 'pdf'
  },
  {
    id: 2,
    title: 'NEET Topic Weightage',
    fileType: 'XLSX',
    fileSize: '1.2 MB',
    icon: 'excel' as 'excel'
  },
  {
    id: 3,
    title: '12th Physics Notes',
    fileType: 'DOCX',
    fileSize: '3.8 MB',
    icon: 'word' as 'word'
  }
];

// For the dashboard
export const statsData = [
  {
    title: 'Total Books',
    value: 256,
    change: 12,
    icon: 'book',
  },
  {
    title: 'Downloads',
    value: 1024,
    change: 24,
    icon: 'download',
  },
  {
    title: 'Upload Requests',
    value: 12,
    change: -8,
    icon: 'upload',
  },
  {
    title: 'Active Users',
    value: 85,
    change: 16,
    icon: 'user',
  }
];

// Transform activities to UI format
export const dashboardActivities = activities.map(activity => {
  let title = '';
  if (activity.resourceType === 'book') {
    title = books.find(b => b.id === activity.resourceId)?.title || '';
  } else if (activity.resourceType === 'book-request') {
    title = bookRequests.find(r => r.id === activity.resourceId)?.title || '';
  } else {
    title = users.find(u => u.id === activity.userId)?.fullName || '';
  }

  return {
    id: activity.id,
    type: activity.type as 'upload' | 'download' | 'user' | 'request',
    title,
    description: activity.description,
    time: formatTimeAgo(activity.timestamp || new Date()),
  };
});

// Transform tasks to UI format
export const pendingTasks = tasks
  .filter(task => task.status === 'todo')
  .map(task => ({
    id: task.id,
    title: task.title,
    dueDate: formatDueDate(task.dueDate || new Date()),
    completed: false,
  }));

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function formatDueDate(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'Overdue';
  if (diffInDays === 0) return 'Due today';
  if (diffInDays === 1) return 'Due tomorrow';
  if (diffInDays < 7) return `Due in ${diffInDays} days`;
  
  return `Due ${date.toLocaleDateString()}`;
}
