import { TypeOrmModule } from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService],
  controllers: [SessionController],
  imports: [TypeOrmModule.forFeature([Session])],
  exports: [SessionService],
})
export class SessionModule {}
