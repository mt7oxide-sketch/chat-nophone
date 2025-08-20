import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
  console.log(`API running on :${process.env.PORT || 8080}`);
}
bootstrap();
