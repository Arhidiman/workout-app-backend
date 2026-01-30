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
const path = require('path')


@Module({
  imports: [
    AuthModule,
    SessionModule,
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
    // TODO: configService чтобы можно было делать так: const port = this.config.get<number>('API_GATEWAY_PORT')
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '.env'), 
    })
  ],
  // controllers: [AppController],
  providers: [
    // AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor
    }
  ],
})
export class AppModule {}
