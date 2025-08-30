import { User } from "../user/user.entity";


import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    Unique,
    ManyToOne,
    OneToMany,
    JoinColumn,
    ForeignKey,
    ColumnType,
    BeforeInsert
} from "typeorm";

@Entity('users_sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'number'})
    userId: number

    @Column({ type: 'text', nullable: false })
    refresh_token: string

    @Column({ type: 'timestamp', nullable: false })
    createdAt: Date

    @ManyToOne(() => User, user => user.id)
    // @JoinColumn({ name: 'userId' })
    user: User

    @BeforeInsert()
    generateCode() {
        this.createdAt = new Date()
    }
}

