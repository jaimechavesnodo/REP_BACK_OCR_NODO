import { IsString, IsNotEmpty } from 'class-validator';

export class AgentPasswordRecoveryDto {
    @IsString()
    @IsNotEmpty()
    agentEmail: string;
}