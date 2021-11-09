import MonoContext from '@simplyhexagonal/mono-context';
import { RouteOptions } from 'fastify';

export const updateSecret: RouteOptions['handler'] = async ({body}) => {
  const logger = MonoContext.getStateValue('logger');
  const prevSecret = MonoContext.getStateValue('secret');

  logger.debug('Received body:', body);

  MonoContext.setState({
    secret: ((body as any) || {}).secret || null,
  });

  return {
    prevSecret,
    secret: MonoContext.getStateValue('secret'),
  };
};

export const readSecret: RouteOptions['handler'] = async ({}, reply) => {
  return {
    secret: MonoContext.getStateValue('secret'),
  };
};
