import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { User } from '../entities/user.entity';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(AuthGuard('jwt')) // 1. ต้อง Login ก่อนถึงจะจองได้
    @Post()
    create(@Request() req, @Body('tripId') tripId: number) {
        // 2. ดึง User ID มาจาก Token (ที่ Login มา)
        // แปลงให้เป็น Object User แบบย่อ เพื่อส่งให้ Service
        const user = { id: req.user.userId } as User;

        return this.bookingsService.createBooking(user, tripId);
    }

    @UseGuards(AuthGuard('jwt')) // ต้อง Login ก่อนถึงจะดูประวัติได้
    @Get('my-bookings')
    findMyBookings(@Request() req) {
        // ดึง userId จาก Token แล้วส่งไปให้ Service ค้นหา
        return this.bookingsService.findMyBookings(req.user.userId);
    }

}