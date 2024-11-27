import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleStrategy } from '../auth/strategies/google-auth.strategy';
import { JwtStrategy } from '../auth/strategies/jwt-auth.strategy';

@Module({
  imports: [
    PrismaModule, // Hubungkan Prisma ke Auth Module
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }, // Token valid 1 jam
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
