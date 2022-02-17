import Express from "express";
import { User } from "../model/user.interface";


export class PostController{

  createPost = async (reqTitle: string, reqImageUrl: string, reqCreator: User) => {
    const title: string = reqTitle;
    const imageUrl: string = reqImageUrl;
    const creator: User = reqCreator;

      if (!title) {
        throw Error ("Missing title");
      }
      if (!creator) {
        throw Error ("Missing creator");
      }
      if (!imageUrl) {
        throw Error ("Missing image");
      }

      /*TODO Check if jpeg png 
      var allowed = /(\.jpg|\.jpeg|\.png)$/i;
      if(!allowed.exec(imageUrl)){
        throw Error ("Wrong format");
      }*/
  }
}

export function makePostController(): PostController {
  return new PostController();
}