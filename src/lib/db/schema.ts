import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  uuid,
  unique,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  image: text("image"),
  mainListId: integer("mainListId").references(() => lists.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  mainList: one(lists, {
    fields: [users.mainListId],
    references: [lists.id],
  }),
  lists: many(usersLists),
}));

export const usersLists = pgTable(
  "usersLists",
  {
    userId: uuid("userId")
      .references(() => users.id)
      .notNull(),
    listId: integer("listId")
      .references(() => lists.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.listId] }),
  }),
);

export const usersListsRelations = relations(usersLists, ({ one }) => ({
  user: one(users, {
    fields: [usersLists.userId],
    references: [users.id],
  }),
  list: one(lists, {
    fields: [usersLists.listId],
    references: [lists.id],
  }),
}));

export const languagesEnum = pgEnum("language", ["en", "he", "ru"]);

export const lists = pgTable("lists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  invitationKey: uuid("invitationKey").unique().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  language: languagesEnum("language").notNull().default("en"),
});

export const listsRelations = relations(lists, ({ many }) => ({
  collaborators: many(usersLists),
  categories: many(categories),
}));

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    listId: integer("listId")
      .references(() => lists.id, { onDelete: "cascade" })
      .notNull(),
    position: integer("position").notNull(),
  },
  (table) => ({
    unq: unique().on(table.name, table.listId),
    listIdIndex: index("listId_index").on(table.listId),
  }),
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  list: one(lists, {
    fields: [categories.listId],
    references: [lists.id],
  }),
  items: many(items),
}));

export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    categoryId: integer("categoryId")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    isInShoppingList: boolean("isInShoppingList").notNull().default(false),
    isPickedUp: boolean("isPickedUp").notNull().default(false),
    pickedUpAt: timestamp("pickedUpAt"),
    note: text("note").notNull().default(""),
  },
  (table) => ({
    unq: unique().on(table.name, table.categoryId),
    categoryId: index("categoryId_index").on(table.categoryId),
  }),
);

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
}));
