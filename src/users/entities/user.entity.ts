import { Role } from "../../common/enums/roles.enum";
import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class User {
    @Column({primary:true, generated: true})
    id:number;

    @Column()
    name: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false, select: false})
    password: string;

    @Column({type: 'enum',default: Role.USER, enum: Role})
    role: string;

    @DeleteDateColumn()
    deleteAt: Date;
}
