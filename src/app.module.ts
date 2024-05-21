import { NTAppModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [NTAppModule, DatabaseModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
