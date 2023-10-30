import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({email});
  }

  findOneByEmailWithPass(email: string) {
    return this.userRepository.findOne({
      where: {email},
      select: ['id', 'name', 'email','password', 'role']
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
