import { TypeOrmModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { Email } from './email.entity';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  controllers: [EmailController],
  imports: [TypeOrmModule.forFeature([Email])],
  exports: [EmailService],
})
export class EmailModule {}
