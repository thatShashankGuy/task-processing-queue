import { get_channel } from '../util/rabbitmq';
import { JOB_QUEUE, JOB_UPDATE_QUEUE } from '../constants/jobs';
import { Job } from '../types/job.types';
require('dotenv').config();

async function start_worker() {
  const channel = await get_channel();

  await channel.assertQueue(JOB_QUEUE, { durable: true });
  await channel.assertQueue(JOB_UPDATE_QUEUE, { durable: true });

  console.log('Worker is waiting for message ⏳⏳⏳⏳');

  channel.consume(JOB_QUEUE, async (msg) => {
    let job_data: Job;
    if (msg) {
      const content = msg.content.toString();
      console.log('Recieved job:', content);
      try {
        job_data = JSON.parse(content);

        console.log(`Processing job ${job_data.id}...`);

        await new Promise((resolve: any) => setTimeout(resolve, 3000)); // can add a new process

        const update_message = JSON.stringify({
          id: job_data.id,
          status: 'COMPLETED',
        });
        channel.sendToQueue(JOB_UPDATE_QUEUE, Buffer.from(update_message), {
          persistent: true,
        });

        console.log(`Job ${job_data.id} processed , update published`);
        channel.ack(msg);
      } catch (error: any) {
        console.error('Invalid job format', error.message);
      }
    }
  });
}

start_worker().catch((error: any) => {
  console.error('Worker Error:', error.message);
  process.exit(-1);
});
