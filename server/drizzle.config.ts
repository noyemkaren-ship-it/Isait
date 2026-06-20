import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',     // папка, куда будут генерироваться миграции
  dialect: 'sqlite',               // ← обязательно!
  dbCredentials: {
    url: './sqlite.db',            // путь к твоей базе
  },
} satisfies Config;