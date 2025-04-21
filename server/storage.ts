import { 
  users, User, InsertUser, 
  books, Book, InsertBook,
  requests, Request, InsertRequest,
  teamMembers, TeamMember, InsertTeamMember,
  stats, Stats,
  notifications, Notification, InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Book methods
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  searchBooks(query: string, filters?: { classLevel?: string, subject?: string, tags?: string[] }): Promise<Book[]>;
  incrementDownloadCount(id: number): Promise<Book | undefined>;
  
  // Request methods
  getRequests(): Promise<Request[]>;
  getRequest(id: number): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequestStatus(id: number, status: string): Promise<Request | undefined>;
  
  // Team member methods
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<TeamMember>): Promise<TeamMember | undefined>;
  
  // Stats methods
  getStats(): Promise<Stats>;
  updateStats(stats: Partial<Stats>): Promise<Stats>;
  
  // Notification methods
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private usersDb: Map<number, User>;
  private booksDb: Map<number, Book>;
  private requestsDb: Map<number, Request>;
  private teamMembersDb: Map<number, TeamMember>;
  private statsDb: Stats;
  private notificationsDb: Map<number, Notification>;
  
  private currentUserId: number;
  private currentBookId: number;
  private currentRequestId: number;
  private currentTeamMemberId: number;
  private currentNotificationId: number;

  constructor() {
    this.usersDb = new Map();
    this.booksDb = new Map();
    this.requestsDb = new Map();
    this.teamMembersDb = new Map();
    this.notificationsDb = new Map();
    
    this.currentUserId = 1;
    this.currentBookId = 1;
    this.currentRequestId = 1;
    this.currentTeamMemberId = 1;
    this.currentNotificationId = 1;
    
    // Initialize with some default stats
    this.statsDb = {
      id: 1,
      totalBooks: 256,
      totalDownloads: 1458,
      activeUsers: 89,
      pendingRequests: 12
    };
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample admin user
    this.createUser({
      username: "admin",
      password: "password",
      name: "Alex Johnson",
      email: "alex@genzbroz.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
    });
    
    // Sample books
    const sampleBooks: InsertBook[] = [
      {
        title: "Advanced Calculus Solutions",
        author: "Dr. Robert Chen",
        subject: "Mathematics",
        classLevel: "JEE",
        description: "Comprehensive solutions guide for advanced calculus problems",
        coverImage: "https://images.unsplash.com/photo-1576153192396-180ecef2a715",
        fileType: "PDF",
        fileSize: "28.5 MB",
        tags: ["calculus", "advanced"],
        fileUrl: "/files/advanced-calculus.pdf"
      },
      {
        title: "NEET Biology Complete Guide",
        author: "Dr. Sarah Johnson",
        subject: "Biology",
        classLevel: "NEET",
        description: "Complete study guide for NEET Biology exam preparation",
        coverImage: "https://images.unsplash.com/photo-1603367433513-6ccbe3d0582c",
        fileType: "PDF",
        fileSize: "42.8 MB",
        tags: ["biology", "medical"],
        fileUrl: "/files/neet-biology.pdf"
      },
      {
        title: "Physics Mechanics Problem Set",
        author: "Prof. Michael Wong",
        subject: "Physics",
        classLevel: "12th",
        description: "Collection of mechanics problems with detailed solutions",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        fileType: "DOC",
        fileSize: "15.2 MB",
        tags: ["mechanics", "problems"],
        fileUrl: "/files/physics-mechanics.doc"
      },
      {
        title: "Organic Chemistry Handbook",
        author: "Dr. Priya Sharma",
        subject: "Chemistry",
        classLevel: "JEE",
        description: "Comprehensive handbook for organic chemistry",
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
        fileType: "PDF",
        fileSize: "32.1 MB",
        tags: ["organic", "chemistry"],
        fileUrl: "/files/organic-chemistry.pdf"
      },
      {
        title: "Complete NCERT Solutions",
        author: "GENZ BROZ Team",
        subject: "All Subjects",
        classLevel: "11th",
        description: "Complete solutions for all NCERT textbooks",
        coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646",
        fileType: "PDF",
        fileSize: "56.3 MB",
        tags: ["ncert", "solutions"],
        fileUrl: "/files/ncert-solutions.pdf"
      },
      {
        title: "Advanced English Grammar",
        author: "Prof. Elizabeth Miller",
        subject: "English",
        classLevel: "10th",
        description: "Advanced guide to English grammar rules",
        coverImage: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6",
        fileType: "PDF",
        fileSize: "18.6 MB",
        tags: ["grammar", "language"],
        fileUrl: "/files/english-grammar.pdf"
      }
    ];
    
    sampleBooks.forEach(book => this.createBook(book));
    
    // Sample team members
    const teamMembers: InsertTeamMember[] = [
      {
        name: "Alex Johnson",
        role: "Founder & Lead Developer",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
        tasksCompleted: 24,
        totalTasks: 30,
        joinedDate: "Jan 2023",
        socialLinks: { twitter: "#", linkedin: "#", email: "#" }
      },
      {
        name: "Sophia Martinez",
        role: "Biology Content Creator",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        tasksCompleted: 18,
        totalTasks: 25,
        joinedDate: "Mar 2023",
        socialLinks: { twitter: "#", linkedin: "#", email: "#" }
      },
      {
        name: "David Kim",
        role: "Physics & Mathematics",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        tasksCompleted: 22,
        totalTasks: 28,
        joinedDate: "Feb 2023",
        socialLinks: { twitter: "#", linkedin: "#", email: "#" }
      },
      {
        name: "Raj Patel",
        role: "Chemistry Specialist",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        tasksCompleted: 16,
        totalTasks: 22,
        joinedDate: "Apr 2023",
        socialLinks: { twitter: "#", linkedin: "#", email: "#" }
      }
    ];
    
    teamMembers.forEach(member => this.createTeamMember(member));
    
    // Sample notifications
    const notifications: InsertNotification[] = [
      {
        title: "New JEE Resources",
        description: "15 new resources added for JEE preparation",
        time: "10 mins ago",
        read: false,
        userId: 1
      },
      {
        title: "System Update",
        description: "New features have been added to the platform",
        time: "1 hour ago",
        read: false,
        userId: 1
      },
      {
        title: "Your request was approved",
        description: "Physics Mechanics book is now available",
        time: "5 hours ago",
        read: true,
        userId: 1
      }
    ];
    
    notifications.forEach(notification => this.createNotification(notification));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersDb.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersDb.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.usersDb.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersDb.set(id, updatedUser);
    return updatedUser;
  }

  // Book methods
  async getBooks(): Promise<Book[]> {
    return Array.from(this.booksDb.values());
  }
  
  async getBook(id: number): Promise<Book | undefined> {
    return this.booksDb.get(id);
  }
  
  async createBook(book: InsertBook): Promise<Book> {
    const id = this.currentBookId++;
    const newBook: Book = { 
      ...book, 
      id, 
      downloadCount: 0,
      createdAt: new Date()
    };
    this.booksDb.set(id, newBook);
    
    // Update stats
    this.statsDb.totalBooks++;
    
    return newBook;
  }
  
  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    const book = await this.getBook(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...bookData };
    this.booksDb.set(id, updatedBook);
    return updatedBook;
  }
  
  async deleteBook(id: number): Promise<boolean> {
    const result = this.booksDb.delete(id);
    if (result) {
      this.statsDb.totalBooks--;
    }
    return result;
  }
  
  async searchBooks(query: string, filters?: { classLevel?: string, subject?: string, tags?: string[] }): Promise<Book[]> {
    let books = Array.from(this.booksDb.values());
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery) ||
        book.subject.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (filters) {
      if (filters.classLevel && filters.classLevel !== 'all') {
        books = books.filter(book => book.classLevel === filters.classLevel);
      }
      
      if (filters.subject && filters.subject !== 'all') {
        books = books.filter(book => book.subject === filters.subject);
      }
      
      if (filters.tags && filters.tags.length > 0 && filters.tags[0] !== 'all') {
        books = books.filter(book => 
          book.tags && filters.tags?.some(tag => book.tags?.includes(tag))
        );
      }
    }
    
    return books;
  }
  
  async incrementDownloadCount(id: number): Promise<Book | undefined> {
    const book = await this.getBook(id);
    if (!book) return undefined;
    
    const updatedBook = { 
      ...book, 
      downloadCount: book.downloadCount + 1 
    };
    this.booksDb.set(id, updatedBook);
    
    // Update stats
    this.statsDb.totalDownloads++;
    
    return updatedBook;
  }
  
  // Request methods
  async getRequests(): Promise<Request[]> {
    return Array.from(this.requestsDb.values());
  }
  
  async getRequest(id: number): Promise<Request | undefined> {
    return this.requestsDb.get(id);
  }
  
  async createRequest(request: InsertRequest): Promise<Request> {
    const id = this.currentRequestId++;
    const newRequest: Request = { 
      ...request, 
      id,
      createdAt: new Date()
    };
    this.requestsDb.set(id, newRequest);
    
    // Update stats
    this.statsDb.pendingRequests++;
    
    return newRequest;
  }
  
  async updateRequestStatus(id: number, status: string): Promise<Request | undefined> {
    const request = await this.getRequest(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, status };
    this.requestsDb.set(id, updatedRequest);
    
    // Update stats if needed
    if (request.status === 'pending' && status !== 'pending') {
      this.statsDb.pendingRequests--;
    } else if (request.status !== 'pending' && status === 'pending') {
      this.statsDb.pendingRequests++;
    }
    
    return updatedRequest;
  }
  
  // Team member methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembersDb.values());
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembersDb.get(id);
  }
  
  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentTeamMemberId++;
    const newMember: TeamMember = { ...member, id };
    this.teamMembersDb.set(id, newMember);
    return newMember;
  }
  
  async updateTeamMember(id: number, memberData: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const member = await this.getTeamMember(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...memberData };
    this.teamMembersDb.set(id, updatedMember);
    return updatedMember;
  }
  
  // Stats methods
  async getStats(): Promise<Stats> {
    return this.statsDb;
  }
  
  async updateStats(statsData: Partial<Stats>): Promise<Stats> {
    this.statsDb = { ...this.statsDb, ...statsData };
    return this.statsDb;
  }
  
  // Notification methods
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsDb.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const newNotification: Notification = { 
      ...notification, 
      id,
      createdAt: new Date()
    };
    this.notificationsDb.set(id, newNotification);
    return newNotification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notificationsDb.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notificationsDb.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const notifications = await this.getNotifications(userId);
    
    notifications.forEach(notification => {
      if (!notification.read) {
        this.notificationsDb.set(notification.id, { 
          ...notification, 
          read: true 
        });
      }
    });
    
    return true;
  }
}

export const storage = new MemStorage();
