require('dotenv').config();
import os from 'os';

import fastify from 'fastify';
import MonoContext from '@simplyhexagonal/mono-context';
import Logger from '@simplyhexagonal/logger';

import routes from './routes';

// @ts-ignore
import { version, name } from '../package.json';

const {
  PORT,
  HOST,
  CLUSTER_REGION,
  CLUSTER_TYPE,
  SECRET_TOKEN,
} = process.env;

const logger = new Logger({
  appIdentifiers: {
    region: CLUSTER_REGION,
    clusterType: CLUSTER_TYPE,
    hostname: os.hostname(),
    app: name,
  },
});

MonoContext.setState({
  logger,
  version,
  secret: null,
});

const main = async () => {
  const server = fastify({
    logger: false,
  });

  await server.register((instance, opts, next) => {
    instance.addHook('preValidation', ({headers}, reply, done) => {
      if (headers.authorization !== `Bearer ${SECRET_TOKEN}`) {
        reply.status(401).send('');
      }

      done();
    });

    // authenticated routes
    routes.authRoutes.forEach((r) => instance.route(r));

    next();
  });

  await server.register((instance, opts, next) => {
    // non-authenticated routes
    routes.openRoutes.forEach((r) => instance.route(r));

    next();
  });

  const serverAddress = await server.listen(PORT || '5000', HOST);

  logger.all(`Server successfully started on: ${serverAddress}`);
};

main();
