import Express from "express";


export class PostController{

  validateCreatePost = async (title: string, imageUrl: string, creator: number) : Promise<void> => {
    if (!title) {
      throw new Error ("Missing title");
    }
    if(!creator && creator !== 0){
      throw new Error ("Missing creator");
    }
    if (!imageUrl) {
      throw new Error ("Missing image");
    }
    /*TODO Check if jpeg png 
    var allowed = /(\.jpg|\.jpeg|\.png)$/i;
    if(!allowed.exec(imageUrl)){
      throw Error ("Wrong format");
    }*/
  }

  validateUpdatePost = async (creator: number, title: string) : Promise<void> => {
    if(!creator && creator !== 0){
      throw new Error("Missing creator");
    }
    if(!title){
      throw new Error("Missing title");
    }
  }

  validateGetUserPosts = async (userId: number) : Promise<void> => {
    if(!userId && userId !== 0){
      throw new Error("Missing creator");
    }
  }

  validateDeletePost = async (postId: number, creator: number): Promise<void> => {
    if(!creator && creator !== 0){
      throw new Error("Missing creator"); 
    }
    if(!postId){
      throw new Error("Missin post id")
    }
  }
}

export function makePostController(): PostController {
  return new PostController();
}