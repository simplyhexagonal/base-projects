import { RouteOptions } from 'fastify';

import {
  updateSecret,
  readSecret,
} from './handlers';

const updateSecretRoute: RouteOptions = {
  method: 'POST',
  url: '/secret',
  handler: updateSecret,
  constraints: {
    mustAuth: true,
  },
};

const readSecretRoute: RouteOptions = {
  method: 'GET',
  url: '/secret',
  handler: readSecret,
  constraints: {
    mustAuth: true,
  },
};

export default [
  updateSecretRoute,
  readSecretRoute,
];
