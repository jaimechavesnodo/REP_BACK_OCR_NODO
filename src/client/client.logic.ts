import { Injectable } from '@nestjs/common';
import { ClientService } from './client.service';
import { OpportunityAssignmentDto } from './dto/opportunity-assignment';
import { UpdateClientDto } from './dto/update-client';
import { Client } from './entities/client.entity';

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
}
