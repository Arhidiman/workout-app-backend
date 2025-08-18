import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService, JwtModule } from '@nestjs/jwt';
import { User } from "./user.entity";
import { jwtConstants } from "./jwtConstants";

console.log(jwtConstants.secret, 'its secret key (:')

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '6000s' },
        }),
    ],
    exports: [],
    controllers: [UserController],
    providers: [UserService]
})
export class AuthModule {
    
}