
export class PostController {
  static validateCreatePost = async (title: string, imageUrl: string, creator: number): Promise<void> => {
    if (!title) {
      throw new Error("Missing title");
    }
    if (!creator && creator !== 0) {
      throw new Error("Missing creator");
    }

    if (!imageUrl) {
      throw new Error("Missing image");
    } else {
      try {
        new URL(imageUrl);
      } catch (err) {
        throw Error("Bad URL");
      }
    }
  }

  static validateUpdatePost = async (creator: number): Promise<void> => {
    if (!creator && creator !== 0) {
      throw new Error("Missing creator");
    }
  }

  static validateGetUserPosts = async (userId: number): Promise<void> => {
    if (!userId && userId !== 0) {
      throw new Error("Missing creator");
    }
  }

  static validateDeletePost = async (postId: number, creator: number): Promise<void> => {
    if (!creator && creator !== 0) {
      throw new Error("Missing creator");
    }
    if (!postId) {
      throw new Error("Missing post id")
    }
  }

  static validateSearchPosts = async (search: string): Promise<void> => {
    if (!search) {
      throw new Error("Missing search query");
    }
  }
}