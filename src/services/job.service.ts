import { db } from '../config/db';
import { Job_Table } from '../migrations/schema';
import { eq } from 'drizzle-orm';
import { Job, Status } from '../types/job.types';

export async function createJob(job: Job) {
  try {
    await db.insert(Job_Table).values(job);
  } catch (error: unknown) {
    console.log(error_map(error));
    throw new Error('Error creating job in DB');
  }
}

export async function updateJobStatus(id: string, status: Status) {
  try {
    await db
      .update(Job_Table)
      .set({ status, updatedAt: new Date() })
      .where(eq(Job_Table.id, id));
  } catch (error: unknown) {
    console.log(error_map(error));
    throw new Error('Error Occurred while updating Job at DB');
  }
}

export async function getAllJobs() {
  try {
    return await db.select().from(Job_Table);
  } catch (error: unknown) {
    console.log(error_map(error));
    throw new Error('Error while fetching all job from DB');
  }
}
