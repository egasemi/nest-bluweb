import { Cat } from "src/cats/entities/cat.entity";
import { Column, DeleteDateColumn, Entity, OneToMany } from "typeorm";

@Entity()
export class Breed {

    @Column({primary: true, generated: true})
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Cat, (cat) => cat.breed, {
        eager: true
    })
    cats: Cat[]

    @DeleteDateColumn()
    deletedAt: Date
}
