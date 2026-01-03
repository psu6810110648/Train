import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() title: string;
  @Column() origin: string;
  @Column() destination: string;
  @Column() departureTime: Date;
  @Column() price: number;
  @Column() totalSeats: number;
  @Column({ default: 0 }) bookedSeats: number;

  @OneToMany(() => Booking, (booking) => booking.trip)
  bookings: Booking[];
}