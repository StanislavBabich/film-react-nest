import { config as loadEnv } from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createApplicationLogger } from './logger/create-application-logger';

function resolveEnvPath(): string {
  const nextToMain = path.join(__dirname, '..', '.env');
  const cwdEnv = path.join(process.cwd(), '.env');
  if (fs.existsSync(nextToMain)) {
    return nextToMain;
  }
  if (fs.existsSync(cwdEnv)) {
    return cwdEnv;
  }
  return nextToMain;
}

loadEnv({ path: resolveEnvPath(), override: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(createApplicationLogger());
  const config = app.get(ConfigService);
  const debugPattern = config.get<string>('DEBUG');
  if (debugPattern !== undefined && debugPattern !== '') {
    process.env.DEBUG = debugPattern;
  }
  app.setGlobalPrefix('api/afisha', {
    exclude: ['content/(.*)'],
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
