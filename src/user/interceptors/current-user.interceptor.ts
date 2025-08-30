import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  // run after Auth Guard who checks request.session.userId existance
  // interceptor execs only after and before a handle
  constructor(private userService: UserService) { }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('2 - CurrentUserInterceptor');

    const request = context.switchToHttp().getRequest()
    const userId = request.session.userId
    if (userId) {
      const user = await this.userService.findOne(userId)
      request.currentUser = user
    }

    return next.handle()
  }
}