import Express from "express";
import { makeUserService, IUserService } from "../service/user.service";
import { User } from "../model/user.interface";

export function makeUserRouter(userService : IUserService) : Express.Express {
  const userRouter : Express.Express = Express();

  userRouter.post("/login", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
      // Req.body is empty during testing
      const username : string = req.body ? req.body.username : "";
      const password : string = req.body ? req.body.password : "";

      const success : User | null = await userService.login(username, password);

      if(success)
        res.status(200).send({status: "Authorized"});
      else
        res.status(401).send({status: "Invalid Credentials"});
    } catch (e : any){
      res.status(500).send({error: e.message});
    }
  })

  userRouter.post("/sign-up", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
      const username : string = req.body.username;
      const password : string = req.body.password;
      const email : string = req.body.email;

      const success : User | null = await userService.register(username, password, email);
      
      if(success)
        res.status(201).send({status: "User created"});
      else
        res.status(400).send({status: "User could not be created"});
    } catch (e : any) {
      res.status(500).send({error: e.message});
    }
  })

  userRouter.put("/:id", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
      const updated : {[key : string] : boolean} = {};
      const promises : Promise<boolean>[] = [];

      const id : number = Number(req.params.id);
      const password : string = req.body.password;
      const email : string = req.body.email;
      const description : string = req.body.description;

      if(password)
        promises.push(userService.updatePassword(id, password).then((success : boolean) => updated["password"] = success));

      if(email)
        promises.push(userService.updateEmail(id, email).then((success : boolean) => updated["email"] = success));

      if(description)
        promises.push(userService.updateDescription(id, description).then((success : boolean) => updated["description"] = success));

      await Promise.allSettled(promises);

      res.status(200).send(updated);
    } catch (e : any) {
      res.status(500).send({error: e.message});
    }
  })

  return userRouter;
}

export function userRouter() : Express.Express {
  return makeUserRouter(makeUserService());
}