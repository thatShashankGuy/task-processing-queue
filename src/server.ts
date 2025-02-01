import Fastify from 'fastify';
import { job_routes } from './api/routes/job.routes';
import { v4 as uuidv4 } from 'uuid';
import { get_channel } from './util/rabbitmq';
import { job_update_consumer } from './util/consumer';
require('dotenv').config();

const PORT = Number(process.env.PORT) || 8080;

const JOB_QUEUE = 'job_queue';
const JOB_UPDATE_QUEUE = 'job_updates';

const fastify = Fastify({
  logger: true,
});

fastify.register(job_routes);

const start_server = async () => {
  try {
    const channel = await get_channel();

    await channel.assertQueue(JOB_QUEUE, { durable: true });
    await channel.assertQueue(JOB_UPDATE_QUEUE, { durable: true });

    channel.consume(JOB_UPDATE_QUEUE, async (msg) => job_update_consumer(msg));

    await fastify.listen({ port: PORT });
  } catch (error: any) {
    fastify.log.error(
      `Error occurred while starting the server : ${error_map(error)}`,
    );
  }
};

start_server();
