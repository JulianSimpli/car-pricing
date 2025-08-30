import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate {
  // can not inject dependencies
  // so check userId session existance
  // then get User entity in CurrentUserInterceptor
  canActivate(context: ExecutionContext): boolean {
    console.log('1 - AuthGuard');

    const request = context.switchToHttp().getRequest()
    return request.session.userId
  }
}