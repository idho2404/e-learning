import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService agar dapat digunakan di module lain
})
export class PrismaModule {}
