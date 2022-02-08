import Express, { Request, Response } from "express";
import { makePostService, IPostService } from "../service/post.service";
import { Post } from "../model/post.interface";
import { User } from "../model/user.interface";

export function makePostRouter(postService: IPostService): Express.Express {
  const postRouter: Express.Express = Express();

  postRouter.get("/order", async (req: Express.Request, res: Express.Response) => {
    try {
      const order: string = req.body.order;
      if (!order) {
        res.status(400).send("Missing order\n");
        return;
      }
      const tasks: Array<Post> = await postService.getPosts(order);
      res.status(200).send(tasks);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  });


  postRouter.post("/createPost", async (req: Express.Request, res: Express.Response) => {
    try {
      const title: string = req.body.title;
      const description: string = req.body.description;
      const imageUrl: string = req.body.imageUrl;
      const creator: User = req.body.creator;

      if (!title) {
        res.status(400).send("Missing title\n");
        return;
      }

      if (!description) {
        res.status(400).send("Missing description\n");
        return;
      }

      if (!creator) {
        res.status(400).send("Missing creator\n");
        return;
      }
      if (!imageUrl) {
        res.status(400).send("Missing image\n");
        return;
      }

      const success: boolean = await postService.createPost(title, description, imageUrl, creator);

      if (!success) {
        res.status(400).send(`Post created}\n`);
        return;
      }

      res.status(200).send("Post could not be created");
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  });

  postRouter.put("/:id", async (req: Express.Request, res: Express.Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      const title: string = req.body.newTitle;
      const description: string = req.body.newDescription;
      const creator: User = req.body.verifyCreator;

      /*if (!req.body.done) {
                  res.status(400).send("Bad call to /task/:id\n");
                  return;
              }
      */

      if (!title) {
        res.status(400).send("Missing title\n");
        return;
      }

      if (!description) {
        res.status(400).send("Missing description\n");
        return;
      }

      if (!creator) {
        res.status(400).send("Missing creator\n");
        return;
      }

      const updated: boolean = await postService.updatePost(id, title, description, creator);

      if (!updated) {
        res.status(400).send(`Task was not updated}\n`);
        return;
      }

      res.status(200).send("Post has been updated");
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  });

  return postRouter;
}

export function postRouter(): Express.Express {
  return makePostRouter(makePostService());
}

/*export class PostRouter {
  private postService : PostService;

  constructor(postService : PostService){
    this.postService = postService;
  }


}

function makeDefaultPostRouter(){
  return new PostRouter(new PostService());
}*/