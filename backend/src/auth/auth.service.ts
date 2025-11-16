import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user._id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.findById(userId);
    
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.usersService.findByEmail(updateProfileDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (updateProfileDto.name !== undefined) {
      user.name = updateProfileDto.name;
    }
    if (updateProfileDto.email !== undefined) {
      user.email = updateProfileDto.email;
    }

    await user.save();
    const { password, ...result } = user.toObject();
    return result;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    
    const isValidPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.save();

    return { message: 'Password changed successfully' };
  }
}
