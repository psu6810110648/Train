import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Trip } from '../entities/trip.entity';
import { User } from '../entities/user.entity';
import { Ticket } from '../entities/ticket.entity'; // 1. Import Ticket

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Trip)
        private tripsRepository: Repository<Trip>,
        
        // 2. Inject Ticket Repository เข้ามา
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
    ) { }

    async createBooking(user: User, tripId: number) {
        const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
        if (!trip) throw new NotFoundException('Trip not found');
        if (trip.bookedSeats >= trip.totalSeats) throw new BadRequestException('Trip is fully booked');

        // --- เริ่ม Transaction (จอง) ---
        
        // 3. สร้าง Booking
        const booking = this.bookingsRepository.create({
            user: user,
            trip: trip,
        });
        await this.bookingsRepository.save(booking);

        // 4. [NEW] คำนวณเลขที่นั่ง (Logic ง่ายๆ: เอาลำดับคนที่จองมาเป็นเลขที่นั่ง)
        // เช่น จองคนที่ 1 -> "A-1", จองคนที่ 5 -> "A-5"
        const seatNo = `A-${trip.bookedSeats + 1}`;

        // 5. [NEW] สร้าง Ticket พร้อมเลขที่นั่ง
        const ticket = this.ticketsRepository.create({
            seatNumber: seatNo,
            booking: booking
        });
        await this.ticketsRepository.save(ticket);

        // 6. ตัดสต็อก +1
        trip.bookedSeats += 1;
        await this.tripsRepository.save(trip);

        return {
            message: 'Booking successful',
            bookingId: booking.id,
            seatNumber: seatNo, // ส่งเลขที่นั่งกลับไปบอกด้วย
            trip: trip.title,
        };
    }

    async findMyBookings(userId: number) {
        return await this.bookingsRepository.find({
            where: { user: { id: userId } },
            // 👇 ดึงข้อมูล Ticket มาด้วย จะได้เอาไปโชว์หน้าเว็บ
            relations: ['trip', 'tickets'], 
            order: { bookingDate: 'DESC' }
        });
    }

    async cancelBooking(bookingId: number, userId: number) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['user', 'trip'],
        });

        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.user.id !== userId) throw new UnauthorizedException('Not your booking');

        const trip = booking.trip;
        if (trip.bookedSeats > 0) {
            trip.bookedSeats -= 1;
            await this.tripsRepository.save(trip);
        }

        // เมื่อลบ Booking -> Ticket จะถูกลบตามอัตโนมัติ (เพราะ Database จัดการให้ หรือ TypeORM Cascade)
        await this.bookingsRepository.remove(booking);

        return { message: 'Cancelled successfully' };
    }
}