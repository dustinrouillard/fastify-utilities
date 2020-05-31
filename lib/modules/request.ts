import fastifyPlugin from 'fastify-plugin';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import { ParseIp } from './ip';
import { ParseBytes } from './bytes';
import { Log } from './logger';

export const Logger = fastifyPlugin(function Logger(server: FastifyInstance<Server, IncomingMessage, ServerResponse>, _options: RegisterOptions<{}, {}, {}>, next?: () => void) {
  server.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
    let ipAddress = ParseIp(request);
    let method = request.raw.method;
    let route = request.raw.url;
    let code = reply.res.statusCode;
    let rawSize = reply.getHeader('content-length');
    let size = ParseBytes(Number(rawSize));

    Log(`${method} ${route} - ${code} - ${reply.getResponseTime().toFixed(2)}ms (${size}) - IP: ${ipAddress}`);
  });

  if (next) next();
});

export const Missing = fastifyPlugin(function Missing(server: FastifyInstance<Server, IncomingMessage, ServerResponse>, _options: RegisterOptions<{}, {}, {}>, next?: () => void) {
  server.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
    reply.code(404).send({ error: true, code: 'route_not_found' });
  });

  if (next) next();
});
