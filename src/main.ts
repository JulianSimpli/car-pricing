import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Following setup can be exported in another file "setup app function"
  // Setted up at app.module.ts
  // app.use(cookieSession({
  //   keys: ['key']
  // }))
  // Setted up at app.module.ts
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true, // remove additionals properties from body
  // }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
