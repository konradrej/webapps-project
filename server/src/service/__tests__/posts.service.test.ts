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

test("Create a post with new properties, update the post with another user and update a post that does not exist", async () => {
  const postService = new PostService({});
  return await postService.createPost("postTitle", "postDescription", "postURL", 0).then( async (post : Post) => {
    expect(postService.updatePost( post.id, "newPostTitle", "postDescription" , 1)).rejects.toThrowError(new Error("Specified user is not creator"));
    expect(postService.updatePost(3, "newTitle", "newDescription", 0)).rejects.toThrowError(new Error("Post not found"))
  })
});

test("Create four posts with different titles in different point in time and check the sorting", async () => {
  const postService = new PostService({});

  await postService.createPost("dPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("cPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("aPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("bPostTitle", "postDescription", "postURL", 0);

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
  await postService.createPost("dPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("cPostTitle", "postDescription", "postURL", 1);
  await postService.createPost("aPostTitle", "postDescription", "postURL", 1);
  await postService.createPost("bPostTitle", "postDescription", "postURL", 2);

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

test("Try to delete with not the creator, a post that does not exist and successfully delete a post with the creator", async () => {
  const postService = new PostService({});
  postService.createPost("dPostTitle", "postDescription", "postURL", 0);
  postService.createPost("cPostTitle", "postDescription", "postURL", 1);
  return await expect(postService.deletePost(1, 2)).rejects.toThrowError(new Error("Specified user is not creator")).then (() => {
    expect(postService.deletePost(5, 2)).rejects.toThrowError(new Error("Post not found")).then(async () => {
      await postService.deletePost(1, 0).then(async (res) => {
        expect(res).toBe(true);
        await postService.getPosts("").then((res) => {
          expect(res.length).toBe(1);
          expect(res[0].title).toBe("cPostTitle");
        })
      })
    })
  })
});

test("Expect searchPosts to return only matching posts sorted by recent order", () => {
  const posts: {[id: number] : Post} = {
    4: {
        "id": 4,
        "title": "Test title 2",
        "description": "Description",
        "imageUrl": "URL",
        "createdAt": new Date("2022-02-22T10:51:18.979Z"),
        "updatedAt": new Date("2022-02-22T10:51:18.979Z"),
        "creator": 0
    },
    3: {
        "id": 3,
        "title": "Test title 1",
        "description": "Description",
        "imageUrl": "URL",
        "createdAt": new Date("2022-02-22T10:51:13.530Z"),
        "updatedAt": new Date("2022-02-22T10:51:13.530Z"),
        "creator": 0
    },
    2: {
        "id": 2,
        "title": "Title 2",
        "description": "Description",
        "imageUrl": "URL",
        "createdAt": new Date("2022-02-22T10:51:08.373Z"),
        "updatedAt": new Date("2022-02-22T10:51:08.373Z"),
        "creator": 0
    },
    1: {
        "id": 1,
        "title": "Title 1",
        "description": "Description",
        "imageUrl": "URL",
        "createdAt": new Date("2022-02-22T10:51:03.680Z"),
        "updatedAt": new Date("2022-02-22T10:51:03.680Z"),
        "creator": 0
    }
  };
  const postService: PostService = new PostService(posts);

  postService.searchPosts("Title").then((results) => {
    expect(results.length).toBe(4);
    expect(results[0]).toBe(posts[4]);
    expect(results[1]).toBe(posts[3]);
    expect(results[2]).toBe(posts[2]);
    expect(results[3]).toBe(posts[1]);
  });

  postService.searchPosts("test").then((results) => {
    expect(results.length).toBe(2);
    expect(results[0]).toBe(posts[4]);
    expect(results[1]).toBe(posts[3]);
  });

  postService.searchPosts("1").then((results) => {
    expect(results.length).toBe(2);
    expect(results[0]).toBe(posts[3]);
    expect(results[1]).toBe(posts[1]);
  });

  postService.searchPosts("Test 2").then((results) => {
    expect(results.length).toBe(3);
    expect(results[0]).toBe(posts[4]);
    expect(results[1]).toBe(posts[3]);
    expect(results[2]).toBe(posts[2]);
  });
});