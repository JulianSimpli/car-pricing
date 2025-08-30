import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { APP_INTERCEPTOR } from '@nestjs/core'

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]) // create user repository - permite @InjectRepository(User)
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    // if only authGuard is configured
    // {
    //   provide: APP_INTERCEPTOR, // global interceptor
    //   useClass: CurrentUserInterceptor
    // }
  ],
})
export class UserModule {
  // going to be called automatically when our app starts this module
  configure(consumer: MiddlewareConsumer) {
    // add middlewares that want we apply
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
