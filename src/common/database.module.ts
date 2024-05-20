import {
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@danieluhm2004/nestjs-tools';

import { Module } from '@nestjs/common';
import { EVM } from './evm';

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  url: EVM.DATABASE_URL,
  keepConnectionAlive: true,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  entities: [],
};

@Module({ imports: [TypeOrmModule.forRoot(options)] })
export class DatabaseModule {}
