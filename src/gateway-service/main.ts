import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { AuthGuard } from './guards/auth.guard';


const path = require('path')
config({ path: path.resolve(process.cwd(), '.env')})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard())

  app.enableCors({
    origin: 'http://localhost:5173',
    exposedHeaders: ['Authorization', 'Set-Cookie'],
    credentials: true,
  });

  console.log(process.env.API_GATEWAY_PORT, 'api gatewayport')
  await app.listen(process.env.API_GATEWAY_PORT ?? 8000);
}
bootstrap();
