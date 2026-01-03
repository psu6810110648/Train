import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../entities/booking.entity';
import { Trip } from '../entities/trip.entity'; // ต้องใช้ Trip ด้วย

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Trip])], // ลงทะเบียนทั้ง 2 ตาราง
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}