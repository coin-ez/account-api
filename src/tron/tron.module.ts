import { Module } from '@nestjs/common';
import { TronController } from './tron.controller';
import { TronService } from './tron.service';

@Module({
  // controllers: [TronController],
  providers: [TronService],
})
export class TronModule {}