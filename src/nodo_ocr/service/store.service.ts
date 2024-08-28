import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto } from '../dto/create-store';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  findAll(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  findOne(id: number): Promise<Store> {
    return this.storeRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.storeRepository.delete(id);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const newUser = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(newUser);
  }

  // Método para validar el NIT
  async checkNitExists(nit: string): Promise<number> {
    // Eliminar puntos, guion y dígito de verificación
    let cleanNit = nit.replace(/\./g, '').replace(/-\d$/, '');

    // Si el NIT tiene más de 9 dígitos, recortarlo a los primeros 9
    if (cleanNit.length > 9) {
      cleanNit = cleanNit.substring(0, 9);
    }
    
    // Buscar el NIT en la base de datos
    const store = await this.storeRepository.findOne({ where: { nit: cleanNit } });
    return store ? 1 : 2;
  }

}
