import { FastifyReply, FastifyRequest } from 'fastify';
import { getAllJobs, createJob } from '../../services/job.service';
import { v4 as uuidv4 } from 'uuid';
import { get_channel } from '../../util/rabbitmq';
import { job_update_consumer } from '../../util/consumers';
import { JOB_QUEUE, JOB_UPDATE_QUEUE } from '../../constants/jobs';

export const jobs = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const jobs = await getAllJobs();
    reply.send(jobs);
  } catch (error: any) {
    reply.code(500).send({ error: error.messagae });
  }
};

export const update_jobs = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const channel = await get_channel();

    await channel.assertQueue(JOB_QUEUE, { durable: true });
    await channel.assertQueue(JOB_UPDATE_QUEUE, { durable: true });

    channel.consume(JOB_UPDATE_QUEUE, async (msg) => job_update_consumer(msg));
    const { type, payload } = request.body as {
      type: string;
      payload: any;
    };
    const id = uuidv4();
    const status = 'PENDING';
    await createJob({ id, type, payload, status });
    reply.status(200).send('jobs updated');
    const message = JSON.stringify({ id, type, payload });
    channel.sendToQueue(JOB_QUEUE, Buffer.from(message), {
      persistent: true,
    });

    reply.code(201).send({ id, status });
  } catch (error: any) {
    reply.code(500).send({ error: 'Database error' });
    return;
  }
};
