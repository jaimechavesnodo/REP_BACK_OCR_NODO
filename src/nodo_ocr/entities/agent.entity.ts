import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('agent')
export class Agent {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentEmail: string;

  @Column()
  agentPassword: string;

  @Column()
  name: string;
}

