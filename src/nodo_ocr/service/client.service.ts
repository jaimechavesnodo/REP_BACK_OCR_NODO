import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, MoreThan, Not, QueryBuilder, Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { CreateClientDto } from '../dto/create-client';
import { UpdatetaeShoppingClientDto } from '../dto/update-shoppingClient';
import { CreateShoppingClientDto } from '../dto/create-shopping-Client';
import { UpdateClientDto } from '../dto/update-client';
import * as ExcelJS from 'exceljs';


@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ShoppingClient)
    private clientShoppingRepository: Repository<ShoppingClient>,
  ) { }

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  findOne(id: number): Promise<Client> {
    return this.clientRepository.findOneBy({ id });
  }

  findOneShoppingClient(id: number): Promise<ShoppingClient> {
    return this.clientShoppingRepository.findOneBy({ id });
  }

  async invoiceNumberExists(invoiceNumber: string): Promise<boolean> {
    const count = await this.clientShoppingRepository.count({ where: { invoiceNumber } });
    return count > 0;
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
    const queue = await this.getQueue();
    updateClientDto.queue = queue;
    await this.clientShoppingRepository.update(id, updateClientDto);
    return this.findOneShoppingClient(id);
  }

  async getQueue(): Promise<any> {
    const result = await this.clientShoppingRepository.createQueryBuilder('shoppingClient')
      .select('MAX(shoppingClient.queue)', 'maxQueue')
      .getRawOne();

    const nextQueue = (result.maxQueue || 0) + 1;
    return nextQueue;
  }


  async findShoppingClientByAgentAndReadInvoice(idAgent: number): Promise<ShoppingClient | null> {
    return this.clientShoppingRepository.findOne({
      where: { idAgent, invoiceRead: 2 },
    });
  }

  async findShoppingClientsByDateRange(startDate: Date, endDate: Date, limit: number): Promise<ShoppingClient[]> {
    return this.clientShoppingRepository.createQueryBuilder('shoppingClient')
      .where('shoppingClient.date >= :startDate', { startDate })
      .andWhere('shoppingClient.date <= :endDate', { endDate })
      .take(limit)
      .getMany();
  }

  async generateExcelForShoppingClientsByDateRange(startDate: Date, endDate: Date, limit: number): Promise<Buffer> {
    const shoppingClients = await this.findShoppingClientsByDateRange(startDate, endDate, limit);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ShoppingClients');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'ID Cliente', key: 'idClient', width: 10 },
      { header: 'Precio', key: 'price', width: 15 },
      { header: 'NIT', key: 'nit', width: 15 },
      { header: 'URL Factura', key: 'invoiceUrl', width: 30 },
      { header: 'Tipo Producto', key: 'typeProduct', width: 20 },
      { header: 'Número Factura', key: 'invoiceNumber', width: 20 },
      { header: 'Fecha Factura', key: 'dateInvoice', width: 20 },
      { header: 'Fecha', key: 'date', width: 20 },
      { header: 'Factura Leída', key: 'invoiceRead', width: 15 },
      { header: 'ID Agente', key: 'idAgent', width: 10 },
      { header: 'Estado Factura', key: 'statusInvoice', width: 15 },
      { header: 'Comercio', key: 'commerce', width: 20 },
      { header: 'Razón Rechazo', key: 'reasonReject', width: 20 },
      { header: 'Cola', key: 'queue', width: 10 },
    ];

    // Añadir filas
    shoppingClients.forEach(client => {
      worksheet.addRow(client);
    });

    // Generar el archivo Excel como un buffer
    const buffer: Buffer = await workbook.xlsx.writeBuffer() as Buffer;
    return buffer;
  }

  async countShoppingClientsByInvoiceRead(): Promise<number> {
    return this.clientShoppingRepository.count({
      where: { invoiceRead: 2 }
    });
  }

  async assignShoppingClientToAgent(idAgent: number): Promise<ShoppingClient | null> {
    const unassignedShoppingClient = await this.clientShoppingRepository.findOne({
      where: { idAgent: null, invoiceRead: 2 },
      order: { queue: 'ASC' }
    });

    console.log(unassignedShoppingClient);

    if (unassignedShoppingClient) {
      unassignedShoppingClient.idAgent = idAgent;
      unassignedShoppingClient.queue = 0;
      return this.clientShoppingRepository.save(unassignedShoppingClient);
    }

    return null;
  }
}


