import { Post } from "../../model/post.interface";
import { PostService } from "../post.service"; 

test("The should be an empty array", async () => {
  const postService = new PostService({});
  return await postService.getPosts("").then(async (posts : Post []) => {
    expect(posts).toEqual([]);
  })
});

test("Create a post in with different properties and then get the same from postservice, and then try to get a post with an invalid id ", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", 0).then( async (res : Post) => {
    const posts : Post [] = await postService.getPosts("");
    expect(res).toEqual(posts[0]);
    await postService.getPost(1).then(async (res: Post) => {
      expect(res).toEqual(posts[0]);
    })
    expect(postService.getPost(0)).rejects.toThrowError(new Error("Post not found"));
  })
});



test("Create a post and update the post with new properties", async () => {
  const postService = new PostService({});
  return postService.createPost("testpostTitle", "postDescription", "postURL", 0).then( async (post : Post) => {
    await postService.updatePost( post.id, "newPostTitle", "postDescription" , 0).then(async (res : boolean) => {
      expect(res).toBe(true);
    })
  })
});

test("Create a post with new properties and update the post with another user", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", 0).then( async (_ : Post) => {
    expect( postService.updatePost( 1, "newPostTitle", "postDescription" , 1)).rejects.toThrowError(new Error("Specified user is not creator"));
  })
});

test("Create four posts with different titles in different point in time and check the sorting", async () => {
  const postService = new PostService({});

  postService.createPost("dPostTitle", "postDescription", "postURL", 0);
  postService.createPost("cPostTitle", "postDescription", "postURL", 0);
  postService.createPost("aPostTitle", "postDescription", "postURL", 0);
  postService.createPost("bPostTitle", "postDescription", "postURL", 0);

  return await postService.getPosts("title-ascending").then(async (alphabetic : Post []) => {
    expect(alphabetic[0].title).toBe("aPostTitle");
    expect(alphabetic[1].title).toBe("bPostTitle");
    expect(alphabetic[2].title).toBe("cPostTitle");
    expect(alphabetic[3].title).toBe("dPostTitle");

    await postService.getPosts("title-descending").then(async (reverse : Post []) => {
      expect(reverse[0].title).toBe("dPostTitle");
      expect(reverse[1].title).toBe("cPostTitle");
      expect(reverse[2].title).toBe("bPostTitle");
      expect(reverse[3].title).toBe("aPostTitle");
      
      // getPosts("") is default
      await postService.getPosts("recent-descending").then(async (recency : Post []) => {
        /*Should be the reverse order as they were created b>a>c>d*/
        expect(recency[0].title).toBe("bPostTitle");
        expect(recency[1].title).toBe("aPostTitle");
        expect(recency[2].title).toBe("cPostTitle");
        expect(recency[3].title).toBe("dPostTitle");
      })
    })
  })
});


test("Create a couple of posts with different creator and get all posts of the given user id", async () => {
  const postService = new PostService({});
  postService.createPost("dPostTitle", "postDescription", "postURL", 0);
  postService.createPost("cPostTitle", "postDescription", "postURL", 1);
  postService.createPost("aPostTitle", "postDescription", "postURL", 1);
  postService.createPost("bPostTitle", "postDescription", "postURL", 2);

  return await postService.getUsersPosts(1).then((posts) => {
    expect(posts.length).toBe(2);
    expect(posts[0].creator && posts[1].creator).toBe(1);
  })
});

test("No posts of the given userId", async () => {
  const postService = new PostService({});

  return await postService.getUsersPosts(1).then((posts) => {
    expect(posts.length).toBe(0);
  })
});