import Express from "express";
import { makePostController, PostController } from "../controller/post.controller";
import { Post } from "../model/post.interface";
import { User } from "../model/user.interface";
import { IPostService, makePostService } from "../service/post.service";

export function makePostRouter(postService : IPostService ): Express.Express {
  const postRouter: Express.Express = Express();
  const postController: PostController = makePostController();

  postRouter.get("/order", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const order: string = req.body.order;
      const posts: Array<Post> = await postService.getPosts(order);
      res.status(200).send(posts);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  })

  postRouter.post("/createPost", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      try {
        // Validate request
        postController.createPost(req.body.title, req.body.imageUrl, req.body.creator);
      }
      catch(e: any){
        res.status(400).send(e.message);
      }

      const title: string = req.body.title;
      const description: string = req.body.description;
      const imageUrl: string = req.body.imageUrl;
      const creator: User = req.body.creator

      const success: Post = await postService.createPost(title, description, imageUrl, creator);
      res.status(201).send(success);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  })

  postRouter.put("/:id", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id, 10);

      postService.findById(id).then((post: Post | null) => {
        
        if (!post){
          res.status(400).send("Post does not exist\n");
          return;
        }

        const title: string = req.body.newTitle;
        const description: string = req.body.newDescription;
        const creator: User = req.body.verifyCreator;

        if (!creator) {
          res.status(400).send("Not specified user\n");
          return;
        }

        postService.updatePost(id, title, description, creator).then((_: boolean) => {
          res.status(200).send({ status: "Post updated" });
        });
      }).catch((e: any) => {
        res.status(400).send({ status: "Post could not be updated", reason: e.message });
      })
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  })

  postRouter.get("/getPost", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id, 10);

      postService.findById(id).then((post: Post | null) => {
        if (!post) {
          throw Error("Post does not exist");
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