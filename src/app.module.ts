import {
  MiddlewareConsumer,
  NTAppModule,
  NestModule,
  RequestMethod,
} from '@danieluhm2004/nestjs-tools';
import { Module } from '@nestjs/common';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/database.module';
import { EmailModule } from './email/email.module';
import { InternalModule } from './internal/internal.module';
import { UserMiddleware } from './user/user.middleware';
import { UserModule } from './user/user.module';
import { TronModule } from './tron/tron.module';

@Module({
  imports: [
    NTAppModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    InternalModule,
    TronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/',
          method: RequestMethod.GET,
        },
        {
          path: ':version/internal',
          method: RequestMethod.POST,
        },
        {
          path: ':version/auth/login',
          method: RequestMethod.GET,
        },
        {
          path: ':version/auth/signup',
          method: RequestMethod.POST,
        },
        {
          path: ':version/auth/login/magiclink',
          method: RequestMethod.POST,
        },
        {
          path: ':version/auth/login/password',
          method: RequestMethod.POST,
        },
        {
          path: ':version/auth/magiclink/send',
          method: RequestMethod.POST,
        },
        {
          path: ':version/auth/magiclink/verify',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');

    consumer.apply(UserMiddleware).forRoutes(':version/users/:userId*');
  }
}
