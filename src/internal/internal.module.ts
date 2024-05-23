import { Module, forwardRef } from '@nestjs/common';

import { NTAppModule } from '@danieluhm2004/nestjs-tools';
import { SessionModule } from 'src/auth/session/session.module';
import { AppModule } from '../app.module';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';

@Module({
  controllers: [InternalController],
  providers: [InternalService],
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => UserModule),
    forwardRef(() => SessionModule),
    forwardRef(() => EmailModule),
    NTAppModule,
  ],
  exports: [InternalService],
})
export class InternalModule {}
