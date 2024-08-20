import { Controller, Get, Param, Delete, Post, Put, Body, Query } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { ClientLogic } from '../logic/client.logic';
import { Client } from '../entities/client.entity';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { CreateClientDto } from '../dto/create-client';
import { UpdateClientDto } from '../dto/update-client';
import { UpdatetaeShoppingClientDto } from '../dto/update-shoppingClient';
import { CreateShoppingClientDto } from '../dto/create-shopping-Client';
import { OpportunityAssignmentDto } from '../dto/opportunity-assignment';
import { MessageClientDto } from '../dto/message-client';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService, private readonly clientLogic: ClientLogic) { }

  @Get()
  findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.findOne(+id);
  }

  @Get('getMessageDataClient/:pageNumber/:phone')
  getMessageDataClient(@Param('pageNumber') pageNumber: string,@Param('phone') phone: string): Promise<MessageClientDto> {
    return this.clientLogic.getMessageDataClient(pageNumber,phone);
  }

  @Get('handleAgentShoppingClient/:idAgent')
  handleAgentShoppingClient(@Param('idAgent') idAgent: string): Promise<ShoppingClient> {
    return this.clientLogic.handleAgentShoppingClient(+idAgent);
  }

  
  @Get('shoppingClientsByDateRange/:startDate/:endDate/:limit')
  getShoppingClientsByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('limit') limit: number
  ): Promise<ShoppingClient[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    return this.clientService.findShoppingClientsByDateRange(start, end, limit);
  }
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientService.remove(+id);
  }

  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Post('createShoppingClient')
  createShoppingClient(@Body() createShoppingClientDto: CreateShoppingClientDto): Promise<ShoppingClient> {
    return this.clientService.createShoppingClient(createShoppingClientDto);
  }

  @Post('opportunityAssignmentClient')
  opportunityAssignmentClient(@Body() opportunityAssignmentDto: OpportunityAssignmentDto): Promise<Client> {
    return this.clientLogic.opportunityAssignmentClient(opportunityAssignmentDto);
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
