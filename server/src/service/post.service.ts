import { Post } from "../model/post.interface";

export class PostService {
  // post list
  private const posts : { [key : number] : Post } = {};
  // add userservice
  // inject dependency?


  // createPost
  // post.creator = user
  // users.addPost(post)

  // deletePost

  // updateTitle
  const updateTitle = async (id : number, title : string) : Promise<boolean> => {
    const post : Post = posts[id];

    if(! post) return false;

    post.title = title;
    posts[id] = post;

    return true;
  }

  // updateDescription
  const updateDescription = async (id : number, description : string) : Promise<boolean> => {
    const post : Post = posts[id];

    if(! post) return false;

    post.description = description;
    posts[id] = post;

    return true;
  }

  // getPosts(post order)
}