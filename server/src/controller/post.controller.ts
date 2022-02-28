export class PostController{
  static validateCreatePost = async (title: string, imageUrl: string, creator: number) : Promise<void> => {
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

<<<<<<< HEAD
  validateUpdatePost = async (creator: number | null) : Promise<void> => {
=======
  static validateUpdatePost = async (creator: number) : Promise<void> => {
>>>>>>> fbc18503b2bf7153ce2a5ab5f7e3426e850cbbcc
    if(!creator && creator !== 0){
      throw new Error("Missing creator");
    }
  }

  static validateGetUserPosts = async (userId: number) : Promise<void> => {
    if(!userId && userId !== 0){
      throw new Error("Missing creator");
    }
  }

  static validateDeletePost = async (postId: number, creator: number): Promise<void> => {
    if(!creator && creator !== 0){
      throw new Error("Missing creator"); 
    }
    if(!postId){
      throw new Error("Missing post id")
    }
  }

  static validateSearchPosts = async (search: string): Promise<void> => {
    if(!search){
      throw new Error("Missing search query");
    }
  }
}