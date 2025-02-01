import { ConsumeMessage } from 'amqplib';

export const job_update_consumer = (msg: ConsumeMessage | null) => {
  if (msg) {
    try {
      const update = JSON.parse(msg.content.toString());
      const { id, status } = update;

      // to do job status update in db ;
    } catch (error: unknown) {
      throw new error('Error processing job Updates ');
    }
  }
};
