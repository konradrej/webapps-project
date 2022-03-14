/**
 * Service to handle post related features such as creating,
 * updating, deleting posts and different ways to retrieve
 * posts. Works with mongoose and database.
 */

import { IPostService } from "./post.service";
import { postModel } from "../db/post.model";
import { Post } from "../model/post.interface";
import { Model } from "mongoose";
import { userModel } from "../db/user.model";
import { User } from "../model/user.interface";

export class PostDBService implements IPostService {
  private model;

  constructor(model: Model<Post, {}, {}>) {
    this.model = model;
  }

  async getPosts(order: string): Promise<Post[]> {
    switch (order) {
      // Title A-Z
      case "title-ascending": {
        return Object.values(
          await this.model.find().sort({
            title: "ascending"
          }).populate("creator"))
      }
      // Title Z-A
      case "title-descending": {
        return Object.values(
          await this.model.find().sort({
            title: "descending"
          }).populate("creator"))
      }
      // Most recent first
      case "recent-descending":
      default: {
        return Object.values(
          await this.model.find().sort({
            createdAt: "descending"
          }).populate("creator"))
      }
    }
  }

  async createPost(title: string, description: string, imageUrl: string, creator: number): Promise<Post> {
    const userCreator: User | null = await userModel.findOne({ id: creator })
    return await this.model.create({
      id: new Date().valueOf(), //Change this?
      title: title,
      description: description,
      imageUrl: imageUrl,
      creator: userCreator
    })
  }

  async updatePost(id: number, newTitle: string | null, newDescription: string | null, verifyCreator: number | null): Promise<boolean> {
    const userCreator: User | null = await userModel.findOne({ id: verifyCreator })
    if (!(await this.model.exists({ id: id }))) {
      throw Error("Post not found");
    }
    if (!(await this.model.exists({ id: id, creator: userCreator }))) {
      throw Error("Specified user is not creator");
    }
    if (newDescription) {
      await this.model.updateOne({ id: id }, { description: newDescription });
    }
    if (newTitle) {
      await this.model.updateOne({ id: id }, { title: newTitle });
    }

    return true;
  }
  async getPost(id: number): Promise<Post> {
    const post: Post | null = await this.model.findOne({ id: id })
    if (!post) {
      throw Error("Post not found");
    }
    return post;
  }

  //Wont be needing this one?
  async findById(id: number): Promise<Post | null> {
    throw new Error("Method not implemented.");
  }

  async getUsersPosts(userId: number): Promise<Post[]> {
    const user: User | null = await userModel.findOne({ id: userId })
    return await this.model.find({ creator: user }).populate("creator")
      .sort({ createdAt: "descending" });
  }

  async deletePost(id: number, verifyCreator: number): Promise<boolean> {
    const userCreator: User | null = await userModel.findOne({ id: verifyCreator })
    if (!(await this.model.exists({ id: id }))) {
      throw Error("Post not found");
    }
    if (!(await this.model.exists({ id: id, creator: userCreator }))) {
      throw Error("Specified user is not creator");
    }
    await this.model.deleteOne({ id: id })
    return true;
  }

  async searchPosts(search: string): Promise<Post[]> {
    const searchResult: Post[] = [];
    const dbPosts: Post[] = await this.model.find().populate("creator");

    dbPosts.forEach((post: Post) => {
      const titleArray: string[] = post.title.toLowerCase().split(" ");
      const searchArray: string[] = search.toLowerCase().split(" ");

      if (titleArray.some((val: string) => searchArray.includes(val))) {
        searchResult.push(post);
      }
    });

    searchResult.sort(
      (a: Post, b: Post) => a.createdAt < b.createdAt ? 1 : -1
    );

    return searchResult;
  }
}

export function makePostDBService() {
  return new PostDBService(postModel);
}