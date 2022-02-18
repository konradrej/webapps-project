import { Post } from "../model/post.interface";

export interface IPostService {
  getPosts(order: string): Promise<Array<Post>>
  createPost(title: string, description: string, imageUrl: string, creator: number): Promise<Post>
  updatePost(id: number, newTitle: string, newDescription: string, verifyCreator: number): Promise<boolean>
  getPost: (id: number) => Promise<Post>
  findById(id: number): Promise<Post | null>

  /*deletePost(id : number, verifyCreator : User) : Promise<boolean>*/
}

export class PostService implements IPostService {
  private posts: { [key: number]: Post };
  private postIdCounter: number = 0;

  constructor(posts: { [key: number]: Post }) {
    this.posts = posts;
    // Order posts and get the highest id first and begin with that id as a counter
    this.postIdCounter = !posts ? Object.values(this.posts).sort((a, b) => a.id < b.id ? 1 : -1)[0].id : 0;
  }

  async findById(id: number): Promise<Post | null> {
    return this.posts[id] ?? null;
  }
  // Return all posts given order
  getPosts: (order: string) => Promise<Post[]> =
    async (order: string) => {
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
  createPost: (title: string, description: string, imageUrl: string, creator: number) => Promise<Post> =
    async (title: string, description: string, imageUrl: string, creator: number) => {

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
  updatePost: (id: number, newTitle: string, newDescription: string, verifyCreator: number) => Promise<boolean> =
      async (id: number, newTitle: string, newDescription: string, verifyCreator: number) => {

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

  getPost: (id: number) => Promise<Post> =
    async (id: number) => {
      if (await this.findById(id)) {
        return this.posts[id];
      }
      throw Error("Post not found");
    }

  // Returns true if post is deleted given id and user id
  /*deletePost : (id: number, verifyCreator: User) => Promise<boolean> = 
    async (id: number, verifyCreator: User) =>{
      if(this.posts[id].id === id && this.posts[id].creator.id === verifyCreator.id ){
        delete this.posts[id];
        return true;
      }
      else{
        return false;
      }
    }*/
}

// Returns empty Postservice
export function makePostService(): PostService {
  return new PostService({});
}