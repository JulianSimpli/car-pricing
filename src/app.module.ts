import { APP_PIPE } from '@nestjs/core';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const cookieSession = require('cookie-session');

import { UserModule } from './user/user.module';

import { ReportModule } from './report/report.module';
import { getDatabaseConfig } from './config/database.config';
import { setConfigService } from './config/env.config';
import { envValidationSchema } from './config/env-validation.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // do not have to re import the config module all over the app
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
      // validationOptions: {
      //   allowUnknown: true, // permite variables no definidas en schema
      //   abortEarly: false,  // muestra todos los errores, no solo el primero
      // },
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    // Does not work with typeormcli and multiple environments
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'better-sqlite3',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       synchronize: true,
    //     }
    //   }
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'better-sqlite3',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UserModule,
    ReportModule
  ],
  controllers: [],
  providers: [
    {
      // global pipe
      provide: APP_PIPE,
      useValue:
        new ValidationPipe({
          whitelist: true, // remove additionals properties from body
        })

    }
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    setConfigService(configService)
  }
  // going to be called automatically whenever our app starts listening for incoming traffic
  configure(consumer: MiddlewareConsumer) {
    // add middlewares that want we apply
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')]
    })).forRoutes('*')
  }
}
