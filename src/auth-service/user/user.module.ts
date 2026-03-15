import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService, JwtModule } from '@nestjs/jwt';
import { SessionModule } from "../session/session.module";
import { RoleModule } from "../role/role.module";
import { User } from "./user.entity";
import { Role } from "../role/role.entity";

@Module({
    imports: [
        SessionModule,
        RoleModule,
        TypeOrmModule.forFeature([User, Role]),
    ],
    exports: [],
    controllers: [UserController],
    providers: [UserService]
})
export class AuthModule {}