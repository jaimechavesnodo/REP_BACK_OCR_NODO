import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ShoppingClient } from './entities/shoppingClient.entity';
import { CreateClientDto } from './dto/create-client';
import { CreateShoppingClientDto } from './dto/create-shopping-Client';
import { UpdateClientDto } from './dto/update-client';


@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ShoppingClient)
    private clientShoppingRepository: Repository<ShoppingClient>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  findOne(id: number): Promise<Client> {
    return this.clientRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async create(createUserDto: CreateClientDto): Promise<Client> {
    const newUser = this.clientRepository.create(createUserDto);
    return this.clientRepository.save(createUserDto);
  }

  async createShoppingClient(createShoppingClientDto: CreateShoppingClientDto): Promise<ShoppingClient> {
    const newUser = this.clientShoppingRepository.create(createShoppingClientDto);
    return this.clientShoppingRepository.save(createShoppingClientDto);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    await this.clientRepository.update(id, updateClientDto);
    return this.findOne(id); 
  }
}
