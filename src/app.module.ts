import { NTAppModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database.module';

@Module({
  imports: [NTAppModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
