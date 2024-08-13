import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('participatingStore')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameStore: string;

  @Column()
  nit: string;
}


