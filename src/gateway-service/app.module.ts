import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ProxyMiddleware } from './middleware/proxy.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(ProxyMiddleware)
          .forRoutes('/')
          .apply(AuthMiddleware)
          .forRoutes('/')
  } 
}