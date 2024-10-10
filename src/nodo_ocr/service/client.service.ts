import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

  async findShoppingClientsByDateRangeGroupedByClient(
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<any[]> {
    return this.clientShoppingRepository.createQueryBuilder('shoppingClient')
      .select('shoppingClient.idClient', 'idClient') // Seleccionar idClient
      .addSelect('MAX(shoppingClient.date)', 'latestDate') // Seleccionar la fecha más reciente
      .where('shoppingClient.date >= :startDate', { startDate }) // Condición para la fecha de inicio
      .andWhere('shoppingClient.date <= :endDate', { endDate }) // Condición para la fecha de fin
      .groupBy('shoppingClient.idClient') // Agrupar por idClient
      .orderBy('latestDate', 'DESC') // Ordenar por la fecha más reciente
      .limit(limit) // Limitar la cantidad de registros
      .getRawMany(); // Obtener resultados crudos
  }



  async generateExcelForShoppingClientsByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<Buffer> {
    const shoppingClients = await this.clientShoppingRepository.query(`
    WITH LatestPurchases AS (
    SELECT idClient
    FROM shoppingClient
    WHERE date >= @0 AND date <= @1
    GROUP BY idClient
    ),
    RankedClients AS (
        SELECT
            sh.idClient AS shoppingClientId, 
            sh.price,
            sh.nit,
            sh.typeProduct,
            sh.invoiceNumber,
            sh.dateInvoice,
            sh.date,
            sh.idAgent,
            sh.invoiceRead,
            sh.statusInvoice,
            sh.commerce,
            sh.reasonReject,
            sh.invoiceUrl,
            sh.queue,
            cl.nameClient,
            cl.id AS clientId,  
            cl.phone,
            cl.date AS fecha,
            cl.opportunities,
            cl.totalPurchased,
            cl.balanceReserve,
            cl.numberDocument,
            cl.typeDocument,
            cl.email,
            cl.city,
            cl.vehicle,
            ROW_NUMBER() OVER (PARTITION BY sh.idClient ORDER BY NEWID()) AS rn
        FROM shoppingClient AS sh
        LEFT JOIN client AS cl ON cl.id = sh.idClient
        WHERE sh.idClient IN (SELECT idClient FROM LatestPurchases)
          AND cl.opportunities > 0
          AND sh.nameClient IS NOT NULL
          )
          SELECT TOP (@2) *
          FROM RankedClients
          WHERE rn = 1
          ORDER BY NEWID();

    `, [startDate, endDate, limit]);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ShoppingClients');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'ID Cliente', key: 'idClient', width: 10 },
      { header: 'Nombre Cliente', key: 'name', width: 20 },
      { header: 'Teléfono Cliente', key: 'phone', width: 15 },
      { header: 'Fecha Cliente', key: 'date', width: 15 },
      { header: 'Oportunidades Cliente', key: 'opportunities', width: 20 },
      { header: 'Total Comprado Cliente', key: 'totalPurchased', width: 20 },
      { header: 'Balance Reserva Cliente', key: 'balanceReserve', width: 20 },
      { header: 'Número Documento Cliente', key: 'numberDocument', width: 20 },
      { header: 'Tipo Documento Cliente', key: 'typeDocument', width: 20 },
      { header: 'Email Cliente', key: 'email', width: 25 },
      { header: 'Ciudad Cliente', key: 'city', width: 15 },
      { header: 'Vehículo Cliente', key: 'vehicle', width: 20 },
      { header: 'Precio', key: 'price', width: 15 },
      { header: 'NIT', key: 'nit', width: 15 },
      { header: 'URL Factura', key: 'invoiceUrl', width: 30 },
      { header: 'Tipo Producto', key: 'typeProduct', width: 20 },
      { header: 'Número Factura', key: 'invoiceNumber', width: 20 },
      { header: 'Fecha Factura', key: 'dateInvoice', width: 20 },
      { header: 'Factura Leída', key: 'invoiceRead', width: 15 },
      { header: 'ID Agente', key: 'idAgent', width: 10 },
      { header: 'Estado Factura', key: 'statusInvoice', width: 15 },
      { header: 'Comercio', key: 'commerce', width: 20 },
      { header: 'Razón Rechazo', key: 'reasonReject', width: 20 },
      { header: 'Cola', key: 'queue', width: 10 },
    ];

    // Añadir filas con los datos obtenidos
    shoppingClients.forEach((row: any) => {
      worksheet.addRow({
        id: row.shoppingClientId,
        idClient: row.clientId,
        name: row.nameClient,
        phone: row.phone,
        date: row.date,
        opportunities: row.opportunities,
        totalPurchased: row.totalPurchased,
        balanceReserve: row.balanceReserve,
        numberDocument: row.numberDocument,
        typeDocument: row.typeDocument,
        email: row.email,
        city: row.city,
        vehicle: row.vehicle,
        price: row.price,
        nit: row.nit,
        invoiceUrl: row.invoiceUrl,
        typeProduct: row.typeProduct,
        invoiceNumber: row.invoiceNumber,
        dateInvoice: row.dateInvoice,
        invoiceRead: row.invoiceRead,
        idAgent: row.idAgent,
        statusInvoice: row.statusInvoice,
        commerce: row.commerce,
        reasonReject: row.reasonReject,
        queue: row.queue,
      });
    });

    // Generar el archivo Excel como un buffer
    const arrayBuffer = await workbook.xlsx.writeBuffer(); // Esto retorna un ArrayBuffer
    const buffer = Buffer.from(arrayBuffer); // Convertir ArrayBuffer a Node.js Buffer
    return buffer;
  }


  // Método para seleccionar un subconjunto aleatorio de un array
  private getRandomSubset<T>(array: T[], size: number): T[] {
    const shuffled = array.slice(0);
    let i = array.length;
    let temp: T;
    let index: number;

    while (i--) {
      index = Math.floor(Math.random() * (i + 1));
      temp = shuffled[i];
      shuffled[i] = shuffled[index];
      shuffled[index] = temp;
    }

    return shuffled.slice(0, size);
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


