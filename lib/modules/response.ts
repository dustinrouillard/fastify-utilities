import { FastifyReply } from 'fastify';

export function Success(reply: FastifyReply, status: number, data?: any, override?: boolean): void {
  if (override) reply.code(status).send(data);
  else reply.code(status).send({ success: true, data });
  return;
}

export function Failed(reply: FastifyReply, status: number, code: string, data?: any, override?: boolean): void {
  if (override) reply.code(status).send(data);
  else reply.code(status).send({ error: true, code, data });
  return;
}

export function Catch(reply: FastifyReply, data?: any, status?: number, code?: string): void {
  reply.code(status || 500).send({ error: true, code: code || 'catch', data });
  return;
}

export function Handle(res: FastifyReply, error: { code?: string; status?: number } | Error & { code?: string; status?: number }): void {
  if (error && error.code) return Failed(res, error.status || 500, error.code);
  return Catch(res, error);
}
