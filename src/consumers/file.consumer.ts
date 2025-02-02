import { get_channel } from '../config/rabbitmq';
import {
  FAN_EXCHANGE,
  JOB_CSV_UPDATE_QUEUE,
  NOTIFICATION_QUEUE,
} from '../constants/queues';
import { Job } from '../types/job.types';
import { updateJobStatusIntoAFile } from '../services/job.service';
import logger from '../utils/logger';
require('dotenv').config();

async function start_worker() {
  const channel = await get_channel();

  await channel.assertExchange(FAN_EXCHANGE, 'fanout', { durable: false });

  const FILE_QUEUE = await channel.assertQueue(JOB_CSV_UPDATE_QUEUE, {
    durable: true,
  });
  await channel.bindQueue(FILE_QUEUE.queue, FAN_EXCHANGE, '');
  await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

  logger.info('CSV processing consumer is waiting for message ⏳⏳⏳⏳');

  channel.consume(FILE_QUEUE.queue, async (msg) => {
    let job_data: Job;
    if (msg) {
      const content = msg.content.toString();
      logger.info('Recieved job: ' + content);
      try {
        job_data = JSON.parse(content);

        logger.info(`Processing job ${job_data.id}...`);

        setTimeout(() => {
          updateJobStatusIntoAFile(job_data.id!, 'COMPLETED')
            .then(() => {
              const update_message = JSON.stringify({
                id: job_data.id,
                status: 'COMPLETED',
              });
              channel.sendToQueue(
                NOTIFICATION_QUEUE,
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
