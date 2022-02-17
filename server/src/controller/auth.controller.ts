import Express from "express";
import {User} from "../model/user.interface";
import {IUserService} from "../service/user.service";


export class AuthController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService
  }

  login = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;

      this.userService.login(username, password)
          .then((user: User | null) => {
            if (user) {
              req.session.currentUser = user;
              res.status(200).send({status: "Authorized"});
            } else {
              res.status(401).send({status: "Invalid Credentials"});
            }
          })
    } catch (e: any) {
      res.status(500).send({error: e.message});
    }
  }

  logout = async (req: Express.Request, res: Express.Response): Promise<void> => {
    req.session.destroy(() => {
      res.status(200).send("User logged out")
    });
  }

  signup = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;
      const email: string = req.body.email;

      this.userService.register(username, password, email)
          .then((user: User) => {
            req.session.currentUser = user;
            res.status(201).send({status: "User created"});
          })
          .catch((e: any) => {
            res.status(400).send({status: "User could not be created", reason: e.message});
          })
    } catch (e: any) {
      res.status(500).send({error: e.message});
    }
  }
}
