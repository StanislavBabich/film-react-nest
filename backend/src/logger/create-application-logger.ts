import { LoggerService } from '@nestjs/common';

import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export function createApplicationLogger(): LoggerService {
  const fmt = process.env.LOGGER_FORMAT?.toLowerCase();
  if (fmt === 'tskv') {
    return new TskvLogger();
  }
  if (fmt === 'json') {
    return new JsonLogger();
  }
  if (fmt === 'dev') {
    return new DevLogger();
  }
  return process.env.NODE_ENV === 'production'
    ? new JsonLogger()
    : new DevLogger();
}
