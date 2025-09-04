import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    exposedHeaders: ['Authorization', 'Set-Cookie', 'Access-Control-Allow-Credentials'], // 👈 разрешаем клиенту читать этот хедер
    credentials: true,
  });

  console.log(process.env.PORT, 'port')
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
