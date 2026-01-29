import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './JWT';

// @Module({})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     try {
//       consumer
//           .apply(AuthMiddleware)
//           .forRoutes('/')
//     } catch(err) {
//       console.log(err.message)
//     }
   
//   } 
// }

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    AuthGuard
  ],
  controllers: [AppController]

})
export class AppModule {}