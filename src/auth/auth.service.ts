import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name?: string,
    role = 'peserta',
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Email sudah terdaftar
      throw new BadRequestException('Email sudah terdaftar.');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name, role },
    });
  }

  async loginWithEmail(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Email tidak ditemukan
      throw new BadRequestException('Email tidak terdaftar.');
    }

    if (!user.password) {
      // Password belum diatur
      throw new BadRequestException(
        'Password belum diatur. Silakan login menggunakan akun Google.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Password salah
      throw new BadRequestException('Password yang Anda masukkan salah.');
    }

    return this.generateJwtToken(user);
  }

  async loginWithGoogle(profile: {
    email: string;
    name: string;
    providerId: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      // Jika user belum terdaftar, buat akun baru
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          provider: 'google',
          providerId: profile.providerId,
        },
      });
    }

    return this.generateJwtToken(user);
  }

  private generateJwtToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
