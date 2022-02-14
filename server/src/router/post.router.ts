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


  postRouter.put("/createPost", async (req: Express.Request, res: Express.Response) => {
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

      const success: Post = await postService.createPost(title, description, imageUrl, creator);
      res.status(201).send(success);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  });

  postRouter.put("/:id", async (req: Express.Request, res: Express.Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      postService.findById(id).then((post: Post | null) => {
        if (!post)
          throw Error("No post with the given id");


        const title: string = req.body.newTitle;
        const description: string = req.body.newDescription;
        const creator: User = req.body.verifyCreator;

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

        postService.updatePost(id, title, description, creator).then((updated: boolean) => {
          if (!updated)
            throw Error("Unknown")
          res.status(200).send({ status: "Post updated" });
        });
      }).catch((e: any) => {
        res.status(400).send({ status: "Post could not be updated", reason: e.message });
      })
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  })



  postRouter.get("/getPost", async (req: Express.Request, res: Express.Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      postService.findById(id).then((post: Post | null) => {
        if (!post) {
          throw Error("No post with the given id");
        }
        res.status(200).send({ status: "User updated" });

      })
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  })

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