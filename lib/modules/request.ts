import fastifyPlugin from 'fastify-plugin';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

import { ParseIp } from './ip';
import { ParseBytes } from './bytes';
import { Log } from './logger';

interface LoggerConfig {
  ignoredRoutes?: string[];
  ignoredMethods?: ("GET" | "POST" | "HEAD" | "PATCH" | "DELETE" | "OPTIONS" | "PUT")[];
  userIdVariable?: string;
}

export function Logger(config?: LoggerConfig) {
  return fastifyPlugin(function Logger(server: FastifyInstance<Server, IncomingMessage, ServerResponse>, _, next?: () => void) {
    server.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply) => {
      const ipAddress = ParseIp(request);
      const method = request.raw.method;
      const route = request.raw.url;
      const code = reply.statusCode;
      const rawSize = reply.getHeader('content-length');
      const size = ParseBytes(Number(rawSize));

      let user = '';
      if (config?.userIdVariable) {
        const variables = config.userIdVariable.split('.');
        let variable = request[variables[0] as keyof typeof request]
        if (variable) variable = variable[variables[1] as keyof typeof request];
        user = config?.userIdVariable && variable ? ` - User: ${variable}` : '';
      }

      if (config?.ignoredRoutes?.includes(route as string)) return;
      if (config?.ignoredMethods?.includes(method as ("GET" | "POST" | "HEAD" | "PATCH" | "DELETE" | "OPTIONS" | "PUT"))) return;

      Log(`${method} ${route} - ${code} - ${reply.getResponseTime().toFixed(2)}ms (${size}) - IP: ${ipAddress}${user}`);
    });

    if (next) next();
  });
}

export const Missing = fastifyPlugin(function Missing(server: FastifyInstance<Server, IncomingMessage, ServerResponse>, _, next?: () => void) {
  server.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
    reply.code(404).send({ error: true, code: 'route_not_found' });
  });

  if (next) next();
});
