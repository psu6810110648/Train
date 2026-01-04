import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common'; // 1. Import Query
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  // 1. สร้างเที่ยวรถใหม่ (เฉพาะ Admin เท่านั้น 👮‍♂️)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() body: any) {
    return this.tripsService.create(body);
  }

  // 2. ดูเที่ยวรถทั้งหมด + รองรับการค้นหา 🔍
  @Get()
  findAll(
    // 👇 รับค่าจาก URL เช่น /trips?origin=Bangkok&date=2024-12-25
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
    @Query('date') date?: string,
  ) {
    // ส่งค่าที่รับมาไปให้ Service กรองข้อมูล
    return this.tripsService.findAll(origin, destination, date);
  }
}