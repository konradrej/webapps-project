import { devNull } from "os";
import { getHeapCodeStatistics } from "v8";
import { Post } from "../../model/post.interface";
import { User } from "../../model/user.interface";
import { PostService } from "../post.service"; 

// Create the creator of the post
const creator : User = 
{
  id: 1,
  username: "creatorName",
  password: "creatorPassword",
  email: "creatorMail",
  profileImageUrl: "creatorProfile",
  description: "creatorDescription",
  posts: [],
  createdAt: new Date(),
};

// Create user
const notCreator : User = 
{
  id: 2,
  username: "notCreatorName",
  password: "notCreatorPassword",
  email: "notCreatorMail",
  profileImageUrl: "notCreatorProfile",
  description: "notCreatorDescription",
  posts: [],
  createdAt: new Date(),
};

test("The should be an empty array", async () => {
  const postService = new PostService({});
  return await postService.getPosts("").then(async (posts : Post []) => {
    expect(posts).toEqual([]);
  })
});

test("Create a post in with different properties and then get the same from postservice, and then try to get a post with an invalid id ", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", creator).then( async (res : Post) => {
    const posts : Post [] = await postService.getPosts("");
    expect(res).toEqual(posts[0]);
    await postService.getPost(1).then(async (res: Post) => {
      expect(res).toEqual(posts[0]);
    })
    expect(postService.getPost(0)).rejects.toThrowError(new Error("Post not found"));
  })
});

test("Create a post with a empty title and empty URL", async () => {
  const postService = new PostService({});
  return await expect(postService.createPost("", "postDescription", "postURL", creator)).rejects.toThrowError(new Error("Missing title")).then(async () =>{
    expect(postService.createPost("postTitle", "postDescription", "", creator)).rejects.toThrowError(new Error("Missing image URL"))
  })
});

test("Create a post and update the post with new properties", async () => {
  const postService = new PostService({});
  return postService.createPost("testpostTitle", "postDescription", "postURL", creator).then( async (_ : Post) => {
    await postService.updatePost( 1, "newPostTitle", "postDescription" , creator).then(async (res : boolean) => {
      expect(res).toBe(true);
    })
  })
});

test("Create update a post with new properties and update the post with another user", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", creator).then( async (_ : Post) => {
    await postService.updatePost( 1, "newPostTitle", "postDescription" , notCreator).then(async (res : boolean) => {
      expect(res).toBe(false);
    })
  })
});

test("Create three posts with different titles in different point in time and check the sorting", async () => {
  const postService = new PostService({});

  postService.createPost("dPostTitle", "postDescription", "postURL", creator);
  postService.createPost("cPostTitle", "postDescription", "postURL", creator);
  postService.createPost("aPostTitle", "postDescription", "postURL", creator);
  postService.createPost("bPostTitle", "postDescription", "postURL", creator);

  return await postService.getPosts("Alphabetic").then(async (alphabetic : Post []) => {
    expect(alphabetic[0].title).toBe("aPostTitle");
    expect(alphabetic[1].title).toBe("bPostTitle");
    expect(alphabetic[2].title).toBe("cPostTitle");
    expect(alphabetic[3].title).toBe("dPostTitle");

    await postService.getPosts("Reverse").then(async (reverse : Post []) => {
      expect(reverse[0].title).toBe("dPostTitle");
      expect(reverse[1].title).toBe("cPostTitle");
      expect(reverse[2].title).toBe("bPostTitle");
      expect(reverse[3].title).toBe("aPostTitle");
      
      // getPosts("") is default
      await postService.getPosts("").then(async (recency : Post []) => {
        /*Should be the reverse order as they were created b>a>c>d*/
        expect(recency[0].title).toBe("bPostTitle");
        expect(recency[1].title).toBe("aPostTitle");
        expect(recency[2].title).toBe("cPostTitle");
        expect(recency[3].title).toBe("dPostTitle");
      })
    })
  })
});