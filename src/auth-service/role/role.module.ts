import { Module } from "@nestjs/common";
import { Role } from './role.entity'
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    // imports: [
    //     TypeOrmModule.forFeature([Role]),
    // ],
    exports: [Role],
    // controllers: [SessionController],
    providers: [Role]
})
export class RoleModule {}