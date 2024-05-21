import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from './email/email.module';
import { SessionModule } from './session/session.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, SessionModule, EmailModule],
  exports: [AuthService, SessionModule],
})
export class AuthModule {}
