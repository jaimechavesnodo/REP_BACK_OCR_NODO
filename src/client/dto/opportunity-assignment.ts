import { IsNumber } from 'class-validator';

export class OpportunityAssignmentDto {

    @IsNumber()
    idClient: number;

    @IsNumber()
    purchaseValue: number;
}
