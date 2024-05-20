import { TypeOrmModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { PhoneController } from './phone.controller';
import { Phone } from './phone.entity';
import { PhoneService } from './phone.service';

@Module({
  providers: [PhoneService],
  controllers: [PhoneController],
  imports: [TypeOrmModule.forFeature([Phone])],
  exports: [PhoneService],
})
export class PhoneModule {}
