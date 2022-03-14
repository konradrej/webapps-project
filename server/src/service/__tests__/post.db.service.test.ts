import { PostDBService } from "../post.db.service";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createConnection, Connection, Model } from "mongoose";
import { PostSchema } from "../../db/post.model";
import { Post } from "../../model/post.interface";
import { UserSchema } from "../../db/user.model";
import { User } from "../../model/user.interface";

let mongod : MongoMemoryServer,
  uri: string,
  testConn: Connection,
  testModel: Model<Post , {}, {}, {}>,
  testUserModel: Model<User , {}, {}, {}>,
  postService: PostDBService;

beforeEach(async () => {
  mongod = await MongoMemoryServer.create();
  uri = mongod.getUri();
  testConn = createConnection(uri)
  testModel = testConn.model<Post>("Post", PostSchema)
  testUserModel = testConn.model<User>("User", UserSchema)
  postService = new PostDBService(testModel);
});
  

test("Setup a inmemory database and should be an empty array", async () => {
  return await postService.getPosts("").then(async (posts: Post[]) => {
    expect(posts).toEqual([]);
    await mongod.stop();
  })
});

test("Setup a inmemory database and creating a post and getting the post with the same id", async () => {
  return await postService.createPost("postTitle", "postDescription", "postURL", 0).then(async (res: Post) => {
    const post: Post = await postService.getPost(res.id);
    expect(res.id).toEqual(post.id);
    expect(res.createdAt).toEqual(post.createdAt);
    await mongod.stop();
  })
});

test("Setup a inmemory database and creating a post and getting the post with the same id", async () => {
  return postService.createPost("testpostTitle", "postDescription", "postURL", 0).then(async (post: Post) => {
    await postService.updatePost(post.id, "newPostTitle", "newPostDescription", 0).then(async (res: boolean) => {
      expect(res).toBe(true);
      const updatedPost: Post = await postService.getPost(post.id);
      expect(updatedPost.id).toEqual(post.id);
      expect(updatedPost.title).toEqual("newPostTitle");
      expect(updatedPost.description).toEqual("newPostDescription");
      await mongod.stop();
    })
  })
});

test("Setup a inmemory database and creating a post and updating the post with new values", async () => {
  return postService.createPost("testpostTitle", "postDescription", "postURL", 0).then(async (post: Post) => {
    await postService.updatePost(post.id, "newPostTitle", "newPostDescription", 0).then(async (res: boolean) => {
      expect(res).toBe(true);
      const updatedPost: Post = await postService.getPost(post.id);
      expect(updatedPost.id).toEqual(post.id);
      expect(updatedPost.title).toEqual("newPostTitle");
      expect(updatedPost.description).toEqual("newPostDescription");
      await mongod.stop();
    })
  })
});

test("Create four posts with different titles in different point in time and check the sorting", async () => {
  await postService.createPost("dPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("cPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("aPostTitle", "postDescription", "postURL", 0);
  await postService.createPost("bPostTitle", "postDescription", "postURL", 0);

  return await postService.getPosts("title-ascending").then(async (alphabetic: Post[]) => {
    expect(alphabetic[0].title).toBe("aPostTitle");
    expect(alphabetic[1].title).toBe("bPostTitle");
    expect(alphabetic[2].title).toBe("cPostTitle");
    expect(alphabetic[3].title).toBe("dPostTitle");

    await postService.getPosts("title-descending").then(async (reverse: Post[]) => {
      expect(reverse[0].title).toBe("dPostTitle");
      expect(reverse[1].title).toBe("cPostTitle");
      expect(reverse[2].title).toBe("bPostTitle");
      expect(reverse[3].title).toBe("aPostTitle");

      await postService.getPosts("recent-descending").then(async (recency: Post[]) => {
        /*Should be the reverse order as they were created b>a>c>d*/
        expect(recency[0].title).toBe("bPostTitle");
        expect(recency[1].title).toBe("aPostTitle");
        expect(recency[2].title).toBe("cPostTitle");
        expect(recency[3].title).toBe("dPostTitle");
      })
    })
  })
});

test("No posts of the given userId", async () => {
  return await postService.getUsersPosts(1).then((posts) => {
    expect(posts.length).toBe(0);
  })
});

test("Expect searchPosts to return only matching posts sorted by recent order", async () => {
  const posts: { [id: number]: Post } = {
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

  await postService.createPost("Title 1", "postDescription", "postURL", 0);
  await postService.createPost("Title 2", "postDescription", "postURL", 0);
  await postService.createPost("Test title 1", "postDescription", "postURL", 0);
  await postService.createPost("Test title 2", "postDescription", "postURL", 0);

  await postService.searchPosts("Title").then((results) => {
    expect(results.length).toBe(4);
    expect(results[0].title).toBe(posts[4].title);
    expect(results[1].title).toBe(posts[3].title);
    expect(results[2].title).toBe(posts[2].title);
    expect(results[3].title).toBe(posts[1].title);
  });

  await postService.searchPosts("test").then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].title).toBe(posts[4].title);
    expect(results[1].title).toBe(posts[3].title);
  });

  await postService.searchPosts("1").then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].title).toBe(posts[3].title);
    expect(results[1].title).toBe(posts[1].title);
  });

  await postService.searchPosts("Test 2").then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].title).toBe(posts[4].title);
    expect(results[1].title).toBe(posts[3].title);
    expect(results[2].title).toBe(posts[2].title);
  });
});


