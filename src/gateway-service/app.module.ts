import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    try {
      consumer
          .apply(AuthMiddleware)
          .forRoutes('/')
    } catch(err) {
      console.log(err.message)
    }
   
  } 
}