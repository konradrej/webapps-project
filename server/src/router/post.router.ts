import Express from "express";
import { makePostController, PostController } from "../controller/post.controller";
import { Post } from "../model/post.interface";
import { IPostService, makePostService } from "../service/post.service";

export function makePostRouter(postService : IPostService, postController : PostController ): Express.Express {
  const postRouter: Express.Express = Express();

  postRouter.get("/", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      let order: string = (req.query as any).order;

      postService.getPosts(order).then((posts: Array<Post>): void => {
        res.status(200).send(posts);
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  postRouter.post("/createPost", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const title: string = req.body.title;
      const description: string = req.body.description;
      const imageUrl: string = req.body.imageUrl;
      const creator: number = req.body.creator;

      postController.validateCreatePost(title, imageUrl, creator).then((): Promise<Post> => {
        return postService.createPost(title, description, imageUrl, creator);
      }).then((createdPost: Post): void => {
        res.status(201).send(createdPost);
      }).catch((e: any): void => {
        res.status(400).send({status: "Could not create post", reason: e.message});
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  postRouter.put("/:id/updatePost", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id);
      const title: string = req.body.newTitle;
      const description: string = req.body.newDescription;
      const creator: number = req.body.verifyCreator;

      postController.validateUpdatePost(creator).then((): Promise<boolean> => {
        return postService.updatePost(id, title, description, creator);
      }).then((success: boolean): void => {
        if(success) {
          res.status(200).send({status: "Post updated"});
        } else {
          throw new Error("Unknown error");
        }
      }).catch((e: any): void => {
        res.status(400).send({status: "Could not update post", reason: e.message});
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
      return;
    }
  })

  postRouter.get("/:id", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id);

      postService.findById(id).then((post: Post | null): void => {
        if(post) {
          res.status(200).send(post);
        } else {
          throw new Error("Post does not exist");
        }
      }).catch((e: any): void => {
        res.status(400).send({status: "Could not get post", reason: e.message})
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  /*
  postRouter.get("/getUserPosts/:id", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const UserId: number = parseInt(req.params.id);
      postController.validateGetUserPosts(UserId).then(() =>{
        postService.getUsersPosts(UserId).then((userPosts: Post[]) => {
          if(userPosts){
            res.status(200).send(userPosts)
          }
          else{
            res.status(404).send({status: "No posts to be found"})
          }
        })
      }).catch((e:any): void => {
        res.status(400).send({status: "Could not get posts", reason: e.message})
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })
  */
  return postRouter;
}

export function postRouter(): Express.Express {
  return makePostRouter(makePostService(), makePostController());
}