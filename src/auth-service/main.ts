import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'

const path = require('path')
config({ path: path.resolve(process.cwd(), '.env')})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    exposedHeaders: ['Authorization', 'Set-Cookie'],
    credentials: true,
  });
  console.log(process.env.API_AUTH_PREFIX, 'process.env.API_AUTH_PREFIX')

  app.setGlobalPrefix(process.env.API_AUTH_PREFIX || 'auth/api/v1');
  await app.listen(process.env.API_AUTH_PORT ?? 8001);
}
bootstrap();
