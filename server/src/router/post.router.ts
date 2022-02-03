import express, { Request, Response } from "express";
import { PostService } from "../service/post.service";
import { Post } from "..model/post.interface";

export class PostRouter {
  private postService : PostService;

  constructor(postService : PostService){
    this.postService = postService;
  }


}

function makeDefaultPostRouter(){
  return new PostRouter(new PostService());
}