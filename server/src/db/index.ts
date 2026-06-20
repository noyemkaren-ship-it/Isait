import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Инициализация базы данных
const sqlite = new Database('sqlite.db'); 

export const db = drizzle(sqlite, { 
  schema,
});

export const { 
  bid, 
  service, 
  example 
} = schema;