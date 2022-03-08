import { PostDBService } from "../post.db.service";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createConnection } from "mongoose";
import { PostSchema } from "../../db/post.model";
import { Post } from "../../model/post.interface";

test("Setup a inmemory database and should be an empty array", async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const testConn = createConnection(uri)
  const testModel = testConn.model<Post>("Post", PostSchema)
  const postService = new PostDBService(testModel);
  return await postService.getPosts("").then(async (posts: Post[]) => {
    expect(posts).toEqual([]);
    await mongod.stop();
  })
});

test("Setup a inmemory database and creating a post and getting the post with the same id", async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const testConn = createConnection(uri)
  const testModel = testConn.model<Post>("Post", PostSchema)
  const postService = new PostDBService(testModel);
    return await postService.createPost("postTitle", "postDescription", "postURL", 0).then( async (res : Post) => {
    const post : Post = await postService.getPost(res.id);
    expect(res.id).toEqual(post.id);
    expect(res.createdAt).toEqual(post.createdAt);
    await mongod.stop();
  })
});

test("Setup a inmemory database and creating a post and getting the post with the same id", async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const testConn = createConnection(uri)
  const testModel = testConn.model<Post>("Post", PostSchema)
  const postService = new PostDBService(testModel);
  return postService.createPost("testpostTitle", "postDescription", "postURL", 0).then( async (post : Post) => {
    await postService.updatePost( post.id, "newPostTitle", "newPostDescription" , 0).then(async (res : boolean) => {
      expect(res).toBe(true);
      const updatedPost : Post = await postService.getPost(post.id);
      expect(updatedPost.id).toEqual(post.id);
      expect(updatedPost.title).toEqual("newPostTitle");
      expect(updatedPost.description).toEqual("newPostDescription");
      await mongod.stop();
    })
  })
});

test("Setup a inmemory database and creating a post and updating the post with new values", async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const testConn = createConnection(uri)
  const testModel = testConn.model<Post>("Post", PostSchema)
  const postService = new PostDBService(testModel);
  return postService.createPost("testpostTitle", "postDescription", "postURL", 0).then( async (post : Post) => {
    await postService.updatePost( post.id, "newPostTitle", "newPostDescription" , 0).then(async (res : boolean) => {
      expect(res).toBe(true);
      const updatedPost : Post = await postService.getPost(post.id);
      expect(updatedPost.id).toEqual(post.id);
      expect(updatedPost.title).toEqual("newPostTitle");
      expect(updatedPost.description).toEqual("newPostDescription");
      await mongod.stop();
    })
  })
});

test("Setup a inmemory database and creating a post and try to update with invalid id and creator", async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const testConn = createConnection(uri)
  const testModel = testConn.model<Post>("Post", PostSchema)
  const postService = new PostDBService(testModel);
  return await postService.createPost("postTitle", "postDescription", "postURL", 0).then( async (post : Post) => {
    expect(postService.updatePost( post.id, "newPostTitle", "postDescription" , 1)).rejects.toThrowError(new Error("Specified user is not creator"));
    expect(postService.updatePost(3, "newTitle", "newDescription", 0)).rejects.toThrowError(new Error("Post not found"))
  })
});

test("Setup a inmemory database and creating a post and try to update with invalid id and creator", async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const testConn = createConnection(uri)
  const testModel = testConn.model<Post>("Post", PostSchema)
  const postService = new PostDBService(testModel);
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