import { createLogger, format, transports } from 'winston';

const custom_level = {
  levels: {
    error: 0,
    warn: 1,
    trace: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    trace: 'magenta',
    info: 'green',
    debug: 'blue',
  },
};

import * as winston from 'winston';
winston.addColors(custom_level.colors);

const env = process.env.NODE_ENV || 'development';
const level = env === 'production' ? 'warn' : 'debug';

const logger = createLogger({
  levels: custom_level.levels,
  level: level,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `[${timestamp}] ${level}: ${message} - ${stack}`
        : `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});

export default logger;
