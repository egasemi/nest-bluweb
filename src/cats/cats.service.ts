import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { UserActiveInterfase } from '../common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>
  ) {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterfase) {

    const breed = await this.validateBreed(createCatDto.breed)

    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email
    });
  }

  async findAll(user: UserActiveInterfase) {
    let query = {where: {userEmail: user.email}}

    if (user.role === Role.ADMIN) query = undefined

    return await this.catRepository.find(query);
  }

  async findOne(id: number, user: UserActiveInterfase) {
    const cat = await this.catRepository.findOneBy({id})

    this.validateOwnership(cat, user)

    return cat
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterfase) {

    await this.findOne(id,user)

    const breed = updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined
    
    return await this.catRepository.update(id,{
      ...updateCatDto,
      breed,
      userEmail: user.email
    });
  }

  async remove(id: number, user: UserActiveInterfase) {
    await this.findOne(id, user)
    return await this.catRepository.softDelete({id})
  }

  private validateOwnership(cat:Cat, user:UserActiveInterfase) {
    if(user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      return new UnauthorizedException()
    }
  }

  private async validateBreed(breed:string) {
    const breedEntity = await this.breedRepository.findOneBy({name: breed})
    if (!breedEntity) {
      throw new BadRequestException('Breed not found')
    }

    return breedEntity
  }
}
