import winston from "winston";
import { v4 } from "uuid";

import path from 'path';

// Return the last folder name in the path and the calling
// module's filename.
const getLabel = function(callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

const winstonLogger = winston.createLogger({
    level: 'info',
    format:  winston.format.combine(
      winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.json()
  ),
    defaultMeta: { ["Request-Id"]: v4(), },
    transports: [
    //   new winston.transports.Console({
    //   label: getLabel(callingModule)
    // }),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    winstonLogger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  export  default winstonLogger;