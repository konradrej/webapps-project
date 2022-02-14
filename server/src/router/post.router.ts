import Express from "express";
import { IPostController, makePostController } from "../post.controller";

export function makePostRouter(postController: IPostController): Express.Express {
  const postRouter: Express.Express = Express();

  postRouter.get("/order", postController.getPosts);
  
  postRouter.post("/createPost", postController.createPost);

  postRouter.put("/:id", postController.updatePost);

  postRouter.get("/getPost", postController.getPost);

  return postRouter;
}

export function postRouter(): Express.Express {
  return makePostRouter(makePostController());
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