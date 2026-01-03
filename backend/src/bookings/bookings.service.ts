import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Trip } from '../entities/trip.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Trip)
        private tripsRepository: Repository<Trip>,
    ) { }

    async createBooking(user: User, tripId: number) {
        // 1. ค้นหาเที่ยวรถที่ลูกค้าเลือก
        const trip = await this.tripsRepository.findOne({ where: { id: tripId } });

        if (!trip) {
            throw new NotFoundException('Trip not found (หาเที่ยวรถไม่เจอ)');
        }

        // 2. [จุดสำคัญ] เช็คว่าที่นั่งเต็มหรือยัง?
        if (trip.bookedSeats >= trip.totalSeats) {
            throw new BadRequestException('Trip is fully booked (รถเต็มแล้ว)');
        }

        // 3. สร้างใบจอง (เชื่อมโยง User กับ Trip)
        const booking = this.bookingsRepository.create({
            user: user, // คนจอง (ดึงมาจาก Token)
            trip: trip, // เที่ยวรถที่จะไป
        });

        // 4. บันทึกการจองลง Database
        await this.bookingsRepository.save(booking);

        // 5. [ตัดสต็อก] เพิ่มยอดคนจองในรถ +1
        trip.bookedSeats += 1;
        await this.tripsRepository.save(trip);

        return {
            message: 'Booking successful (จองสำเร็จ)',
            bookingId: booking.id,
            trip: trip.title,
            seatsLeft: trip.totalSeats - trip.bookedSeats
        };
    }

    async findMyBookings(userId: number) {
        return await this.bookingsRepository.find({
            where: { user: { id: userId } }, // ค้นหาเฉพาะของ User คนนี้
            relations: ['trip'], // ดึงข้อมูลเที่ยวรถมาแสดงด้วย (จะได้รู้ว่าไปไหน)
            order: { bookingDate: 'DESC' } // เรียงจากล่าสุด -> เก่าสุด
        });
    }
}