import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use('/', createProxyMiddleware({
  //     target: 'http://localhost:8001',
  //     changeOrigin: true,
  //   })
  // )
  console.log(process.env.PORT, 'port')
  await app.listen(process.env.PORT ?? 8000);


}
bootstrap();
