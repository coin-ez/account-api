import {
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@danieluhm2004/nestjs-tools';

import { Module } from '@nestjs/common';
import { EVM } from './evm';

export const options: TypeOrmModuleOptions = {
  type: 'mysql',
  url: EVM.DATABASE_URL,
  keepConnectionAlive: true,
  synchronize: false,
  entities: [],
};

@Module({ imports: [TypeOrmModule.forRoot(options)] })
export class DatabaseModule {}
