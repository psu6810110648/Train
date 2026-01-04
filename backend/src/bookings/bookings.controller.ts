import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from '@nestjs/common'; // 1. เพิ่ม Delete, Param ตรงนี้
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { User } from '../entities/user.entity';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // 1. จองตั๋ว 🎫
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req, @Body('tripId') tripId: number) {
        // ดึง User ID มาจาก Token แล้วแปลงเป็น Object User
        const user = { id: req.user.userId } as User;
        return this.bookingsService.createBooking(user, tripId);
    }

    // 2. ดูประวัติการจองของฉัน 📜
    @UseGuards(AuthGuard('jwt'))
    @Get('my-bookings')
    findMyBookings(@Request() req) {
        return this.bookingsService.findMyBookings(req.user.userId);
    }

    // 👇👇👇 3. เพิ่มฟังก์ชันยกเลิกการจอง (Delete) 👇👇👇
    @UseGuards(AuthGuard('jwt')) // ต้อง Login ก่อน
    @Delete(':id') // รับ ID ที่จะลบผ่าน URL (เช่น /bookings/15)
    remove(@Param('id') id: string, @Request() req) {
        // ส่ง Booking ID และ User ID ไปให้ Service ทำการตรวจสอบและลบ
        // (+id คือการแปลง String เป็น Number)
        return this.bookingsService.cancelBooking(+id, req.user.userId);
    }
    // 👆👆👆 จบส่วนที่เพิ่ม 👆👆👆
}