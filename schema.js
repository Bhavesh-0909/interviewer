import { pgTable, serial, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const problems = pgTable("problems_dataset", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }),
  description: varchar("description", { length: 512 }),
  input_format: varchar("input_format", { length: 256 }),
  output_format: varchar("output_format", { length: 256 }),
  example: jsonb("example"),
  difficulty: varchar("difficulty", { length: 64 }),
  constraints: varchar("constraints", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow(),
});
