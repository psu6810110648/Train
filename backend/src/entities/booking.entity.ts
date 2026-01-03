import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Trip } from './trip.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  bookingDate: Date; // วันที่กดจอง

  // เชื่อมกับตาราง User (ใครจอง?)
  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  // เชื่อมกับตาราง Trip (ไปรถคันไหน?)
  @ManyToOne(() => Trip, (trip) => trip.bookings)
  trip: Trip;

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];

}