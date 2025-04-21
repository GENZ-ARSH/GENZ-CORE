import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Books table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  subject: text("subject").notNull(),
  classLevel: text("class_level").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  fileType: text("file_type").notNull(),
  fileSize: text("file_size").notNull(),
  downloadCount: integer("download_count").notNull().default(0),
  tags: text("tags").array(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  subject: true,
  classLevel: true,
  description: true,
  coverImage: true,
  fileType: true,
  fileSize: true,
  tags: true,
  fileUrl: true,
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// Requests table
export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  subject: text("subject").notNull(),
  classLevel: text("class_level").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("pending"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRequestSchema = createInsertSchema(requests).pick({
  title: true,
  author: true,
  subject: true,
  classLevel: true,
  description: true,
  priority: true,
  status: true,
  userId: true,
});

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;

// Team members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar"),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  totalTasks: integer("total_tasks").notNull().default(0),
  joinedDate: text("joined_date").notNull(),
  socialLinks: jsonb("social_links"),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  name: true,
  role: true,
  avatar: true,
  tasksCompleted: true,
  totalTasks: true,
  joinedDate: true,
  socialLinks: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

// Stats table
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalBooks: integer("total_books").notNull().default(0),
  totalDownloads: integer("total_downloads").notNull().default(0),
  activeUsers: integer("active_users").notNull().default(0),
  pendingRequests: integer("pending_requests").notNull().default(0),
});

export type Stats = typeof stats.$inferSelect;

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  time: text("time").notNull(),
  read: boolean("read").notNull().default(false),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  title: true,
  description: true,
  time: true,
  read: true,
  userId: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
