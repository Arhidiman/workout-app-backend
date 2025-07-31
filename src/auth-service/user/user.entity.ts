import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('app_users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string
}

