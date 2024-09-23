import { Injectable } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { OpportunityAssignmentDto } from '../dto/opportunity-assignment';
import { MessageClientDto } from '../dto/message-client';
import { UpdateClientDto } from '../dto/update-client';
import { ShoppingClient } from '../entities/shoppingClient.entity';
import { Client } from '../entities/client.entity';
import { RejectionInvoiceDto } from '../dto/invoice-rejection';
import { HttpException, HttpStatus } from '@nestjs/common';

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

    // async imgURL(): Promise<any> {
    //     // Array de URLs de imágenes
    //     const urls: string[] = ['https://imageCarro1', 'https://imageCarro2', 'https://imageCarro3'];
        
    //     // Array de IDs de clientes
    //     const clientIds: string[] = ['client1', 'client2', 'client3'];
      
    //     // Variable para almacenar las respuestas del servicio
    //     const responses: any[] = [];
      
    //     try {
    //       // Recorremos las URLs para hacer una solicitud POST por cada una
    //       for (let i = 0; i < urls.length; i++) {
    //         const url = urls[i];
      
    //         // 1. Realizamos la solicitud a `readSaveFile3`
    //         const readSaveFileResponse = await axios.post('https://appocrnodo.azurewebsites.net/api/readSaveFile3', {
    //           url: url, // Enviamos cada URL de imagen
    //         }, {
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //         });
      
    //         const data = readSaveFileResponse.data;
      
    //         // 2. Verificamos si la factura existe en la BD
    //         const invoiceExistsResponse = await axios.get(`https://backocrnodo.azurewebsites.net/client/invoice-exists/${data.invoiceNumber}`);
    //         const invoiceExistsData = invoiceExistsResponse.data;
      
    //         // Si la factura existe y el código es 1
    //         if (invoiceExistsData.code === 1) {
    //           // Ejecutamos el servicio `createShoppingClient` con `invoiceRead = 2`
    //           await axios.post('https://backocrnodo.azurewebsites.net/client/createShoppingClient', {
    //             idClient: clientIds[i],
    //             price: data.price,
    //             nit: data.nit,
    //             invoiceNumber: data.invoiceNumber,
    //             invoiceUrl: data.invoiceUrl,
    //             typeProduct: data.typeProduct,
    //             dateInvoice: data.dateInvoice,
    //             invoiceRead: 2,
    //             commerce: data.commerce,
    //             nameClient: 'N/A',
    //           }, {
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //         } else if (!invoiceExistsData.exists && data.invoiceRead === true) {
    //           // 3. Si la factura no existe y `invoiceRead` es true
      
    //           // Ejecutamos el método `opportunityAssignmentClient`
    //           await this.opportunityAssignmentClient({
    //             idClient: clientIds[i],
    //             purchaseValue: data.price
    //           });
      
    //           // Luego ejecutamos el servicio `createShoppingClient` con `invoiceRead = 1`
    //           await axios.post('https://backocrnodo.azurewebsites.net/client/createShoppingClient', {
    //             idClient: clientIds[i],
    //             price: data.price,
    //             nit: data.nit,
    //             invoiceNumber: data.invoiceNumber,
    //             invoiceUrl: data.invoiceUrl,
    //             typeProduct: data.typeProduct,
    //             dateInvoice: data.dateInvoice,
    //             invoiceRead: 1,
    //             commerce: data.commerce,
    //             nameClient: 'N/A',
    //           }, {
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //         } else if (!invoiceExistsData.exists && data.invoiceRead === false) {
    //           // 4. Si la factura no existe y `invoiceRead` es false
      
    //           // Ejecutamos el servicio `createShoppingClient` con `invoiceRead = 2`
    //           await axios.post('https://backocrnodo.azurewebsites.net/client/createShoppingClient', {
    //             idClient: clientIds[i],
    //             price: data.price,
    //             nit: data.nit,
    //             invoiceNumber: data.invoiceNumber,
    //             invoiceUrl: data.invoiceUrl,
    //             typeProduct: data.typeProduct,
    //             dateInvoice: data.dateInvoice,
    //             invoiceRead: 2,
    //             commerce: data.commerce,
    //             nameClient: 'N/A',
    //           }, {
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //         }
      
    //         // Almacenamos la respuesta
    //         responses.push({
    //           clientId: clientIds[i],
    //           url: url,
    //           data: data,
    //         });
    //       }
      
    //       // Devolvemos las respuestas una vez que todas las solicitudes se completen
    //       return responses;
      
    //     } catch (error) {
    //       // Manejamos los errores de la solicitud
    //       if (error.response) {
    //         throw new HttpException({
    //           message: 'Failed to process request',
    //           statusCode: error.response.status,
    //           errorDetails: error.response.data,
    //         }, error.response.status);
    //       } else {
    //         throw new HttpException({
    //           message: 'An error occurred during the request',
    //           errorDetails: error.message,
    //         }, HttpStatus.INTERNAL_SERVER_ERROR);
    //       }
    //     }
    //   }

    async pointsUpdate(opportunityAssignmentDto: OpportunityAssignmentDto): Promise<Client> {
        const clientOpportunity = await this.opportunityAssignmentClient(opportunityAssignmentDto);

        let mensaje = `😀 Tu factura se validó correctamente! Tienes ${clientOpportunity.opportunities}, oportunidades para participar y un acumulado de compras por ${clientOpportunity.totalPurchased} Tu reserva para la próxima oportunidad es de ${clientOpportunity.balanceReserve} 🙌`;

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

    validateDate(dateString: string): number {
        const inputDate = new Date(dateString);
        const comparisonDate = new Date('2024-08-31');
        // Retorna 1 si la fecha es válida (mayor que 2024-08-31), y 2 si es inválida
        return inputDate > comparisonDate ? 1 : 2;
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
