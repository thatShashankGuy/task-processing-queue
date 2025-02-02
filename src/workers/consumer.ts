import { get_channel } from '../util/rabbitmq';
import { JOB_QUEUE, JOB_UPDATE_QUEUE } from '../constants/jobs';
import { Job } from '../types/job.types';
import { updateJobStatus } from '../services/job.service';
import logger from '../util/logger';
require('dotenv').config();

async function start_worker() {
  const channel = await get_channel();

  await channel.assertQueue(JOB_QUEUE, { durable: true });
  await channel.assertQueue(JOB_UPDATE_QUEUE, { durable: true });

  logger.info('Worker is waiting for message ⏳⏳⏳⏳');

  channel.consume(JOB_QUEUE, async (msg) => {
    let job_data: Job;
    if (msg) {
      const content = msg.content.toString();
      logger.info('Recieved job: ' + content);
      try {
        job_data = JSON.parse(content);

        logger.info(`Processing job ${job_data.id}...`);

        setTimeout(() => {
          updateJobStatus(job_data.id!, 'COMPLETED')
            .then(() => {
              const update_message = JSON.stringify({
                id: job_data.id,
                status: 'COMPLETED',
              });
              channel.sendToQueue(
                JOB_UPDATE_QUEUE,
                Buffer.from(update_message),
                {
                  persistent: true,
                },
              );

              logger.info(`Job ${job_data.id} processed , update published`);
              channel.ack(msg);
            })
            .catch((error: unknown) => {
              if (error instanceof Error)
                logger.info('Error while Processing the job', error);
            });
        }, 30000);
      } catch (error: unknown) {
        if (error instanceof Error)
          logger.error('Invalid job format', error.message);
      }
    }
  });
}

start_worker().catch((error: unknown) => {
  if (error instanceof Error)
    logger.error('Worker did not start', error.message);
  process.exit(-1);
});
