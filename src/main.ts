import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sinkronkan Prisma lifecycle
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app); // Tidak perlu await, karena ini bukan Promise

  await app.listen(3000);
}
bootstrap();
