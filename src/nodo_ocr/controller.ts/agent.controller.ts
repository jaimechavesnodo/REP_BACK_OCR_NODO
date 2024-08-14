import { Controller, Post, Body } from '@nestjs/common';
import { AgentLogic } from '../logic/agent.logic';
import { AgentCreateDto } from '../dto/create-user'; 
import { AgentLoginDto } from '../dto/agent-login';
import { Agent } from '../entities/agent.entity';

@Controller('agent')
export class UserController {
  constructor(private readonly agentLogic: AgentLogic) { }

  @Post()
  create(@Body() createClientDto: AgentCreateDto): Promise<Agent> {
    return this.agentLogic.createUser(createClientDto);
  }

  @Post('login')
  async login(@Body() agentLoginDto: AgentLoginDto) {
    return this.agentLogic.login(agentLoginDto);
  }

  @Post('resetPassword')
  async resetPassword(@Body('email') agentEmail: string): Promise<{ message: string }> {
    await this.agentLogic.resetPassword(agentEmail);
    return { message: 'Se ha enviado un correo electrónico con la nueva contraseña.' };
  }
}

