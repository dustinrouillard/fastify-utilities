import { FastifyRequest } from 'fastify';

export function ParseIp(req: FastifyRequest) {
  let address = '0.0.0.0';
  if (req.ip) address = req.ip;
  if (req.headers['cf-connecting-ip']) address = req.headers['cf-connecting-ip'].toString();

  return address;
}
