import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PhoneModule } from './phone/phone.module';
import { SessionModule } from './session/session.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, SessionModule, PhoneModule],
  exports: [AuthService, SessionModule],
})
export class AuthModule {}
