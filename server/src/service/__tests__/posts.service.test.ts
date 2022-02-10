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

// Should succeed
test("The should be an empty array", async () => {
  const postService = new PostService({});
  return await postService.getPosts("").then(async (posts : Post []) => {
    expect(posts).toEqual([]);
  })
});

//Should succeed
test("Create a post in with different properties", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", creator).then( async (res : boolean) => {
    const posts : Post [] = await postService.getPosts("");

    expect(posts.length).toBe(1);
    expect(posts[0].id).toBe(1);
    expect(posts[0].title).toBe("postTitle");
    expect(posts[0].description).toBe("postDescription");
    expect(posts[0].imageUrl).toBe("postURL");
    expect(posts[0].creator).toBe(creator);
    expect(res).toBe(true);
  })
});

// Should not succeed
test("Create a post with a empty title", async () => {
  const postService = new PostService({});
  return await postService.createPost("", "postDescription", "postURL", creator).then( async (res : boolean) => {
    expect(res).toBe(false);
  })
});

// Should succeed
test("Create a post and update the post with new properties", async () => {
  const postService = new PostService({});
  return postService.createPost("testpostTitle", "postDescription", "postURL", creator).then( async (_ : boolean) => {
    await postService.updatePost( 1, "newPostTitle", "postDescription" , creator).then(async (res : boolean) => {
      const posts : Post [] = await postService.getPosts("");
      expect(posts.length).toBe(1);
      expect(posts[0].id).toBe(1);
      expect(posts[0].title).toBe("newPostTitle");
      expect(posts[0].description).toBe("postDescription");
      expect(posts[0].imageUrl).toBe("postURL");
      expect(posts[0].creator).toBe(creator);
      expect(res).toBe(true);
    })
  })
});

// Should not succeed
test("Create update a post with new properties and update the post with another user", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", creator).then( async (_ : boolean) => {
    await postService.updatePost( 1, "newPostTitle", "postDescription" , notCreator).then(async (res : boolean) => {
      expect(res).toBe(false);
    })
  })
});

// Should succeed
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