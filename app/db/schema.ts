import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
});

export const feedsTable = sqliteTable("feeds", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  link: text().notNull(),
  feedUrl: text().notNull(),
  lastUpdate: int({ mode: "timestamp" }),
  userId: int()
    .notNull()
    .references(() => usersTable.id),
});

export const newItemsTable = sqliteTable("new_items", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  link: text().notNull(),
  pubDate: int({ mode: "timestamp" }).notNull(),
  feedId: int()
    .notNull()
    .references(() => feedsTable.id),
  userId: int()
    .notNull()
    .references(() => usersTable.id),
});
