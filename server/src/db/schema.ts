import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Схема заявки (bid)
export const bid = sqliteTable("bids", {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  comment: text('comment').notNull(),
  email: text('email').notNull(),
  number: text('number').notNull(),
  emailOrNumber: integer('email_or_number'),
});

// Схема услуг(service)
export const service = sqliteTable("services", {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  imgLink: text('img_link').notNull(),
});

// Схема примеров работ(example)
export const example = sqliteTable("examples", {
  id: integer('id').primaryKey({ autoIncrement: true }),
  imgLink: text('img_link').notNull(),
  description: text('description').notNull(),
});

// Zod схемы
export const insertBidSchema = createInsertSchema(bid);
export const selectBidSchema = createSelectSchema(bid);

export const insertServiceSchema = createInsertSchema(service);
export const selectServiceSchema = createSelectSchema(service);

export const insertExampleSchema = createInsertSchema(example);
export const selectExampleSchema = createSelectSchema(example);