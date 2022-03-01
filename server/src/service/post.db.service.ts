import { IPostService } from "./post.service";
import { postModel } from "../db/post.model";
import { Post } from "../model/post.interface";

class PostDBService implements IPostService{
  getPosts(order: string): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  createPost(title: string, description: string, imageUrl: string, creator: number): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  updatePost(id: number, newTitle: string | null, newDescription: string | null, verifyCreator: number | null): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getPost(id: number): Promise<Post | null> {
    throw new Error("Method not implemented.");
  }
  findById(id: number): Promise<Post | null> {
    throw new Error("Method not implemented.");
  }
  getUsersPosts(UserId: number): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  deletePost(id: number, verifyCreator: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  searchPosts(search: string): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  
}