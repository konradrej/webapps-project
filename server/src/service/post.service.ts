import { Post } from "../model/post.interface";
import {Lifecycle, registry} from "tsyringe";

export interface IPostService {
  getPosts(order: string): Promise<Array<Post>>
  createPost(title: string, description: string, imageUrl: string, creator: number): Promise<Post>
  updatePost(id: number, newTitle: string | null, newDescription: string | null, verifyCreator: number | null): Promise<boolean>
  getPost: (id: number) => Promise<Post>
  findById(id: number): Promise<Post | null>
  getUsersPosts(UserId: number): Promise<Array<Post>>
  deletePost(id : number, verifyCreator : number) : Promise<boolean>
  searchPosts (search: string): Promise<Post[]>
}

@registry([{
  token: "PostService",
  useClass: PostService,
  options: {lifecycle: Lifecycle.Singleton} // Tsyringe has problem with default parameter, registering singleton without injectable
}])
export class PostService implements IPostService {
  private posts: { [key: number]: Post };
  private postIdCounter: number = 0;

  constructor(posts: { [key: number]: Post } = {}) {
    this.posts = posts;
    // Order posts and get the highest id first and begin with that id as a counter
    this.postIdCounter = !posts ? Object.values(this.posts).sort((a, b) => a.id < b.id ? 1 : -1)[0].id : 0;
  }

  async findById(id: number): Promise<Post | null> {
    return this.posts[id] ?? null;
  }
  // Return all posts given order
  async getPosts(order: string) : Promise<Post[]> {
    switch (order) {
      // Title A-Z
      case "title-ascending": {
        return Object.values(this.posts).sort(
          (a, b) => a.title < b.title ? -1 : 1
        )
      }
      // Title Z-A
      case "title-descending": {
        return Object.values(this.posts).sort(
          (a, b) => a.title < b.title ? 1 : -1
        )
      }
      // Most recent first
      case "recent-descending":
      default: {
        return Object.values(this.posts).sort(
          (a, b) => a.createdAt < b.createdAt ? 1 : -1
        );
      }
    }
  }

  // Returns true if new post is created, invalid if title, imageURL, creator is undefined/null
  async createPost (title: string, description: string, imageUrl: string, creator: number): Promise<Post> {
    this.postIdCounter++;
    const newPost: Post = {
      id: this.postIdCounter,
      title: title,
      description: description,
      imageUrl: imageUrl,
      createdAt: new Date(),
      modifiedAt: new Date(),
      creator: creator
    }

    this.posts[this.postIdCounter] = newPost;
    return this.posts[this.postIdCounter];
  }

  // Returns true if post is updated given id and user id
  async updatePost (id: number, newTitle: string | null, newDescription: string | null, verifyCreator: number | null): Promise<boolean>{
    const post: Post | null = await this.findById(id);
    if (!post){
      throw Error("Post not found");
    }
    if(this.posts[id].creator !== verifyCreator){
      throw Error("Specified user is not creator");
    }
    if (newDescription) {
      this.posts[id].description = newDescription;
    }
    if (newTitle) {
      this.posts[id].title = newTitle;
    }
    this.posts[id].modifiedAt = new Date();
    return true;
  }

  // Get post given post id
  async getPost (id: number): Promise<Post>{
    if (await this.findById(id)) {
      return this.posts[id];
    }
    throw Error("Post not found");
  }

  // Get all post of the given UserId
  async getUsersPosts (userId: number): Promise<Post[]>{
    const allPosts = Object.values(this.posts);
    return allPosts.filter((post) => post.creator == userId)
  }
  
  // Returns true if post is deleted given id and user id
  async deletePost (id: number, verifyCreator: number): Promise<boolean>{
    const post: Post | null = await this.findById(id);
    if(!post){
      throw Error("Post not found");
    }
    if(this.posts[id].creator !== verifyCreator){
      throw Error("Specified user is not creator");
    }
    delete this.posts[id];
    return true;
  }

  // Returns array with posts matching the search string with most recent being first
  async searchPosts (search: string): Promise<Post[]> {
    const searchResult: Post[] = [];
    
    Object.values(this.posts).forEach((post: Post) => {
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