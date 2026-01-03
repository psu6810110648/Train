import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn() id: number;
  @Column() passengerName: string;
  @Column() seatNumber: string;
  @ManyToOne(() => Booking, (booking) => booking.tickets) booking: Booking;
}