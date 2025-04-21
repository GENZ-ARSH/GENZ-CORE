import { 
  users, type User, type InsertUser,
  books, type Book, type InsertBook,
  tasks, type Task, type InsertTask,
  bookRequests, type BookRequest, type InsertBookRequest,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Book methods
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  incrementDownloadCount(id: number): Promise<Book | undefined>;
  
  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Book Request methods
  getBookRequests(): Promise<BookRequest[]>;
  getBookRequest(id: number): Promise<BookRequest | undefined>;
  createBookRequest(request: InsertBookRequest): Promise<BookRequest>;
  updateBookRequest(id: number, request: Partial<BookRequest>): Promise<BookRequest | undefined>;
  
  // Activity methods
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private tasks: Map<number, Task>;
  private bookRequests: Map<number, BookRequest>;
  private activities: Map<number, Activity>;
  
  private userIdCounter: number;
  private bookIdCounter: number;
  private taskIdCounter: number;
  private requestIdCounter: number;
  private activityIdCounter: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.tasks = new Map();
    this.bookRequests = new Map();
    this.activities = new Map();
    
    this.userIdCounter = 1;
    this.bookIdCounter = 1;
    this.taskIdCounter = 1;
    this.requestIdCounter = 1;
    this.activityIdCounter = 1;
    
    // Initialize with some mock data
    this.initializeData();
  }

  private initializeData() {
    // Add mock users
    const mockUsers: InsertUser[] = [
      {
        username: 'aryan.sharma',
        password: 'hashed_password',
        fullName: 'Aryan Sharma',
        email: 'aryan@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
        role: 'admin'
      },
      {
        username: 'rahul.kumar',
        password: 'hashed_password',
        fullName: 'Rahul Kumar',
        email: 'rahul@example.com',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
        role: 'user'
      },
      {
        username: 'priya.singh',
        password: 'hashed_password',
        fullName: 'Priya Singh',
        email: 'priya@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
        role: 'user'
      },
      {
        username: 'amit.patel',
        password: 'hashed_password',
        fullName: 'Amit Patel',
        email: 'amit@example.com',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
        role: 'moderator'
      }
    ];
    
    mockUsers.forEach(user => this.createUser(user));
    
    // Add mock books
    const mockBooks: InsertBook[] = [
      {
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
        createdBy: 1
      },
      {
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
        createdBy: 1
      },
      {
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
        createdBy: 2
      },
      {
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
        createdBy: 1
      },
      {
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
        createdBy: 3
      },
      {
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
        createdBy: 2
      }
    ];
    
    mockBooks.forEach(book => this.createBook(book));
    
    // Add mock tasks
    const mockTasks: InsertTask[] = [
      {
        title: 'Upload Physics Formula Sheet',
        description: 'Compile and upload comprehensive formula sheet for Physics',
        dueDate: new Date('2023-12-15'),
        status: 'todo',
        assignedTo: 1,
        createdBy: 4
      },
      {
        title: 'Review JEE Mock Tests',
        description: 'Review and correct answers for latest JEE mock test papers',
        dueDate: new Date('2023-12-18'),
        status: 'todo',
        assignedTo: 2,
        createdBy: 1
      },
      {
        title: 'Update Biology Resources',
        description: 'Update biology resources with latest syllabus changes',
        dueDate: new Date('2023-12-25'),
        status: 'todo',
        assignedTo: 3,
        createdBy: 1
      },
      {
        title: 'Create Chemistry Flashcards',
        description: 'Design and upload chemistry reaction flashcards',
        dueDate: new Date('2023-12-20'),
        status: 'in-progress',
        assignedTo: 1,
        createdBy: 1
      },
      {
        title: 'Moderate Forum Discussions',
        description: 'Review and moderate new forum posts and discussions',
        dueDate: new Date('2023-12-16'),
        status: 'in-progress',
        assignedTo: 4,
        createdBy: 1
      }
    ];
    
    mockTasks.forEach(task => this.createTask(task));
    
    // Add mock book requests
    const mockRequests: InsertBookRequest[] = [
      {
        title: 'Chemistry NCERT Solutions',
        author: 'NCERT',
        description: 'Need detailed solutions for chemistry NCERT exercises',
        requestedBy: 2
      },
      {
        title: 'Physics Previous Year Papers',
        author: 'Various',
        description: 'Collection of previous year papers with solutions for Physics',
        requestedBy: 3
      },
      {
        title: 'Mathematics Exemplar Problems',
        author: 'NCERT',
        description: 'NCERT Exemplar book with solutions for JEE preparation',
        requestedBy: 2
      }
    ];
    
    mockRequests[0].status = 'pending';
    mockRequests[1].status = 'approved';
    mockRequests[2].status = 'completed';
    
    mockRequests.forEach(request => this.createBookRequest(request));
    
    // Add mock activities
    const mockActivities: InsertActivity[] = [
      {
        type: 'upload',
        description: 'was uploaded',
        userId: 1,
        resourceId: 1,
        resourceType: 'book'
      },
      {
        type: 'download',
        description: 'was downloaded',
        userId: 2,
        resourceId: 2,
        resourceType: 'book'
      },
      {
        type: 'user',
        description: 'joined TeamGENZ',
        userId: 3
      },
      {
        type: 'request',
        description: 'was submitted',
        userId: 2,
        resourceId: 1,
        resourceType: 'book-request'
      }
    ];
    
    mockActivities.forEach(activity => this.createActivity(activity));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Book methods
  async getBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookIdCounter++;
    const book: Book = {
      ...insertBook,
      id,
      downloadCount: insertBook.downloadCount || 0,
      createdAt: new Date()
    };
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...bookData };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  async incrementDownloadCount(id: number): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook = {
      ...book,
      downloadCount: (book.downloadCount || 0) + 1
    };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Book Request methods
  async getBookRequests(): Promise<BookRequest[]> {
    return Array.from(this.bookRequests.values());
  }

  async getBookRequest(id: number): Promise<BookRequest | undefined> {
    return this.bookRequests.get(id);
  }

  async createBookRequest(insertRequest: InsertBookRequest): Promise<BookRequest> {
    const id = this.requestIdCounter++;
    const request: BookRequest = {
      ...insertRequest,
      id,
      status: insertRequest.status || 'pending',
      createdAt: new Date()
    };
    this.bookRequests.set(id, request);
    return request;
  }

  async updateBookRequest(id: number, requestData: Partial<BookRequest>): Promise<BookRequest | undefined> {
    const request = this.bookRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...requestData };
    this.bookRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = {
      ...insertActivity,
      id,
      timestamp: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
