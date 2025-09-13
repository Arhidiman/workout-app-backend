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

@Entity('user_roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text'})
    role_name: string
}

