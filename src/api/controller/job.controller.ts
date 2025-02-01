import { FastifyReply, FastifyRequest } from 'fastify';

export const jobs = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send('jobs!!!');
};
