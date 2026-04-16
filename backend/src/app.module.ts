import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { FilmsController } from './films/films.controller';
import { FilmsRepository } from './films/films.repository';
import { FilmsService } from './films/films.service';
import { Film, FilmSchema } from './films/schemas/film.schema';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: path.join(__dirname, '..', '.env'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'DATABASE_URL',
          'mongodb://localhost:27017/afisha',
        ),
        dbName: 'afisha',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
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
