import { Injectable,UnauthorizedException,NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AgentService } from '../service/agent.service';
import { AgentCreateDto } from '../dto/create-user';
import { Agent } from '../entities/agent.entity';
import { AgentLoginDto } from '../dto/agent-login';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AgentLogic {
  constructor(
    private readonly agentService: AgentService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) { }

  async createUser(userCreateDto: AgentCreateDto): Promise<Agent> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userCreateDto.agentPassword, salt);

    const newUserDto = {
      ...userCreateDto,
      agentPassword: hashedPassword,
    };

    return this.agentService.create(newUserDto);
  }

  async login(agentLoginDto: AgentLoginDto) {
    const agent = await this.validateAgent(agentLoginDto.email, agentLoginDto.password);
    if (!agent) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: agent.agentEmail, sub: agent.id };
    return {
      data: { access_token: this.jwtService.sign(payload),email: agent.agentEmail,id : agent.id, typeUser : agent.typeUser, name: agent.name }  
    };
  }

  private async validateAgent(email: string, password: string): Promise<Agent | null> {
    const agent = await this.agentService.findByEmail(email);
    if (agent && await bcrypt.compare(password, agent.agentPassword)) {
      return agent;
    }
    return null;
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 9; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    password += Math.floor(Math.random() * 10); // Añadir un número al final
    return password;
  }

  async resetPassword(agentEmail: string): Promise<void> {
    const agent = await this.agentService.findByEmail(agentEmail);

    if (!agent) {
      throw new NotFoundException('Email not found');
    }

    // Generar nueva contraseña
    const newPassword = this.generateRandomPassword();

    // Encriptar la nueva contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar solo la contraseña en la base de datos
    await this.agentService.update(agent.id, { agentPassword: hashedPassword });

    // Enviar la nueva contraseña por correo electrónico
    await this.mailerService.sendMail({
      to: agent.agentEmail,
      subject: 'Tu nueva contraseña agente de biomax',
      text: `Hola ${agent.name},\n\nTu nueva contraseña es: ${newPassword}\n\nYa puedes iniciar sesión :3.`,
    });
}

}
