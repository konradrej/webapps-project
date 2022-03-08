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

