import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_INTERCEPTOR  } from '@nestjs/core'
import { TokenInterceptor } from './interceptors/token.interceptor'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './user/user.module'
import { SessionController } from './session/session.controller'
import { SessionModule } from './session/session.module'
import { UserController } from './user/user.controller'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { appConfig } from '../config'
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
      signOptions: { expiresIn: appConfig.JWT_TOKEN_EXPIRATION_LIMIT }
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'app',
      password: 'app',
      database: 'app',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    AuthModule,
    SessionModule
   
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor
    }
  ],
})
export class AppModule {}
