import Fastify from 'fastify';
import { job_routes } from './api/routes/job.routes';
import logger from './util/logger';

require('dotenv').config();

const PORT = Number(process.env.PORT) || 8080;

const fastify = Fastify({
  logger: true,
});

fastify.register(job_routes);

const start_server = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (error: unknown) {
    if (error instanceof Error)
      logger.error(`error starting server: ${error.message}`);
  }
};

start_server();
