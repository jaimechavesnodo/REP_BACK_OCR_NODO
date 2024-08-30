import { IsString,IsNumber } from 'class-validator';

export class RejectionInvoiceDto {

    @IsNumber()
    idClient: number;

    @IsString()
    rejectionMessage: string;
}
