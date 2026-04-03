import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let cachedApp;

export const createNestServer = async (expressInstance) => {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();

  cachedApp = app;
  return app;
};

export default async (req, res) => {
  await createNestServer(server);
  server(req, res);
};
