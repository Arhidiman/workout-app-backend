import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'
import { appConfig } from '../config';
const path = require('path')

@Module({
  imports: [
    // TODO: configService чтобы можно было делать так: const port = this.config.get<number>('API_GATEWAY_PORT')
    // Доступ к переменным среды возможен только после вызова этого модуля
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '.env'), 
    }), 
    JwtModule.register({
      global: true,
      secret: appConfig.JWT_SECRET,
      signOptions: { expiresIn: appConfig.JWT_TOKEN_EXPIRATION_LIMIT},
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