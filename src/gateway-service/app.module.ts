import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'
const path = require('path')

console.log({
  PORT: process.env.API_GATEWAY_PORT,
  PORT_TYPE: typeof process.env.API_GATEWAY_PORT,
  NUMBER_PORT: Number(process.env.API_GATEWAY_PORT),
})

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '.env'),
    })
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