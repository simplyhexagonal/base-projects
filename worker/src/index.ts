require('dotenv').config();
import os from 'os';

import fastify from 'fastify';
import exec, { ExecResult } from '@simplyhexagonal/exec';
import MonoContext from '@simplyhexagonal/mono-context';
import Logger, { LoggerTransportName } from '@simplyhexagonal/logger';
import DiscordTransport from '@simplyhexagonal/logger-transport-discord';
import RTQ, {
  RTQTaskHandler,
  RTQTask,
  RTQStatus,
  RTQQueueEntry,
  RTQEvent,
} from '@simplyhexagonal/recurring-task-queue';

// @ts-ignore
import { version, name } from '../package.json';


/**
 * ENV Vars
 */

const {
  PORT,
  HOST,
  CLUSTER_REGION,
  CLUSTER_TYPE,
  DISCORD_WEBHOOK,
  SECRET_TOKEN,
} = process.env;


/**
 * -. .-.   .-. .-.   .-. .-.   .  
 * ||\|||\ /|||\|||\ /|||\|||\ /|
 * |/ \|||\|||/ \|||\|||/ \|||\||
 * ~   `-~ `-`   `-~ `-`   `-~ `-
 * 
 * Config
 */

const consoleOptions = {
  transport: LoggerTransportName.CONSOLE,
  options: {
    destination: LoggerTransportName.CONSOLE,
    channelName: LoggerTransportName.CONSOLE,
  },
};

const discordOptions = {
  transport: LoggerTransportName.DISCORD,
  options: {
    destination: DISCORD_WEBHOOK || '',
  },
};

const logger = new Logger({
  optionsByLevel: {
    debug: [consoleOptions],
    info: [consoleOptions, discordOptions],
    warn: [consoleOptions, discordOptions],
    error: [consoleOptions, discordOptions],
    fatal: [consoleOptions, discordOptions],
    all: [consoleOptions, discordOptions],
  },
  transports: {
    [`${LoggerTransportName.DISCORD}`]: DiscordTransport,
  },
  appIdentifiers: {
    region: CLUSTER_REGION,
    clusterType: CLUSTER_TYPE,
    hostname: os.hostname(),
    app: name,
  },
  catchTransportErrors: true,
});

MonoContext.setState({
  logger,
  version,
  secret: null,
});


/**
 *            ___
 *      |     | |
 *     / \    | |
 *    |--o|===|-|
 *    |---|   | |
 *   /     \  | |
 *  |       | | |
 *  |       |=| |
 *  |       | | |
 *  |_______| |_|
 *   |@| |@|  | |
 * ___________|_|_
 * 
 * Task Handlers
 */

interface CustomTaskOtions {
  greeting: string;
}

const customTaskHandler: RTQTaskHandler<CustomTaskOtions> = async ({ greeting }) => {
  const result = await exec('echo world').catch((e) => e) as ExecResult;

  if (result.exitCode !== 0) {
    logger.error(result.stderrOutput || result.stdoutOutput);
    return;
  }

  logger.info(`${greeting} ${result.stdoutOutput}`);
};


/**
 *       ____________
 *      /\  ________ \
 *     /  \ \______/\ \
 *    / /\ \ \  / /\ \ \
 *   / / /\ \ \/ / /\ \ \
 *  / / /__\_\/ / /__\_\ \
 * / /_/_______/ /________\
 * \ \ \______ \ \______  /
 *  \ \ \  / /\ \ \  / / /
 *   \ \ \/ / /\ \ \/ / /
 *    \ \/ / /__\_\/ / /
 *     \  / /______\/ /
 *      \/___________/
 * 
 * RTQ Definition
 */

type allTaskOptions = CustomTaskOtions | any;

const taskHandlers: {[k: string]: RTQTaskHandler<allTaskOptions>} = {
  customTask: customTaskHandler,
};const tasks: RTQTask<allTaskOptions>[] = [
  {
    id: '0',
    taskName: 'customTask',
    status: RTQStatus.NEW,
    waitTimeBetweenRuns: 200,
    maxRetries: 1,
    retryCount: 0,
    lastRun: new Date(0),
    taskOptions: {
      greeting: 'Hello',
    },
  }
];

const queue: RTQQueueEntry[] = [];

const fetchTasks = async () => tasks;

const updateTask = async (task: RTQTask<allTaskOptions>) => {
  const i = tasks.findIndex((t) => t.id === task.id);

  tasks[i] = task;
};

const createQueueEntry = async (queueEntry: RTQQueueEntry) => {
  queue.push(queueEntry);
};

const fetchQueueEntries = async () => queue;

const removeQueueEntry = async (queueEntry: RTQQueueEntry) => {
  const i = queue.findIndex((qe) => qe.id === queueEntry.id);
  if (i > -1) {
    queue.splice(i, 1);
  } else {
    throw new Error();
  }
};
const eventHandler = async (event: RTQEvent) => { logger.debug(event); };

const recurring = new RTQ({
  fetchTasks,
  updateTask,
  createQueueEntry,
  fetchQueueEntries,
  removeQueueEntry,
  eventHandler,
  taskHandlers,
});


/**
 *    _____
 *   | ___ |
 *   ||   ||
 *   ||___||
 *   |   _ |
 *   |_____|
 *  /_/_|_\_\
 * /_/__|__\_\ 
 * 
 * Server
 */

const main = async () => {
  const server = fastify({
    logger: false,
  });

  server.addHook('preValidation', ({headers, body}, reply, done) => {
    if (
      headers.authorization !== `Bearer ${SECRET_TOKEN}`
    ) {
      reply.status(401).send('');
    }

    done();
  });

  server.get('/', async (request, reply) => {
    await recurring.tick();

    reply.send(
      {
        running: true,
      }
    );
  });

  const serverAddress = await server.listen(PORT || '5000', HOST);

  logger.all(`Server successfully started on: ${serverAddress}`);
};

main();
