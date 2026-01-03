import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Trip } from './trip.entity';
import { Ticket } from './ticket.entity'; 
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Trip, (trip) => trip.bookings)
  trip: Trip;

  @Column()
  totalPrice: number;

  @Column({ default: 'CONFIRMED' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  // ตรงนี้คือจุดที่มักจะแดง ให้แก้เป็นแบบนี้:
  @OneToMany(() => Ticket, (ticket) => ticket.booking, { cascade: true })
  tickets: Ticket[];
}