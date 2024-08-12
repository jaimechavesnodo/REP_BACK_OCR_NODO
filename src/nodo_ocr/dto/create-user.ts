import { IsString } from 'class-validator';

export class AgentCreateDto {

  @IsString()
  agentEmail: string;

  @IsString()
  agentPassword: string;

}
