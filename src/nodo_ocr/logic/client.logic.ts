import { Injectable } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { OpportunityAssignmentDto } from '../dto/opportunity-assignment';
import { MessageClientDto } from '../dto/message-client';
import { UpdateClientDto } from '../dto/update-client';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { Client } from '../entities/client.entity';
import { RejectionInvoiceDto } from '../dto/invoice-rejection';

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

    async pointsUpdate(opportunityAssignmentDto: OpportunityAssignmentDto): Promise<Client> {
        const clientOpportunity = await this.opportunityAssignmentClient(opportunityAssignmentDto);

        let mensaje = `😀 Tu factura se validó correctamente! Tienes ${clientOpportunity.totalPurchased}, oportunidades para participar y un acumulado de compras por ${clientOpportunity.opportunities} Tu reserva para la próxima oportunidad es de ${clientOpportunity.balanceReserve} 🙌`;

        // Enviar el mensaje utilizando el servicio de WATI
        await this.sendMessage(clientOpportunity.phone, mensaje);

        return clientOpportunity;
    }

    async rejectionInvoice (opportunityAssignment: RejectionInvoiceDto): Promise<Client> {

        const client = await this.clientService.findOne(opportunityAssignment.idClient);

        let mensaje = `❌ Lamentamos informarte que tu factura fue rechazada por el siguiente motivo: ${opportunityAssignment.rejectionMessage}. 😔 Por favor, revisa los detalles y vuelve a intentarlo. ¡Quedan muchos premios! 😊`;

        await this.sendMessage(client.phone,mensaje);

        return client;
    }

    private async sendMessage(phone: string, message: string): Promise<void> {
        const url = `https://live-mt-server.wati.io/330248/api/v1/sendSessionMessage/${phone}?messageText=${encodeURIComponent(message)}`;
        const options = {
            method: 'POST',
            headers: {
                Authorization: process.env.TOKEN_WATI
            }
        };

        try {
            const response = await axios.post(url, null, options);
            console.log('Mensaje enviado con éxito:', response.data);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }



    async handleAgentShoppingClient(idAgent: number): Promise<ShoppingClient | null> {

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
