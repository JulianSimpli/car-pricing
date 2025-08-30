import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.findOne(req.session?.userId)

    if (user) {
      req.currentUser = user
    }

    next()
  }
}