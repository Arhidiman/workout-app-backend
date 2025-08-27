import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './user/user.module'
import { APP_INTERCEPTOR  } from '@nestjs/core'
import { TokenInterceptor } from './interceptors/token.interceptor'

@Module({
  imports: [
    AuthModule,
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor
    }
  ],
})
export class AppModule {}
