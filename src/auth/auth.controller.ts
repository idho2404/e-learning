import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from '../auth/guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password?: string;
      name?: string;
      role?: string;
    },
  ) {
    try {
      return await this.authService.register(
        body.email,
        body.password,
        body.name,
        body.role,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.loginWithEmail(body.email, body.password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req) {
    try {
      return await this.authService.loginWithGoogle(req.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
