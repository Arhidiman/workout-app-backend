import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    Unique,
    JoinColumn, 
    ManyToOne,
    BeforeInsert
} from "typeorm";

import { Role } from "../role/role.entity";

@Unique(['user_name'])
@Entity('app_users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_name: string

    @Column()
    password: string

    @Column()
    @ManyToOne(() => Role, role => role.id)
    @JoinColumn({ name: 'role_id'})
    role_id: number

    @Column({ type: 'timestamp', nullable: false })
    created_at: Date

    @BeforeInsert()
    generateCode() {
        this.created_at = new Date()
    }
}

