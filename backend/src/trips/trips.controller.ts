import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  // 1. สร้างเที่ยวรถใหม่ (เฉพาะ Admin เท่านั้น 👮‍♂️)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // เรียกยามมาตรวจ
  @Roles('admin') // ระบุว่าต้องเป็น admin
  create(@Body() body: any) {
    return this.tripsService.create(body);
  }

  // 2. ดูเที่ยวรถทั้งหมด (เปิดให้ทุกคนดูได้ จะได้จองตั๋วถูก 📢)
  @Get()
  findAll() {
    return this.tripsService.findAll();
  }
}