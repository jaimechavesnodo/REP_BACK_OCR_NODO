import { Controller, Get, Param, Delete, Post, Put, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientLogic } from './client.logic';
import { Client } from './entities/client.entity';
import { ShoppingClient } from './entities/shoppingClient.entity';
import { CreateClientDto } from './dto/create-client';
import { UpdateClientDto } from './dto/update-client';
import { CreateShoppingClientDto } from './dto/create-shopping-Client';
import { OpportunityAssignmentDto } from './dto/opportunity-assignment';
import { MessageClientDto } from './dto/message-client';

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

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.update(+id, updateClientDto);
  }
}
