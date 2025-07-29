import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/user.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'app',
      password: 'app',
      database: 'app',
      entities: [],
      synchronize: true,
    }),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
