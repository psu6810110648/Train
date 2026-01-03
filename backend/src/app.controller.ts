import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './auth/roles.decorator'; // import decorator ที่สร้างตะกี้
import { RolesGuard } from './auth/roles.guard'; // import guard ที่สร้างตะกี้

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // --- ส่วนที่เพิ่มมาเพื่อทดสอบ Admin ---
  @UseGuards(AuthGuard('jwt'), RolesGuard) // 1. ต้อง Login (JWT) และ 2. ต้องผ่านด่านตรวจ Role
  @Roles('ADMIN') // กำหนดว่าต้องเป็น 'ADMIN' เท่านั้นถึงจะเข้าได้
  @Get('admin')
  getAdminProfile(@Request() req) {
    return {
      message: 'ยินดีต้อนรับสู่พื้นที่ Admin (ถ้าเห็นข้อความนี้ แสดงว่าคุณคือ Admin)',
      user: req.user,
    };
  }
}