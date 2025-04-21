import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  role: text("role").default("user").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  avatar: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  fileUrl: text("file_url"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  downloadCount: integer("download_count").default(0),
  tags: text("tags").array(),
  class: text("class"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").default("todo").notNull(),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const bookRequests = pgTable("book_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  description: text("description"),
  requestedBy: integer("requested_by").references(() => users.id),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookRequestSchema = createInsertSchema(bookRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertBookRequest = z.infer<typeof insertBookRequestSchema>;
export type BookRequest = typeof bookRequests.$inferSelect;

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").references(() => users.id),
  resourceId: integer("resource_id"),
  resourceType: text("resource_type"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Document collaboration tables
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  bookId: integer("book_id").references(() => books.id),
  isPublic: boolean("is_public").default(false),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const documentCollaborators = pgTable("document_collaborators", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accessLevel: text("access_level").default("read").notNull(), // 'read', 'write', 'admin'
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertDocumentCollaboratorSchema = createInsertSchema(documentCollaborators).omit({
  id: true,
  joinedAt: true,
});

export type InsertDocumentCollaborator = z.infer<typeof insertDocumentCollaboratorSchema>;
export type DocumentCollaborator = typeof documentCollaborators.$inferSelect;

export const documentOperations = pgTable("document_operations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  operation: jsonb("operation").notNull(), // Store operation as JSON (insert, delete, etc.)
  timestamp: timestamp("timestamp").defaultNow(),
  version: integer("version").notNull(), // Document version after this operation
});

export const insertDocumentOperationSchema = createInsertSchema(documentOperations).omit({
  id: true,
  timestamp: true,
});

export type InsertDocumentOperation = z.infer<typeof insertDocumentOperationSchema>;
export type DocumentOperation = typeof documentOperations.$inferSelect;

// Define relations
export const documentsRelations = relations(documents, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [documents.createdBy],
    references: [users.id],
  }),
  book: one(books, {
    fields: [documents.bookId],
    references: [books.id],
  }),
  collaborators: many(documentCollaborators),
  operations: many(documentOperations),
}));

export const documentCollaboratorsRelations = relations(documentCollaborators, ({ one }) => ({
  document: one(documents, {
    fields: [documentCollaborators.documentId],
    references: [documents.id],
  }),
  user: one(users, {
    fields: [documentCollaborators.userId],
    references: [users.id],
  }),
}));

export const documentOperationsRelations = relations(documentOperations, ({ one }) => ({
  document: one(documents, {
    fields: [documentOperations.documentId],
    references: [documents.id],
  }),
  user: one(users, {
    fields: [documentOperations.userId],
    references: [users.id],
  }),
}));
