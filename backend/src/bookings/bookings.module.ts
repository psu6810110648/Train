import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../entities/booking.entity';
import { Trip } from '../entities/trip.entity';
import { Ticket } from '../entities/ticket.entity'; // 1. Import Ticket เข้ามา

@Module({
  // 2. เพิ่ม Ticket เข้าไปใน Array นี้ 👇
  imports: [TypeOrmModule.forFeature([Booking, Trip, Ticket])], 
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}