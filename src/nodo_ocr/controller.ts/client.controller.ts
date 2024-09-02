import { Controller, Get, Param, Delete, Post, Put, Body,Res } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { ClientLogic } from '../logic/client.logic';
import { Client } from '../entities/client.entity';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { CreateClientDto } from '../dto/create-client';
import { UpdateClientDto } from '../dto/update-client';
import { UpdatetaeShoppingClientDto } from '../dto/update-shoppingClient';
import { CreateShoppingClientDto } from '../dto/create-shopping-Client';
import { RejectionInvoiceDto } from '../dto/invoice-rejection';
import { OpportunityAssignmentDto } from '../dto/opportunity-assignment';
import { MessageClientDto } from '../dto/message-client';
import { Response } from 'express'; 

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService, private readonly clientLogic: ClientLogic) { }

  @Get()
  findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  
  @Get('invoice-exists/:invoiceNumber')
  async checkInvoiceNumberExists(@Param('invoiceNumber') invoiceNumber: string): Promise<{ exists: boolean, code: number }> {
      const exists = await this.clientService.invoiceNumberExists(invoiceNumber);
      return { exists, code: exists ? 1 : 2 };
  }
  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.findOne(+id);
  }

  @Get('getMessageDataClient/:pageNumber/:phone')
  getMessageDataClient(@Param('pageNumber') pageNumber: string, @Param('phone') phone: string): Promise<MessageClientDto> {
    return this.clientLogic.getMessageDataClient(pageNumber, phone);
  }

  @Get('handleAgentShoppingClient/:idAgent')
  handleAgentShoppingClient(@Param('idAgent') idAgent: string): Promise<ShoppingClient> {
    return this.clientLogic.handleAgentShoppingClient(+idAgent);
  }

  @Get('shoppingClients/invoiceRead/count')
  async countShoppingClientsByInvoiceRead(): Promise<{ count: number }> {
    const count = await this.clientService.countShoppingClientsByInvoiceRead();
    return { count };
  }

  @Get('shoppingClientsByDateRange/:startDate/:endDate/:limit')
  async getShoppingClientsByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('limit') limit: number
  ): Promise<{ data: ShoppingClient[]; totalCount: number }> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const data = await this.clientService.findShoppingClientsByDateRange(start, end, limit);

    const totalCount = data.length;

    return { data, totalCount };
  }

  @Get('downloadShoppingClientsByDateRange/:startDate/:endDate/:limit')
  async downloadShoppingClientsByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('limit') limit: number,
    @Res() res: Response  // Usa el Response de express
  ): Promise<void> {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const buffer = await this.clientService.generateExcelForShoppingClientsByDateRange(start, end, +limit);
  
    // Establecer encabezados para la descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=shopping_clients_${startDate}_to_${endDate}.xlsx`);
  
    // Enviar el archivo Excel
    res.send(buffer);
  }
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientService.remove(+id);
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Post('rejectionInvoice')
  rejectionInvoice(@Body() rejectionInvoiceDto: RejectionInvoiceDto): Promise<Client> {
    return this.clientLogic.rejectionInvoice(rejectionInvoiceDto);
  }

  @Post('createShoppingClient')
  createShoppingClient(@Body() createShoppingClientDto: CreateShoppingClientDto): Promise<ShoppingClient> {
    return this.clientService.createShoppingClient(createShoppingClientDto);
  }

  @Post('opportunityAssignmentClient')
  opportunityAssignmentClient(@Body() opportunityAssignmentDto: OpportunityAssignmentDto): Promise<Client> {
    return this.clientLogic.opportunityAssignmentClient(opportunityAssignmentDto);
  }

  @Put('pointsUpdate')
  pointsUpdate(@Body() opportunityAssignmentDto: OpportunityAssignmentDto): Promise<Client> {
    return this.clientLogic.pointsUpdate(opportunityAssignmentDto);
  }
  
  @Put('shoppingClient/:id')
  updateShoppingClient(
    @Param('id') id: number,
    @Body() updateClientDto: UpdatetaeShoppingClientDto,
  ): Promise<ShoppingClient> {
    return this.clientService.updateShoppingClient(+id, updateClientDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.update(+id, updateClientDto);
  }
}
