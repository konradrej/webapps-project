/**
 * This file setups routes for posts, using controller
 * and service to perform its actions.
 */

import Express from "express";
import {PostController} from "../controller/post.controller";
import {Post} from "../model/post.interface";
import {IPostService} from "../service/post.service";
import {makePostDBService} from "../service/post.db.service";
import {isLoggedIn} from "../middleware/auth.middleware";
import assert from "assert";

export function makePostRouter(postService: IPostService): Express.Express {
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

  postRouter.post("/", isLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const creator: number = req.session.currentUser.id;
      
      const title: string = req.body.title;
      const description: string = req.body.description;
      const imageUrl: string = req.body.imageUrl;
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

  postRouter.put("/:id", isLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const creator: number = req.session.currentUser.id;

      const id: number = parseInt(req.params.id);
      const title: string = req.body.newTitle;
      const description: string = req.body.newDescription;

      PostController.validateUpdatePost(creator).then((): Promise<boolean> => {
        return postService.updatePost(id, title, description, creator);
      }).then((success: boolean): void => {
        if (success) {
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

      postService.getPost(id).then((post: Post | null): void => {
        res.status(200).send(post)
      }).catch((e: any): void => {
        res.status(400).send({status: "Post not found", reason: e.message})
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  postRouter.delete('/:id', isLoggedIn, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
      assert(req.session.currentUser, "No user");
      const creator: number = req.session.currentUser.id;
      const id: number = parseInt(req.params.id);

      PostController.validateDeletePost(id, creator).then((): Promise<boolean> => {
        return postService.deletePost(id, creator);
      }).then((success: boolean): void => {
        if (success) {
          res.status(200).send({status: "Post deleted"});
        }
      }).catch((e: any): void => {
        res.status(400).send({status: "Could not delete post", reason: e.message});
      })
    } catch (e: any) {
      res.status(500).send({status: "Server error", reason: e.message});
    }
  })

  return postRouter;
}

export function postRouter(): Express.Express {
  return makePostRouter(makePostDBService());
}