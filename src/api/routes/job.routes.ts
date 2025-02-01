import fastify, { FastifyInstance } from 'fastify';
import { jobs } from '../controller/job.controller';
import { request } from 'http';

export const job_routes = async (fastify: FastifyInstance) => {
  fastify.get('/', jobs);
};
