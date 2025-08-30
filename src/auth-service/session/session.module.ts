import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService, JwtModule } from '@nestjs/jwt';
import { Session } from "./session.entity";
import { AuthModule } from "../user/user.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([Session]),
    ],
    exports: [SessionService],
    controllers: [SessionController],
    providers: [SessionService]
})
export class SessionModule {}