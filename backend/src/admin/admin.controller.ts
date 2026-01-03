import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // <--- 1. Import ตัวนี้มาแทน
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard) // <--- 2. เรียกใช้แบบนี้ (AuthGuard('jwt'))
export class AdminController {

  @Get()
  @Roles('admin')
  getAdminData() {
    return { message: 'Welcome to Admin Dashboard' };
  }
}