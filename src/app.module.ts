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
import { User } from './user/user.entity';
import { Magiclink } from './auth/magiclink/magiclink.entity';
import { Session } from './auth/session/session.entity';


@Module({
  imports: [
    import('@adminjs/nestjs').then(({ AdminModule }) => {
      return import('adminjs').then(({ AdminJS }) => {
        return import('@adminjs/typeorm').then((AdminJSTypeORM) => {
          AdminJS.registerAdapter({ Database: AdminJSTypeORM.Database, Resource: AdminJSTypeORM.Resource });
          return AdminModule.createAdminAsync({
            useFactory: () => ({
              adminJsOptions: {
                rootPath: '/admin',
                resources: [
                  {
                    resource: User,
                    options: {
                      properties: {
                        encryptedPassword: {
                          isVisible: false,
                        },
                        password: {
                          type: 'string',
                          isVisible: {
                            list: false,
                            edit: true,
                            filter: false,
                            show: false,
                          },
                        },
                      },
                    },
                  },{
                    resource: Magiclink
                  },
                  {
                    resource : Session
                  }
                ],
              },
            }),
          });
        });
      });
    }),
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
          path: 'admin',
          method: RequestMethod.ALL,
        },

        {
          path: 'admin/*',
          method: RequestMethod.ALL,
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
