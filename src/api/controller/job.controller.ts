import { FastifyReply, FastifyRequest } from 'fastify';
import { getAllJobs, createJob } from '../../services/job.service';
import { v4 as uuidv4 } from 'uuid';
import { get_channel } from '../../config/rabbitmq';
import {
  JOB_CSV_UPDATE_QUEUE,
  NOTIFICATION_QUEUE,
  JOB_DB_UPDATE_QUEUE,
  FAN_EXCHANGE,
} from '../../constants/queues';

export const jobs = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const channel = await get_channel();

    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    channel.consume(NOTIFICATION_QUEUE, (msg) => {
      if (msg) {
        const content = msg.content.toString();
        reply.status(200).send(content);
        channel.ack(msg);
      }
    });

    return;
  } catch (error: unknown) {
    if (error instanceof Error) reply.code(500).send({ error: error });
    return;
  }
};

export const update_jobs = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const channel = await get_channel();

    await channel.assertExchange(FAN_EXCHANGE, 'fanout', { durable: false });

    const { type, payload } = request.body as {
      type: string;
      payload: any;
    };
    const id = uuidv4();
    const status = 'PENDING';
    await createJob({ id, type, payload, status });
    const message = JSON.stringify({ id, type, payload });
    channel.publish(FAN_EXCHANGE, '', Buffer.from(message), {
      persistent: true,
    });

    reply.code(201).send({ id, status });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) reply.code(500).send({ error: error });
    return;
  }
};
