import { TypeOrmModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { EmailController } from './magiclink.controller';
import { Magiclink } from './magiclink.entity';
import { MagiclinkService } from './magiclink.service';

@Module({
  providers: [MagiclinkService],
  controllers: [EmailController],
  imports: [TypeOrmModule.forFeature([Magiclink])],
  exports: [MagiclinkService],
})
export class MagiclinkModule {}
