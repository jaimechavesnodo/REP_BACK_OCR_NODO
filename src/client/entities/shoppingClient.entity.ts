import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shoppingClient')
export class ShoppingClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idClient: number;

  @Column()
  price: number;

  @Column()
  nit: string;

  @Column()
  nameStore: string;

  @Column()
  invoiceNumber: string;

  @Column()
  date: Date;

}
