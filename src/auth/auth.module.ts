import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagiclinkModule } from './magiclink/magiclink.module';
import { SessionModule } from './session/session.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, SessionModule, MagiclinkModule],
  exports: [AuthService, SessionModule],
})
export class AuthModule {}
