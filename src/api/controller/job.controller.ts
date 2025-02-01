import { FastifyReply, FastifyRequest } from 'fastify';

export const jobs = async (request: FastifyRequest, reply: FastifyReply) => {
  // todo
  reply.status(200).send('jobs!!!');
};

export const update_jobs = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  //to do
  reply.status(200).send('jobs!!!');
};
