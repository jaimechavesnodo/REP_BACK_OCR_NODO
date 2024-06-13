import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  date: Date;

  @Column()
  opportunities: number;

  @Column()
  totalPurchased: number;

  @Column()
  balanceReserve: number;

  @Column()
  numberDocument: string;

  @Column()
  typeDocument: string;

  @Column()
  email: string;

  @Column()
  city: string;
}
