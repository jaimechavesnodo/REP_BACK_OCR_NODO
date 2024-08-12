import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from '../service/agent.service';
import { AgentLogic } from '../logic/agent.logic';
import { AgentCreateDto } from '../dto/create-user'; 
import { AgentLoginDto } from '../dto/agent-login';
import { Agent } from '../entities/agent.entity';

@Controller('agent')
export class UserController {
  constructor(private readonly userService: AgentService, private readonly agentLogic: AgentLogic) { }

  @Post()
  create(@Body() createClientDto: AgentCreateDto): Promise<Agent> {
    return this.agentLogic.createUser(createClientDto);
  }

  @Post('login')
  async login(@Body() agentLoginDto: AgentLoginDto) {
    return this.agentLogic.login(agentLoginDto);
  }
}

