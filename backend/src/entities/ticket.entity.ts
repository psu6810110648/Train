import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn() 
  id: number;

  // 👇 1. เพิ่ม { nullable: true } เพราะเรายังไม่ได้ส่งชื่อตอนจอง
  @Column({ nullable: true }) 
  passengerName: string;

  @Column() 
  seatNumber: string;

  // 👇 2. เพิ่ม { onDelete: 'CASCADE' } เพื่อให้ลบ Booking แล้ว Ticket หายไปด้วย
  @ManyToOne(() => Booking, (booking) => booking.tickets, { onDelete: 'CASCADE' }) 
  booking: Booking;
}