import {
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@danieluhm2004/nestjs-tools';

import { Module } from '@nestjs/common';
import { Email } from 'src/auth/email/email.entity';
import { Session } from 'src/auth/session/session.entity';
import { User } from 'src/user/user.entity';
import { EVM } from './evm';

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  url: EVM.DATABASE_URL,
  keepConnectionAlive: true,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  entities: [User, Session, Email],
};

@Module({ imports: [TypeOrmModule.forRoot(options)] })
export class DatabaseModule {}
