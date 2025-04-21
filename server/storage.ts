import { 
  users, type User, type InsertUser,
  books, type Book, type InsertBook,
  tasks, type Task, type InsertTask,
  bookRequests, type BookRequest, type InsertBookRequest,
  activities, type Activity, type InsertActivity,
  documents, type Document, type InsertDocument,
  documentCollaborators, type DocumentCollaborator, type InsertDocumentCollaborator,
  documentOperations, type DocumentOperation, type InsertDocumentOperation
} from "@shared/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { db } from "./db";

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
  
  // Document collaboration methods
  getDocuments(): Promise<Document[]>;
  getDocumentsByUser(userId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Document collaborators methods
  getDocumentCollaborators(documentId: number): Promise<DocumentCollaborator[]>;
  addCollaborator(collaborator: InsertDocumentCollaborator): Promise<DocumentCollaborator>;
  removeCollaborator(documentId: number, userId: number): Promise<boolean>;
  
  // Document operations methods
  getDocumentOperations(documentId: number): Promise<DocumentOperation[]>;
  createDocumentOperation(operation: InsertDocumentOperation): Promise<DocumentOperation>;
  getLatestVersion(documentId: number): Promise<number>;
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

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Book methods
  async getBooks(): Promise<Book[]> {
    return db.select().from(books);
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book || undefined;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db
      .insert(books)
      .values(insertBook)
      .returning();
    return book;
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    const [book] = await db
      .update(books)
      .set(bookData)
      .where(eq(books.id, id))
      .returning();
    return book || undefined;
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await db.delete(books).where(eq(books.id, id));
    return !!result;
  }

  async incrementDownloadCount(id: number): Promise<Book | undefined> {
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, id));
    
    if (!book) return undefined;
    
    const [updatedBook] = await db
      .update(books)
      .set({ downloadCount: (book.downloadCount || 0) + 1 })
      .where(eq(books.id, id))
      .returning();
    
    return updatedBook;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return !!result;
  }

  // Book Request methods
  async getBookRequests(): Promise<BookRequest[]> {
    return db.select().from(bookRequests);
  }

  async getBookRequest(id: number): Promise<BookRequest | undefined> {
    const [request] = await db.select().from(bookRequests).where(eq(bookRequests.id, id));
    return request || undefined;
  }

  async createBookRequest(insertRequest: InsertBookRequest): Promise<BookRequest> {
    const [request] = await db
      .insert(bookRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateBookRequest(id: number, requestData: Partial<BookRequest>): Promise<BookRequest | undefined> {
    const [request] = await db
      .update(bookRequests)
      .set(requestData)
      .where(eq(bookRequests.id, id))
      .returning();
    return request || undefined;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return db.select().from(activities).orderBy(desc(activities.timestamp));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  // Document collaboration methods
  async getDocuments(): Promise<Document[]> {
    return db.select().from(documents);
  }

  async getDocumentsByUser(userId: number): Promise<Document[]> {
    // Get documents created by the user
    const userDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.createdBy, userId));
    
    // Get documents where the user is a collaborator
    const collaborativeDocumentIds = await db
      .select({ documentId: documentCollaborators.documentId })
      .from(documentCollaborators)
      .where(eq(documentCollaborators.userId, userId));
    
    const collaborativeDocuments = collaborativeDocumentIds.length > 0
      ? await db
          .select()
          .from(documents)
          .where(
            collaborativeDocumentIds.length === 1
              ? eq(documents.id, collaborativeDocumentIds[0].documentId)
              : collaborativeDocumentIds.map(d => d.documentId).reduce((acc, id, index) => {
                  if (index === 0) return eq(documents.id, id);
                  return or(acc, eq(documents.id, id));
                }, eq(documents.id, -1)) // Start with a condition that's always false
          )
      : [];
    
    // Combine and remove duplicates
    const allDocs = [...userDocuments, ...collaborativeDocuments];
    const uniqueDocs = allDocs.filter((doc, index, self) => 
      index === self.findIndex(d => d.id === doc.id)
    );
    
    return uniqueDocs;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async updateDocument(id: number, documentData: Partial<Document>): Promise<Document | undefined> {
    // Set updatedAt to current time
    const dataWithTimestamp = {
      ...documentData,
      updatedAt: new Date()
    };
    
    const [document] = await db
      .update(documents)
      .set(dataWithTimestamp)
      .where(eq(documents.id, id))
      .returning();
    
    return document || undefined;
  }

  async deleteDocument(id: number): Promise<boolean> {
    // First delete all collaborators
    await db.delete(documentCollaborators).where(eq(documentCollaborators.documentId, id));
    
    // Then delete all operations
    await db.delete(documentOperations).where(eq(documentOperations.documentId, id));
    
    // Finally delete the document
    const result = await db.delete(documents).where(eq(documents.id, id));
    return !!result;
  }

  // Document collaborators methods
  async getDocumentCollaborators(documentId: number): Promise<DocumentCollaborator[]> {
    return db
      .select()
      .from(documentCollaborators)
      .where(eq(documentCollaborators.documentId, documentId));
  }

  async addCollaborator(insertCollaborator: InsertDocumentCollaborator): Promise<DocumentCollaborator> {
    // Check if collaborator already exists
    const [existing] = await db
      .select()
      .from(documentCollaborators)
      .where(
        and(
          eq(documentCollaborators.documentId, insertCollaborator.documentId),
          eq(documentCollaborators.userId, insertCollaborator.userId)
        )
      );
    
    if (existing) {
      // If exists but access level is different, update it
      if (existing.accessLevel !== insertCollaborator.accessLevel) {
        const [updated] = await db
          .update(documentCollaborators)
          .set({ accessLevel: insertCollaborator.accessLevel })
          .where(eq(documentCollaborators.id, existing.id))
          .returning();
        return updated;
      }
      return existing;
    }
    
    // Otherwise create new collaborator
    const [collaborator] = await db
      .insert(documentCollaborators)
      .values(insertCollaborator)
      .returning();
    
    return collaborator;
  }

  async removeCollaborator(documentId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(documentCollaborators)
      .where(
        and(
          eq(documentCollaborators.documentId, documentId),
          eq(documentCollaborators.userId, userId)
        )
      );
    
    return !!result;
  }

  // Document operations methods
  async getDocumentOperations(documentId: number): Promise<DocumentOperation[]> {
    return db
      .select()
      .from(documentOperations)
      .where(eq(documentOperations.documentId, documentId))
      .orderBy(documentOperations.version);
  }

  async createDocumentOperation(insertOperation: InsertDocumentOperation): Promise<DocumentOperation> {
    const [operation] = await db
      .insert(documentOperations)
      .values(insertOperation)
      .returning();
    
    return operation;
  }

  async getLatestVersion(documentId: number): Promise<number> {
    const [result] = await db
      .select({ maxVersion: documentOperations.version })
      .from(documentOperations)
      .where(eq(documentOperations.documentId, documentId))
      .orderBy(desc(documentOperations.version))
      .limit(1);
    
    return result?.maxVersion || 0;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
