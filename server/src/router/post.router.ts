import Express from "express";
import { PostController } from "../controller/post.controller";
import { Post } from "../model/post.interface";
import {IPostService, PostService} from "../service/post.service";
import {container} from "tsyringe";

export function makePostRouter(postService : IPostService = container.resolve(PostService)) : Express.Express {
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

      PostController.validateCreatePost(title, imageUrl, creator).then((): Promise<Post> => {
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

  postRouter.get("/search", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const search: string = (req.query as any).search;

      PostController.validateSearchPosts(search).then((): Promise<Post[]> => {
        return postService.searchPosts(search);
      }).then((posts: Post[]): void => {
        res.status(200).send(posts);
      }).catch((e: any): void => {
        res.status(400).send({status: "Error searching for posts", reason: e.message});
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message})
    }
  })

  postRouter.put("/:id/updatePost", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id);
      const title: string = req.body.newTitle;
      const description: string = req.body.newDescription;
      const creator: number = req.body.verifyCreator;

      PostController.validateUpdatePost(creator).then((): Promise<boolean> => {
        return postService.updatePost(id, title, description, creator);
      }).then((success: boolean): void => {
        if(success) {
          res.status(200).send({status: "Post updated"});
        }
      }).catch((e: any): void => {
        res.status(400).send({status: "Could not update post", reason: e.message});
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  postRouter.get("/:id", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id);

      postService.getPost(id).then((post: Post): void => {
        res.status(200).send(post)
      }).catch((e: any): void => {
        res.status(400).send({status: "Post not found", reason: e.message})
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
        }).catch((e: any): void => {
          res.status(404).send({status: "Post not found", reason: e.message})
      }).catch((e:any): void => {
        res.status(400).send({status: "Validation failed", reason: e.message})
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })
  */

  /*
  postRouter.put('/:id/deletePost', async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      const id: number = parseInt(req.params.id);
      const creator: number = req.body.verifyCreator;

      postController.validateDeletePost(id, creator).then(() => {
        postService.deletePost(id, creator).then((valid: Boolean): void =>{
          if(valid){
            res.status(200).send({status: "Post deleted"})
          }
        }).catch((e: any): void => {
          res.status(404).send({status: "Post not found", reason: e.message})
        })
      }).catch((e: any): void =>{
        res.status(400).send({status: "Validation failed", reason: e.message})
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })*/
  
  return postRouter;
}