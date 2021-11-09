import MonoContext from '@simplyhexagonal/mono-context';

import { RouteOptions } from "fastify";

const healthCheckRoute: RouteOptions = {
  method: 'GET',
  url: '/health-check',
  handler: async () => ({
    appVersion: MonoContext.getStateValue('version'),
    status: 'ok',
    uptime: process.uptime(),
  }),
};

export default healthCheckRoute;
