import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './service/client.service';
import { AgentService } from './service/agent.service';
import { ClientLogic } from './logic/client.logic';
import { AgentLogic } from './logic/agent.logic';
import { ClientController } from './controller.ts/client.controller';
import { UserController } from './controller.ts/agent.controller';
import { Client } from './entities/client.entity';
import { ShoppingClient } from './entities/shoppingClient.entity';
import { Agent } from './entities/agent.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ShoppingClient, Agent]),
    JwtModule.register({
    secret: "mySuperSecretKey123!@q2024*q@_+secureKeyForJWT", 
    }),
  ],
  providers: [ClientService, ClientLogic, AgentService, AgentLogic],
  controllers: [ClientController, UserController],
})
export class ocrModule {}
