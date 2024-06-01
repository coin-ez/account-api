import { TypeOrmModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { TronModule } from 'src/tron/tron.module';
import { TronService } from 'src/tron/tron.service';

@Module({
  providers: [UserService, TronService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), TronModule,],
  exports: [UserService,],
})
export class UserModule {}
