import fastify, { FastifyInstance } from 'fastify';
import { jobs, update_jobs } from '../controller/job.controller';

export const job_routes = async (fastify: FastifyInstance) => {
  fastify.get('/api/jobs', jobs);
  fastify.post('/api/jobs', update_jobs);
};
