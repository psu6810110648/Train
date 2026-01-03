import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ฟังก์ชันสมัครสมาชิก
  async register(body: any) {
    const { username, password, role } = body;

    // 1. สร้าง Salt และ Hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. สร้าง User Object
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: role || 'USER', // ถ้าไม่ระบุ role ให้เป็น USER โดยอัตโนมัติ
    });

    try {
      // 3. บันทึกลง Database
      await this.userRepository.save(user);
      return { message: 'Register successful', userId: user.id };
    } catch (error) {
      // ดักจับ Error กรณี Username ซ้ำ (รหัส Error 23505 ของ PostgreSQL)
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  // 1. ฟังก์ชันเช็คว่า Username/Password ถูกต้องไหม
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(pass, user.password)) {
      // ถ้าเจอ User และรหัสผ่านตรงกัน ให้ตัด password ทิ้งก่อนส่งกลับ (เพื่อความปลอดภัย)
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. ฟังก์ชัน Login (แจก Token)
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload), // สร้าง Token
    };
  }
}