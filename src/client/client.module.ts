import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientLogic } from './client.logic';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { ShoppingClient } from './entities/shoppingClient.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Client, ShoppingClient])],
  providers: [ClientService,ClientLogic],
  controllers: [ClientController],
})
export class ClientModule {}
