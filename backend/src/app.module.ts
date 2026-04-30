import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { FilmsController } from './films/films.controller';
import { FilmEntity, ScheduleEntity } from './films/entities';
import { FilmsRepository } from './films/films.repository';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: path.join(__dirname, '..', '.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('DATABASE_DRIVER', 'postgres');
        if (driver !== 'postgres') {
          throw new Error('DATABASE_DRIVER must be postgres');
        }
        const rawUrl = config.get<string>(
          'DATABASE_URL',
          'postgres://localhost:5432/films',
        );
        const dbUrl = new URL(rawUrl);
        const username =
          config.get<string>('DATABASE_USERNAME') ||
          decodeURIComponent(dbUrl.username || 'postgres');
        const password =
          config.get<string>('DATABASE_PASSWORD') ||
          decodeURIComponent(dbUrl.password || 'postgres');
        const database = dbUrl.pathname.replace(/^\//, '') || 'films';
        return {
          type: 'postgres' as const,
          host: dbUrl.hostname || 'localhost',
          port: Number(dbUrl.port || 5432),
          database,
          username,
          password,
          autoLoadEntities: true,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [FilmsRepository, FilmsService, OrderService],
})
export class AppModule {}
