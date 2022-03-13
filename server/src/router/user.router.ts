/**
 * This file setups routes for users, using controller
 * and service to perform its actions.
 */

import Express from "express";
import {IUserService, IUpdateObject} from "../service/user.service";
import {NotLoggedIn, isLoggedIn} from "../middleware/auth.middleware";
import assert from "assert";
import {User} from "../model/user.interface";
import {UserController} from "../controller/user.controller";
import {IPostService} from "../service/post.service";
import {makePostDBService} from "../service/post.db.service";
import {makeUserDBService} from "../service/user.db.service";

export function makeUserRouter(userService: IUserService, postService: IPostService): Express.Express {
  const userRouter: Express.Express = Express();

  userRouter.post("/login", NotLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    userService.login(username, password)
        .then((user: User | null) => {
          if (user) {
            req.session.currentUser = user;
            res.status(200).send({status: "Authorized"});
          } else {
            res.status(401).send({status: "Unauthorized", reason: "Invalid Credentials"});
          }
        })
  })

  userRouter.post("/sign-up", NotLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;
      const email: string = req.body.email;

      UserController.validateSignup(username, password, email)
          .then(async () => {
            let user = await userService.register(username, password, email)
            if (user) {
              req.session.currentUser = user;
              res.status(201).send({
                status: "User created",
              });
            }
          })
          .catch((e) => {
            res.status(400).send({status: "User could not be created", reason: e.message});
          })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  userRouter.post("/logout", isLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try{
      req.session.destroy(() => {
        res.status(200).send({status: "User logged out"})
      });
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  userRouter.put("/update", isLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const id: number = req.session.currentUser.id;

      const updateObject: IUpdateObject = {};
      const email: string = req.body.email;
      const description: string = req.body.description;
      const profileImageUrl: string = req.body.profileImageUrl;

      if (email)
        updateObject.email = email;

      if (description)
        updateObject.description = description;

      if (profileImageUrl)
        updateObject.profileImageUrl = profileImageUrl;

      if (Object.keys(updateObject).length > 0 && (await userService.update(id, updateObject))) {
        res.status(200).send({status: "User updated"});
      } else {
        res.status(400).send({status: "User could not be updated"});
      }
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  userRouter.put("/update/password", isLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const id: number = req.session.currentUser.id;
      const password: string = req.body.password;

      let updated = await userService.setPassword(id, password)
      if (!updated) {
        res.status(400).send({status: "Password could not be updated"});
      } else {
        res.status(200).send({status: "Password updated"});
      }
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  userRouter.get("/session", isLoggedIn, (req: Express.Request, res: Express.Response) => {
    try {
      assert(req.session.currentUser, "No user");
      let user = req.session.currentUser

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        description: user.description,
        createdAt: user.createdAt,
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  userRouter.get("/:id", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = Number(req.params.id);
      const user = await userService.findById(id);
      if (user) {
        res.status(200).send({
          user: user,
          posts: await postService.getUsersPosts(user.id)
        });
      } else {
        res.status(404).send({status: "Invalid user"});
      }
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  return userRouter;
}

export function userRouter(): Express.Express {
  return makeUserRouter(makeUserDBService(), makePostDBService());
}