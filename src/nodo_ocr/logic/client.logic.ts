import { Injectable } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { OpportunityAssignmentDto } from '../dto/opportunity-assignment';
import { MessageClientDto } from '../dto/message-client';
import { UpdateClientDto } from '../dto/update-client';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { Client } from '../entities/client.entity';
import axios from 'axios';

@Injectable()
export class ClientLogic {
    constructor(private readonly clientService: ClientService) { }

    async opportunityAssignmentClient(opportunityAssignmentDto: OpportunityAssignmentDto): Promise<Client> {
        const client = await this.clientService.findOne(opportunityAssignmentDto.idClient);

        // Calcula el número de oportunidades y el balance de reserva
        let opportunities = client.opportunities || 0;
        let balanceReserve = client.balanceReserve || 0;
        if (opportunityAssignmentDto.purchaseValue > 0) {
            const purchaseValue = opportunityAssignmentDto.purchaseValue + balanceReserve;
            opportunities += Math.floor(purchaseValue / 50000);
            balanceReserve = purchaseValue % 50000;
        }
        // Actualiza el cliente
        const clientUpdateDto: UpdateClientDto = {
            phone: client.phone,
            opportunities,
            totalPurchased: client.totalPurchased + opportunityAssignmentDto.purchaseValue,
            balanceReserve
        };

        return await this.clientService.update(opportunityAssignmentDto.idClient, clientUpdateDto);
    }

    async handleAgentShoppingClient(idAgent: number): Promise<ShoppingClient | null> {

        console.log('okk', idAgent)
        // Buscar un registro en la tabla shoppingClient por idAgent y readInvoice = 2
        let shoppingClient = await this.clientService.findShoppingClientByAgentAndReadInvoice(idAgent);

        // Si no existe un registro, asignar uno disponible con readInvoice = 2
        if (!shoppingClient) {
            shoppingClient = await this.clientService.assignShoppingClientToAgent(idAgent);
        }
        // Retornar el registro encontrado o asignado
        return shoppingClient;
    }

    async getMessageDataClient(pageNumber : string, phone : string): Promise<MessageClientDto> {
        const response = await axios.get(process.env.URL_GET_MESSAGES_WATI + phone + '?pageSize=1&pageNumber=' + pageNumber, {
            headers: {
                'Authorization': process.env.TOKEN_WATI
            }
        });

        const messageData = response.data?.messages?.items?.[0]?.data;

        const message: MessageClientDto = {
            urlFile: messageData != null ? messageData : ""
        }

        return message;
    }
}