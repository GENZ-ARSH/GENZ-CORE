import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertRequestSchema, insertTeamMemberSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all books
  app.get("/api/books", async (req: Request, res: Response) => {
    try {
      const query = req.query.search as string | undefined;
      const classLevel = req.query.class as string | undefined;
      const subject = req.query.subject as string | undefined;
      const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
      
      const books = await storage.searchBooks(
        query || "", 
        { classLevel, subject, tags }
      );
      
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });

  // Get a specific book
  app.get("/api/books/:id", async (req: Request, res: Response) => {
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

  // Create a new book
  app.post("/api/books", async (req: Request, res: Response) => {
    try {
      const bookData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating book" });
    }
  });

  // Update a book
  app.patch("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.updateBook(id, req.body);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error updating book" });
    }
  });

  // Delete a book
  app.delete("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteBook(id);
      
      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting book" });
    }
  });

  // Download a book (increment download count)
  app.post("/api/books/:id/download", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.incrementDownloadCount(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error processing download" });
    }
  });

  // Get stats
  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Get all requests
  app.get("/api/requests", async (_req: Request, res: Response) => {
    try {
      const requests = await storage.getRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requests" });
    }
  });

  // Create a new request
  app.post("/api/requests", async (req: Request, res: Response) => {
    try {
      const requestData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating request" });
    }
  });

  // Update request status
  app.patch("/api/requests/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const request = await storage.updateRequestStatus(id, status);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Error updating request status" });
    }
  });

  // Get team members
  app.get("/api/team", async (_req: Request, res: Response) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members" });
    }
  });

  // Create a new team member
  app.post("/api/team", async (req: Request, res: Response) => {
    try {
      const memberData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team member data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating team member" });
    }
  });

  // Update a team member
  app.patch("/api/team/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateTeamMember(id, req.body);
      
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Error updating team member" });
    }
  });

  // Get user notifications
  app.get("/api/notifications", async (req: Request, res: Response) => {
    try {
      // For simplicity, we're always using user ID 1 here
      // In a real app, this would come from the authenticated user
      const userId = 1;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Error marking notification as read" });
    }
  });

  // Mark all notifications as read
  app.post("/api/notifications/mark-all-read", async (req: Request, res: Response) => {
    try {
      // For simplicity, we're always using user ID 1 here
      const userId = 1;
      await storage.markAllNotificationsAsRead(userId);
      
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Error marking notifications as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
