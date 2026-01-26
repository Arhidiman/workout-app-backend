import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    Unique
} from "typeorm";

@Unique(['role_name'])
@Entity('user_roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text'})
    role_name: string
}

