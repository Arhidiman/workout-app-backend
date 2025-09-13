import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService, JwtModule } from '@nestjs/jwt';
import { SessionModule } from "../session/session.module";
import { RoleModule } from "../role/role.module";
import { User } from "./user.entity";
import { Role } from "../role/role.entity";
import { jwtConstants } from "./jwtConstants";

console.log(jwtConstants.secret, 'its secret key (:')

@Module({
    imports: [
        SessionModule,
        RoleModule,
        TypeOrmModule.forFeature([User, Role]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30s' },
        }),
    ],
    exports: [],
    controllers: [UserController],
    providers: [UserService]
})
export class AuthModule {}