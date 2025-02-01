import Fastify from 'fastify';
import { job_routes } from './api/routes/job.routes';

require('dotenv').config();

const PORT = Number(process.env.PORT) || 8080;
console.log('DATABASE_URL:', process.env.DATABASE_URL);
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
