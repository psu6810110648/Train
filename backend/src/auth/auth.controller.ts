import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common'; // <--- อย่าลืมเพิ่ม UnauthorizedException
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  // *** จุดที่แก้คือตรงนี้ครับ ***
  @Post('login')
  async login(@Body() body: any) {
    // 1. ส่ง username/password ไปเช็คกับฐานข้อมูลก่อน
    const user = await this.authService.validateUser(body.username, body.password);
    
    // 2. ถ้าไม่เจอ หรือรหัสผิด ให้แจ้ง error
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }

    // 3. ถ้ารหัสถูก ให้ส่งข้อมูล user (ที่มี id ครบถ้วน) ไปสร้าง Token
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}