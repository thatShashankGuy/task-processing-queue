import { db } from '../config/db';
import { Job_Table } from '../model/schema';
import { eq } from 'drizzle-orm';
import { Job, Status } from '../types/job.types';

export async function createJob(job: Job) {
  try {
    await db.insert(Job_Table).values(job);
  } catch (error: any) {
    throw new error(`Error occured at db ${error.message}`);
  }
}

export async function updateJobStatus(id: string, status: Status) {
  await db
    .update(Job_Table)
    .set({ status, updatedAt: new Date() })
    .where(eq(Job_Table.id, id));
}

export async function getAllJobs() {
  return await db.select().from(Job_Table);
}
