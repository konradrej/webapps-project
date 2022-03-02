import { IPostService } from "./post.service";
import { postModel } from "../db/post.model";
import { Post } from "../model/post.interface";

export class PostDBService implements IPostService{
  async getPosts(order: string): Promise<Post[]> {
    switch (order) {
      // Title A-Z
      case "title-ascending": {
        return Object.values(await postModel.find()).sort(
          (a, b) => a.title < b.title ? -1 : 1
        )
      }
      // Title Z-A
      case "title-descending": {
        return Object.values(await postModel.find()).sort(
          (a, b) => a.title < b.title ? 1 : -1
        )
      }
      // Most recent first
      case "recent-descending":
      default: {
        return Object.values(await postModel.find()).sort(
          (a, b) => a.createdAt < b.createdAt ? 1 : -1
        );
      }
    }
  }

  async createPost(title: string, description: string, imageUrl: string, creator: number): Promise<Post> {
    return await postModel.create({
      id : new Date().valueOf(), //Change this?
      title : title,
      description : description,
      imageUrl : imageUrl,
      creator : creator
    })
  }

  async updatePost(id: number, newTitle: string | null, newDescription: string | null, verifyCreator: number | null): Promise<boolean> {
    if(!(await postModel.exists({id : id}))){
      throw Error("Post not found");
    }
    if(!(await postModel.exists({id : id , creator : verifyCreator}))){
      throw Error("Specified user is not creator");
    }
    if(newDescription){
      await postModel.updateOne({id : id }, {description : newDescription});
    }
    if(newTitle){
      await postModel.updateOne({id : id }, {title : newTitle});
    }

    await postModel.updateOne({id : id }, {modifiedAt : new Date()});
    return true;
  }
  async getPost(id: number): Promise<Post> {
    const post: Post | null  = await postModel.findOne({id : id})
    if(!post){
      throw Error("Post not found");
    }
    return post;
  }

  //Wont be needing this one?
  async findById(id: number): Promise<Post | null> {
    throw new Error("Method not implemented.");
  }

  async getUsersPosts(userId: number): Promise<Post[]> {
    return await postModel.find({creator : userId});
  }

  async deletePost(id: number, verifyCreator: number): Promise<boolean> {
    if(!(await postModel.exists({id : id}))){
      throw Error("Post not found");
    }
    if(!(await postModel.exists({id : id , creator : verifyCreator}))){
      throw Error("Specified user is not creator");
    }
    await postModel.deleteOne({id : id})
    return true;
  }

  async searchPosts(search: string): Promise<Post[]> {
    const searchResult: Post[] = [];
    const dbPosts: Post[] = await postModel.find();

    dbPosts.forEach((post: Post) => {
      const titleArray: string[] = post.title.toLowerCase().split(" ");
      const searchArray: string[] = search.toLowerCase().split(" ");

      if(titleArray.some((val: string) => searchArray.includes(val))){
        searchResult.push(post);
      }
    });

    searchResult.sort(
      (a: Post, b: Post) => a.createdAt < b.createdAt ? 1 : -1
    );

    return searchResult;
  }
}

export function makePostDBService (){
  return new PostDBService();
}