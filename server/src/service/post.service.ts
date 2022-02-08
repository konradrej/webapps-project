import { Post } from "../model/post.interface";
import { User } from "../model/user.interface";

export interface IPostService  {
  getPosts(order : string) : Promise<Array<Post>>
  createPost(title : string, description : string, imageUrl : string, creator : User ) : Promise<boolean>
  updatePost(id : number, newTitle : string, newDescription : string, verifyCreator : User) : Promise<boolean>
  /*deletePost(id : number, verifyCreator : User) : Promise<boolean>*/
}

export class PostService implements IPostService{
  private posts : { [key : number] : Post };
  private postIdCounter : number = 0;

  constructor(posts : { [key : number] : Post }){
    this.posts = posts;
    // Order posts and get the highest id first and begin with that id as a counter
    this.postIdCounter = !posts ? Object.values(this.posts).sort((a, b) => a.id < b.id ? 1 : -1)[0].id : 0;

  }

  // Return all posts given order
  getPosts : (order : string) => Promise<Post[]> =
    async (order : string) => {
      switch(order){
        // A-Z
        case "Alphabetic": {
          return Object.values(this.posts).sort(
            (a, b) => a.title < b.title ? -1 : 1 
          )
        }
        // Z-A
        case "Reverse": {
          return Object.values(this.posts).sort(
            (a, b) => a.title < b.title ? 1 : -1 
          )
        }
        // Recency
        default: {
          return Object.values(this.posts).sort(
            (a, b) => a.createdAt < b.createdAt ? 1 : -1
          );
        }
      }
    }

  // Returns true if new post is created, invalid if title, imageURL, creator is undefined/null
  createPost : (title: string, description: string, imageUrl: string, creator: User) => Promise<boolean>  = 
    async (title: string, description: string, imageUrl: string, creator: User) => {
      if(imageUrl && title && creator){
        this.postIdCounter++;
        const newPost : Post = {
          id: this.postIdCounter,
          title: title,
          description: description,
          imageUrl: imageUrl,
          createdAt: new Date(),
          modifiedAt: new Date(),
          creator: creator
        }

        this.posts[this.postIdCounter] = newPost;
        //Add Post in user?
        return true;
      }
      else{
        return false;
      }
    }
  
  // Returns true if post is updated given id and user
  updatePost : (id: number, newTitle: string, newDescription: string, verifyCreator: User) => Promise<boolean> = 
    async (id: number, newTitle: string, newDescription: string, verifyCreator: User) => {
      if(this.posts[id].id === id && this.posts[id].creator === verifyCreator ){
        if(newDescription){
          this.posts[id].description = newDescription;
        }
        if(newTitle){
          this.posts[id].title = newTitle;
        }
        this.posts[id].modifiedAt = new Date();
        return true;
      }
      else{
        return false
      }
    }

  /* Returns true if post is deleted given id and user
  deletePost : (id: number, verifyCreator: User) => Promise<boolean> = 
    async (id: number, verifyCreator: User) =>{
      if(this.posts[id].id === id && this.posts[id].creator === verifyCreator ){
        delete this.posts[id];
        return true;
      }
      else{
        return false;
      }
    }
    */
}

// Returns empty Postservice
export function makePostService() : PostService{
  return new PostService({});
}