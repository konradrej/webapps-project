import Express from "express";
import { makeUserService, IUserService } from "../service/user.service";
import {UserController} from "../controller/user.controller";
import {NotLoggedIn, isLoggedIn} from "../middleware/auth.middleware";
import {AuthController} from "../controller/auth.controller";

export function makeUserRouter(userService : IUserService) : Express.Express {
  const userRouter : Express.Express = Express();
  const userController : UserController = new UserController(userService)
  const authController : AuthController = new AuthController(userService)

  userRouter.post("/login", NotLoggedIn, authController.login)

  userRouter.post("/sign-up", NotLoggedIn, authController.signup)

  userRouter.post("/logout", isLoggedIn, authController.logout)

  userRouter.get("/show/:id", userController.showUser)

  userRouter.put("/update", isLoggedIn, userController.updateUser)

  userRouter.put("/update/password", isLoggedIn, userController.updatePassword)

  return userRouter;
}

export function userRouter() : Express.Express {
  return makeUserRouter(makeUserService());
}