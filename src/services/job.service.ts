import { db } from '../config/db';
import { Job_Table } from '../migrations/schema';
import { eq } from 'drizzle-orm';
import { Job, Status } from '../types/job.types';
import fs from 'fs';

export async function createJob(job: Job) {
  try {
    await db.insert(Job_Table).values(job);
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function updateJobStatus(id: string, status: Status) {
  try {
    await db
      .update(Job_Table)
      .set({ status, updatedAt: new Date() })
      .where(eq(Job_Table.id, id));
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function getAllJobs() {
  try {
    return await db.select().from(Job_Table);
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function updateJobStatusIntoAFile(
  id: string,
  status: Status,
): Promise<void> {
  try {
    const updated_at = new Date().toISOString();
    const csv_line = `${id},${status},${updated_at}\n`;
    fs.appendFile('out/job_status.csv', csv_line, (error) => {
      if (error instanceof Error) throw new Error(error.message);
    });
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}
