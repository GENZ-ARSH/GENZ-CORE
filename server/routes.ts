import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Book, InsertBook, Task, InsertTask, BookRequest, InsertBookRequest, Activity, InsertActivity } from "@shared/schema";
import { z } from "zod";
import { insertBookSchema, insertTaskSchema, insertBookRequestSchema, insertActivitySchema } from "@shared/schema";
import { WebSocketServer, WebSocket } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Books endpoints
  app.get("/api/books", async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const className = req.query.class as string | undefined;
      const subject = req.query.subject as string | undefined;
      const sort = req.query.sort as string | undefined;
      
      const books = await storage.getBooks();
      let filteredBooks = [...books];
      
      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(searchLower) || 
          book.author.toLowerCase().includes(searchLower) ||
          book.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (className) {
        filteredBooks = filteredBooks.filter(book => book.class === className);
      }
      
      if (subject) {
        filteredBooks = filteredBooks.filter(book => 
          book.tags?.some(tag => tag.toLowerCase() === subject.toLowerCase())
        );
      }
      
      // Apply sorting
      if (sort === 'newest') {
        filteredBooks.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      } else if (sort === 'popular') {
        filteredBooks.sort((a, b) => 
          (b.downloadCount || 0) - (a.downloadCount || 0)
        );
      }
      
      res.json(filteredBooks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBook(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const bookData = insertBookSchema.parse(req.body);
      const newBook = await storage.createBook(bookData);
      
      // Log activity
      await storage.createActivity({
        type: "upload",
        description: "was uploaded",
        userId: bookData.createdBy || 1,
        resourceId: newBook.id,
        resourceType: "book"
      });
      
      res.status(201).json(newBook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating book" });
    }
  });

  app.patch("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bookData = req.body;
      
      const updatedBook = await storage.updateBook(id, bookData);
      
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: "Error updating book" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBook(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting book" });
    }
  });

  app.post("/api/books/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.incrementDownloadCount(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Log activity
      await storage.createActivity({
        type: "download",
        description: "was downloaded",
        userId: req.body.userId || 1,
        resourceId: id,
        resourceType: "book"
      });
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error processing download" });
    }
  });

  // Tasks endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const assignedTo = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined;
      const status = req.query.status as string | undefined;
      
      const tasks = await storage.getTasks();
      let filteredTasks = [...tasks];
      
      if (assignedTo) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === assignedTo);
      }
      
      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }
      
      res.json(filteredTasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(taskData);
      
      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = req.body;
      
      const updatedTask = await storage.updateTask(id, taskData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task" });
    }
  });

  // Book Requests endpoints
  app.get("/api/book-requests", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const requestedBy = req.query.requestedBy ? parseInt(req.query.requestedBy as string) : undefined;
      
      const requests = await storage.getBookRequests();
      let filteredRequests = [...requests];
      
      if (status) {
        filteredRequests = filteredRequests.filter(request => request.status === status);
      }
      
      if (requestedBy) {
        filteredRequests = filteredRequests.filter(request => request.requestedBy === requestedBy);
      }
      
      res.json(filteredRequests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book requests" });
    }
  });

  app.get("/api/book-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getBookRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Book request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book request" });
    }
  });

  app.post("/api/book-requests", async (req, res) => {
    try {
      const requestData = insertBookRequestSchema.parse(req.body);
      const newRequest = await storage.createBookRequest(requestData);
      
      // Log activity
      await storage.createActivity({
        type: "request",
        description: "was submitted",
        userId: requestData.requestedBy,
        resourceId: newRequest.id,
        resourceType: "book-request"
      });
      
      res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating book request" });
    }
  });

  app.patch("/api/book-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = req.body;
      
      const updatedRequest = await storage.updateBookRequest(id, requestData);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Book request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error updating book request" });
    }
  });

  // Activities endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const resourceType = req.query.resourceType as string | undefined;
      
      const activities = await storage.getActivities();
      let filteredActivities = [...activities];
      
      if (userId) {
        filteredActivities = filteredActivities.filter(activity => activity.userId === userId);
      }
      
      if (resourceType) {
        filteredActivities = filteredActivities.filter(activity => activity.resourceType === resourceType);
      }
      
      // Sort by timestamp, newest first
      filteredActivities.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
      
      res.json(filteredActivities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities" });
    }
  });

  app.get("/api/activities/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const activities = await storage.getActivities();
      
      // Sort by timestamp, newest first
      const sortedActivities = [...activities].sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
      
      res.json(sortedActivities.slice(0, limit));
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent activities" });
    }
  });

  // Stats endpoints
  app.get("/api/stats", async (req, res) => {
    try {
      const books = await storage.getBooks();
      const tasks = await storage.getTasks();
      const requests = await storage.getBookRequests();
      const users = await storage.getAllUsers();
      
      const totalBooks = books.length;
      const totalDownloads = books.reduce((acc, book) => acc + (book.downloadCount || 0), 0);
      const pendingRequests = requests.filter(req => req.status === 'pending').length;
      const activeUsers = users.length;
      
      const stats = {
        totalBooks,
        totalDownloads,
        pendingRequests,
        activeUsers
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Users endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
  
  // Popular books endpoint
  app.get("/api/books/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      
      const books = await storage.getBooks();
      
      // Sort by download count, highest first
      const popularBooks = [...books].sort((a, b) => 
        (b.downloadCount || 0) - (a.downloadCount || 0)
      ).slice(0, limit);
      
      res.json(popularBooks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching popular books" });
    }
  });

  const httpServer = createServer(app);

  // Set up WebSocket Server for real-time collaboration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store connected clients with their session info
  const clients = new Map<WebSocket, { 
    userId: number;
    resourceId?: number;
    resourceType?: string;
    username?: string;
  }>();

  // Store active collaboration sessions
  const collaborationSessions = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle different message types
        switch(data.type) {
          case 'join':
            // User joins a collaboration session
            const sessionId = `${data.resourceType}_${data.resourceId}`;
            
            // Store client information
            clients.set(ws, {
              userId: data.userId,
              resourceId: data.resourceId,
              resourceType: data.resourceType,
              username: data.username
            });
            
            // Add client to the session
            if (!collaborationSessions.has(sessionId)) {
              collaborationSessions.set(sessionId, new Set());
            }
            collaborationSessions.get(sessionId)?.add(ws);
            
            // Notify everyone in the session about the new user
            broadcastToSession(sessionId, {
              type: 'user_joined',
              userId: data.userId,
              username: data.username,
              timestamp: new Date().toISOString()
            }, ws);
            
            // Send active users to the new client
            const activeUsers = Array.from(collaborationSessions.get(sessionId) || [])
              .map(client => {
                const info = clients.get(client);
                return { userId: info?.userId, username: info?.username };
              })
              .filter(user => user.userId !== data.userId);
              
            ws.send(JSON.stringify({
              type: 'session_users',
              users: activeUsers,
              sessionId
            }));
            break;
            
          case 'leave':
            handleUserLeave(ws);
            break;
            
          case 'edit':
            // Handle real-time edits
            if (data.resourceId && data.resourceType) {
              const editSessionId = `${data.resourceType}_${data.resourceId}`;
              
              // Broadcast changes to all other clients in the session
              broadcastToSession(editSessionId, {
                type: 'edit',
                changes: data.changes,
                userId: data.userId,
                username: data.username,
                position: data.position,
                timestamp: new Date().toISOString()
              }, ws);
            }
            break;
            
          case 'cursor_move':
            // Handle cursor position updates
            if (data.resourceId && data.resourceType) {
              const cursorSessionId = `${data.resourceType}_${data.resourceId}`;
              
              // Broadcast cursor position to all other clients in the session
              broadcastToSession(cursorSessionId, {
                type: 'cursor_move',
                position: data.position,
                userId: data.userId,
                username: data.username
              }, ws);
            }
            break;
            
          case 'chat':
            // Handle chat messages
            if (data.resourceId && data.resourceType) {
              const chatSessionId = `${data.resourceType}_${data.resourceId}`;
              
              // Broadcast chat message to all clients in the session
              broadcastToSession(chatSessionId, {
                type: 'chat',
                message: data.message,
                userId: data.userId,
                username: data.username,
                timestamp: new Date().toISOString()
              });
            }
            break;

          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      handleUserLeave(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Helper function to broadcast messages to all clients in a session
  function broadcastToSession(sessionId: string, message: any, excludeClient?: WebSocket) {
    const sessionClients = collaborationSessions.get(sessionId);
    if (sessionClients) {
      sessionClients.forEach(client => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  // Helper function to handle user leaving a session
  function handleUserLeave(ws: WebSocket) {
    const clientInfo = clients.get(ws);
    if (clientInfo && clientInfo.resourceId && clientInfo.resourceType) {
      const sessionId = `${clientInfo.resourceType}_${clientInfo.resourceId}`;
      const session = collaborationSessions.get(sessionId);
      
      if (session) {
        // Remove client from session
        session.delete(ws);
        
        // If session is empty, remove it
        if (session.size === 0) {
          collaborationSessions.delete(sessionId);
        } else {
          // Notify others that user has left
          broadcastToSession(sessionId, {
            type: 'user_left',
            userId: clientInfo.userId,
            username: clientInfo.username,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    // Remove client from clients map
    clients.delete(ws);
  }

  return httpServer;
}
