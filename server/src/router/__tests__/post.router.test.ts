import Express from "express";
import SuperTest from "supertest";
import session from "express-session";
import { User } from "../../model/user.interface";
import { makePostRouter } from "../post.router";
import { IPostService, } from "../../service/post.service";
import { Post } from "../../model/post.interface";

const mockUser: User = {
  id: 1,
  username: "test",
  password: "test",
  email: "test@test.com",
  profileImageUrl: "test",
  description: "",
  createdAt: new Date,
  updatedAt: new Date,
}

class MockPostService implements IPostService {
  constructor() {

  }
  deletePost = async (id: number, verifyCreator: number): Promise<boolean>  => {
    return true;
  }
  getUsersPosts = (UserId: number): Promise<Post[]> => {
    throw new Error("Method not implemented.");
  }
  createPost = async (title: string, description: string, imageUrl: string, creator: number): Promise<Post> => {
    return <Post>{};
  }

  getPosts = async (order: string): Promise<Array<Post>> => {
    return Array<Post>()
  }

  updatePost = async (id: number, newTitle: string, newDescription: string, verifyCreator: number): Promise<boolean> => {
    return true;
  }

  getPost = async (id: number): Promise<Post> => {
    return <Post>{};
  }

  findById = async (id: number): Promise<Post | null> => {
    throw new Error("Wrong method called");
  }

  searchPosts = async (search: string): Promise<Post[]> => {
    return Array<Post>();
  }
}

class MockPostServiceFails implements IPostService {
  deletePost(id: number, verifyCreator: number): Promise<boolean> {
    throw new Error("MockPostServiceFails");
  }
  getUsersPosts(UserId: number): Promise<Post[]> {
    throw new Error("MockPostServiceFails");
  }
  createPost = async (title: string, description: string, imageUrl: string, creator: number): Promise<Post> => {
    throw new Error("MockPostServiceFails");
  }

  getPosts = async (order: string): Promise<Array<Post>> => {
    throw new Error("MockPostServiceFails");
  }

  updatePost = async (id: number, newTitle: string, newDescription: string, verifyCreator: number): Promise<boolean> => {
    throw new Error("MockPostServiceFails");
  }

  getPost = async (id: number): Promise<Post> => {
    throw new Error("MockPostServiceFails");
  }

  findById = async (id: number): Promise<Post | null> => {
    throw new Error("MockPostServiceFails");
  }
  
  searchPosts = async (search: string): Promise<Post[]> => {
    throw new Error("MockPostServiceFails");
}
}

function makeMockPostService(): MockPostService {
  return new MockPostService();
}

function makeMockPostServiceFails(): MockPostServiceFails {
  return new MockPostServiceFails();
}

let router: Express.Express,
    hasSession: boolean,
    /** Set whether session should be mocked or not */
    setSession = function (bool: boolean) {
      hasSession = bool;
    };

beforeEach(() => {
  router = Express();
  router.use(Express.json());
  router.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
  }));

  router.use((req, res, next) => {
    req.session.currentUserId = hasSession ? 1 : null;
    next();
  })
});

test("A POST request to / should send a response of post successfully created", async () => {
  setSession(true);
  const postService: IPostService = makeMockPostService()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.post("/").send({ title: "titleTest", description: "desscriptionTest", imageUrl: "https://valid.image.url" }).then((res) => {
    expect(res.statusCode).toBe(201)
  })
})

test("A POST request to / should fail when using MockPostServiceFails", async () => {
  setSession(true);
  const postService: IPostService = makeMockPostServiceFails()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.post("/").send({ title: "Title", description: "Description", imageUrl: "https://valid.image.url" }).then((res) => {
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({status: "Could not create post", reason: "MockPostServiceFails"})
  })
})

test("A GET request to / should get all posts and sorted by the query", async () => {
  const postService: IPostService = makeMockPostService()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.get("/").query("").then((res) => {
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([])
  })
})

test("A GET request to /1 should successfully get a (empty)post", async () => {
  const postService: IPostService = makeMockPostService()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  const res = await request.get("/1").send({ id: 1 });
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({});
})

test("A GET request to /1 should give status code 400 when using makeMockPostServiceFails", async () => {
  const postService: IPostService = makeMockPostServiceFails()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  const res = await request.get("/1").send({ id: 1 });
  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({ status: "Post not found", reason: "MockPostServiceFails" });
})

test("A PUT request to /1 should give status code 200 ", async () => {
  setSession(true);
  const postService: IPostService = makeMockPostService()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  const res = await request.put("/1").send({ id: 1, newTitle: "newTitle", newDescription: "newDescription" });
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ status: "Post updated" });
})

test("A PUT request to /1 should give status code 400 when using makeMockPostServiceFails", async () => {
  setSession(true);
  const postService: IPostService = makeMockPostServiceFails()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  const res = await request.put("/1").send({ id: 1, newTitle: "newTitle", newDescription: "newDescription" });
  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({ status: "Could not update post", reason: "MockPostServiceFails" });
})

test("A DELETE request to /1 should give status code 400 when using makeMockPostServiceFails", async () => {
  setSession(true);
  const postService: IPostService = makeMockPostServiceFails()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  const res = await request.delete("/1").send({ id: 1, verifyCreator: 1 });
  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({ status: "Could not delete post", reason: "MockPostServiceFails" });
})

test("A DELETE request to /1 should give status code 200", async () => {
  setSession(true);
  const postService: IPostService = makeMockPostService()
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  const res = await request.delete("/1").send({ id: 1, verifyCreator: 1 });
  expect(res.statusCode).toBe(200);
})

test("A GET request to /search without search query parameter should return an error", async () => {
    const postService: MockPostService = makeMockPostServiceFails();
    router.use(makePostRouter(postService));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    const res = await request.get("/search").query("");
  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({ status: "Error searching for posts", reason: "Missing search query" });
})

test("A GET request to /search with a falsy (empty/no value) search query parameter should return an error", async () => {
    const postService: MockPostService = makeMockPostServiceFails();
    router.use(makePostRouter(postService));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    const res = await request.get("/search").query({ "search": "" });
  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual({ status: "Error searching for posts", reason: "Missing search query" });
})

test("A GET request to /search with search parameter (non falsy value) should return response code 200", async () => {
    const postService: MockPostService = makeMockPostService();
    router.use(makePostRouter(postService));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    const res = await request.get("/search").query({ "search": "test" });
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
})

