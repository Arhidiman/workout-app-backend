import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    exposedHeaders: ['Authorization', 'Set-Cookie'], // 👈 разрешаем клиенту читать этот хедер
  });

  console.log(process.env.PORT, 'port')
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
