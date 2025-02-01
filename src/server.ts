import Fastify from 'fastify';
import { job_routes } from './api/routes/job.routes';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

const PORT = Number(process.env.PORT) || 8080;

const fastify = Fastify({
  logger: true,
});

fastify.register(job_routes);

const start_server = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (error: any) {
    fastify.log.error(
      `Error occurred while starting the server : ${error_map(error)}`,
    );
  }
};

start_server();
