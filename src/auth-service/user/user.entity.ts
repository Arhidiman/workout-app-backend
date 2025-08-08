import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

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

    @Column({ type: 'text', nullable: true})
    access_token: string

    @Column({ type: 'text', nullable: true})
    refresh_token: string
}

