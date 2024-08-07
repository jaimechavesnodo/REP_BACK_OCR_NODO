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
  invoiceUrl: string;

  @Column()
  typeProduct: string;

  @Column()
  invoiceNumber: string;

  @Column()
  dateInvoice: string;

  @Column()
  readInvoice: string;

  @Column()
  date: Date;

}

