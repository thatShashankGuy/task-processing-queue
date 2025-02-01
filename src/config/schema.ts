import { sql } from 'drizzle-orm';
import {
  integer,
  jsonb,
  pgTable,
  varchar,
  text,
  json,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

const job_status_enum = pgEnum('job_status', [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
]);

export const Job_Table = pgTable('users', {
  id: text('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  type: text('type'),
  payload: json('payload'),
  status: job_status_enum('status').default('PENDING'),
  retryCount: integer('retry_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
