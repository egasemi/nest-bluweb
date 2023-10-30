import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from "bcrypt";
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}
    
    async register(registerDto: RegisterDto) {

        const user = await this.usersService.findOneByEmail(registerDto.email)

        if(user) {
            throw new BadRequestException("el usuario ya existe")
        }

        await this.usersService.create({
            ...registerDto,
            password: await hash(registerDto.password, 10)
        })

        return {
            name: registerDto.name,
            email: registerDto.email
        }
    }

    async login(loginDto: LoginDto) {

        const user = await this.usersService.findOneByEmailWithPass(loginDto.email)

        if (!user || !await compare(loginDto.password,user?.password)) {
            throw new UnauthorizedException("usuario o contraseña inválidos")
        }
        const payload = {sub: user.id, email: user.email, role: user.role}
        return {
            email: loginDto.email,
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async profile({email, role}: {email: string, role: string}) {

        return await this.usersService.findOneByEmail(email)
    }
}
