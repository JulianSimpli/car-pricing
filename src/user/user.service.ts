import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  // @InjectRepository(User) - quiero inyectar el repositorio especifico para User
  // Conecta con TypeOrmModule.forFeature([User])
  // Repository(User) - Tipo clase generica que incluye los metodos CRUD de User en este caso
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  create(email, password) {
    const newUser = this.userRepository.create({ email, password })
    return this.userRepository.save(newUser)
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id)
    if (!user) throw new NotFoundException('User not found')
    Object.assign(user, attrs)
    return this.userRepository.save(user)
  }

  findOne(id: number) {
    return id ? this.userRepository.findOneBy({ id }) : null
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } })
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    if (!user) throw new NotFoundException('User not found')
    return this.userRepository.remove(user)
  }
}
