import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { CreateClientDto } from '../dto/create-client';
import { UpdatetaeShoppingClientDto } from '../dto/update-shoppingClient';
import { CreateShoppingClientDto } from '../dto/create-shopping-Client';
import { UpdateClientDto } from '../dto/update-client';


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

  findOneShoppingClient(id: number): Promise<ShoppingClient> {
    return this.clientShoppingRepository.findOneBy({ id });
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

   async findShoppingClientsByParam(paramName: string, paramValue: any): Promise<ShoppingClient[]> {
    return this.clientShoppingRepository.find({
      where: { [paramName]: paramValue }
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    await this.clientRepository.update(id, updateClientDto);
    return this.findOne(id); 
  }


  async updateShoppingClient(id: number, updateClientDto: UpdatetaeShoppingClientDto): Promise<ShoppingClient> {
    await this.clientShoppingRepository.update(id, updateClientDto);
    return this.findOneShoppingClient(id); 
  }


  async findShoppingClientByAgentAndReadInvoice(idAgent: number): Promise<ShoppingClient | null> {
    return this.clientShoppingRepository.findOne({
      where: { idAgent, invoiceRead: 2 },
    });
  }

  async assignShoppingClientToAgent(idAgent: number): Promise<ShoppingClient | null> {
    const unassignedShoppingClient = await this.clientShoppingRepository.findOne({
      where: { idAgent: null, invoiceRead: 2 },
      order: { id: 'DESC' }
    });

    if (unassignedShoppingClient) {
      unassignedShoppingClient.idAgent = idAgent;
      return this.clientShoppingRepository.save(unassignedShoppingClient);
    }

    return null;
  }
}


