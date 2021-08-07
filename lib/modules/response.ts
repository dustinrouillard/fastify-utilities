import { FastifyReply } from 'fastify';

export function Success(reply: FastifyReply, status: number, data?: any): void {
  reply.code(status).send({ success: true, data });
  return;
}

export function Failed(reply: FastifyReply, status: number, code: string, data?: any): void {
  reply.code(status).send({ error: true, code, data });
  return;
}

export function Catch(reply: FastifyReply, data?: any): void {
  reply.code(500).send({ error: true, code: 'catch', data });
  return;
}

export function Handle(res: FastifyReply, error: Error & { code?: string; status?: number }): void {
  if (error && error.code) return Failed(res, error.status || 500, error.code);
  return Catch(res, error);
}
