import Express from "express";
import { makeUserService, IUserService, IUpdateObject } from "../service/user.service";
import { User } from "../model/user.interface";

export function makeUserRouter(userService : IUserService) : Express.Express {
  const userRouter : Express.Express = Express();

  userRouter.post("/login", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
      const username : string = req.body.username;
      const password : string = req.body.password;

      userService.login(username, password).then((user : User | null) => {
        if(user)
          res.status(200).send({status: "Authorized"});
        else
          res.status(401).send({status: "Invalid Credentials"});
      })
    } catch (e : any){
      console.log(e)
      res.status(500).send({error: e.message});
    }
  })

  userRouter.post("/sign-up", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
      const username : string = req.body.username;
      const password : string = req.body.password;
      const email : string = req.body.email;

      userService.register(username, password, email).then((user: User) => {
        res.status(201).send({status: "User created"});
      }).catch((e : any) => {
        res.status(400).send({status: "User could not be created", reason: e.message});
      })
    } catch (e : any) {
      res.status(500).send({error: e.message});
    }
  })

  userRouter.put("/:id", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
      const id : number = Number(req.params.id);

      userService.findById(id).then((user: User | null) => {
        if(! user)
          throw Error("No user with the given id");
        
        const updateObject : IUpdateObject = {};
        const email : string = req.body.email;
        const description : string = req.body.description;
        const profileImageUrl : string = req.body.profileImageUrl;

        if(email)
          updateObject.email = email;

        if(description)
          updateObject.description = description;

        if(profileImageUrl)
          updateObject.profileImageUrl = profileImageUrl;

        userService.update(user, updateObject).then((success : boolean) => {
          if(!success)
            throw Error("Unknown")
            
          res.status(200).send({status: "User updated"});
        });
      }).catch((e : any) => {
        res.status(400).send({status: "User could not be updated", reason: e.message});
      })
    } catch (e : any) {
      res.status(500).send({error: e.message});
    }
  })

  userRouter.put("/:id/updatePassword", async (req: Express.Request, res: Express.Response) : Promise<void> => {
    try {
        const id : number = Number(req.params.id);

        userService.findById(id).then((user : User | null) => {
          if(! user)
            throw Error("No user with the given id");
          
          const password : string = req.body.password;

          userService.setPassword(user, password).then((success : boolean) => {
            if(!success)
              throw Error("Unknown");

            res.status(200).send({status: "Password updated"});
          })
        }).catch((e : any) => {
          res.status(400).send({status: "Password could not be updated", reason: e.message});
        })
    } catch (e : any) {
      res.status(500).send({error: e.message});
    }
  })

  return userRouter;
}

export function userRouter() : Express.Express {
  return makeUserRouter(makeUserService());
}