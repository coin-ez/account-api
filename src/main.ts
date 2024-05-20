import {
  Logger,
  NestFactory,
  setupNestjsTools,
} from '@danieluhm2004/nestjs-tools';

import { AppModule } from './app.module';
import { EVM } from './common/evm';
import { Opcode } from './common/opcode';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupNestjsTools(app, {
    swagger: {
      opcode: Opcode,
      auth: {
        username: EVM.SWAGGER_AUTH_USERNAME,
        password: EVM.SWAGGER_AUTH_PASSWORD,
      },
    },
  });

  if (process.env.IS_SCHEDULER === 'true') {
    Logger.log('스케줄러 모드로 실행되었습니다.');
    await app.init();
  } else {
    await app.listen(EVM.WEB_PORT);
  }
}

bootstrap();
