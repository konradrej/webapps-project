import Express from "express";
import { User } from "./model/user.interface";
import { Post } from "./model/post.interface";
import { IPostService, makePostService } from "./service/post.service";

export interface IPostController{
  getPosts: (req: Express.Request, res: Express.Response) => Promise<void>,
  createPost: (req: Express.Request, res: Express.Response) => Promise<void>,
  updatePost: (req: Express.Request, res: Express.Response) => Promise<void>,
  getPost: (req: Express.Request, res: Express.Response) => Promise<void>,
}

export class PostController implements IPostController {
  private postService: IPostService;

  constructor(postService: IPostService){
    this.postService = postService;
  }

  getPosts = async (req: Express.Request, res: Express.Response) => {
    try {
     const order: string = req.body.order;
      const tasks: Array<Post> = await this.postService.getPosts(order);
      res.status(200).send(tasks);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }

  createPost = async (req: Express.Request, res: Express.Response) => {
    try {
      const title: string = req.body.title;
      const description: string = req.body.description;
      const imageUrl: string = req.body.imageUrl;
      const creator: User = req.body.creator
      
      if (!title) {
        res.status(400).send("Missing title\n");
        return;
      }
      if (!creator) {
        res.status(400).send("Missing creator\n");
        return;
      }

      /*TODO Check if jpeg png 
      var allowed = /(\.jpg|\.jpeg|\.png)$/i;
      if(!allowed.exec(imageUrl)){
        res.status(401).send("Not a valid file\n");
        return;
      }*/

      if (!imageUrl) {
        res.status(400).send("Missing image\n");
        return;
      }

      const success: Post = await this.postService.createPost(title, description, imageUrl, creator);
      res.status(201).send(success);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }

  updatePost = async (req: Express.Request, res: Express.Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      this.postService.findById(id).then((post: Post | null) => {
        
        if (!post){
          console.log("test");
          res.status(400).send("Missing post\n");
          return;
        }

        const title: string = req.body.newTitle;
        const description: string = req.body.newDescription;
        const creator: User = req.body.verifyCreator;

        if (!creator) {
          res.status(400).send("Missing creator\n");
          return;
        }

        this.postService.updatePost(id, title, description, creator).then((updated: boolean) => {
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
  }

  getPost = async (req: Express.Request, res: Express.Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      this.postService.findById(id).then((post: Post | null) => {
        if (!post) {
          throw Error("No post with the given id");
        }
        res.status(200).send({ status: "User updated" });

      })
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
}

export function makePostController(): PostController {
  return new PostController(makePostService());
}