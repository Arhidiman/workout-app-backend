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
    @PrimaryGeneratedColumn({ type: 'int'})
    id: number

    @Column({ type: 'number'})
    user_id: number

    
    @Column({ type: 'timestamp', nullable: false })
    created_at: Date

    @Column({ type: 'text', nullable: false })
    refresh_token: string


    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User

    @BeforeInsert()
    generateCode() {
        this.created_at = new Date()
    }
}

