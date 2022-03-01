import Express from "express";
import SuperTest from "supertest";

import { makePostRouter } from "../post.router";
import { IPostService, } from "../../service/post.service";
import { Post } from "../../model/post.interface";

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

test("A POST request to /createPost should send a response of post successfully created", () => {
  const postService: IPostService = makeMockPostService()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.post("/createPost").send({ title: "titleTest", description: "desscriptionTest", imageUrl: "imageTest", creator: 0 }).then((res) => {
    expect(res.statusCode).toBe(201)
  })
})

test("A POST request to /createPost should fail when using MockPostServiceFails", () => {
  const postService: IPostService = makeMockPostServiceFails()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.post("/createPost").send({ title: "Title", description: "Description", imageUrl: "imageTest", creator: 0 }).then((res) => {
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({status: "Could not create post", reason: "MockPostServiceFails"})
  })
})

test("A GET request to / should get all posts and sorted by the query", () => {
  const postService: IPostService = makeMockPostService()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.get("/").query("").then((res) => {
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([])
  })
})

test("A GET request to /1 should successfully get a (empty)post", () => {
  const postService: IPostService = makeMockPostService()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.get("/1").send({ id: 1 }).then((res) => {
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({})
  })
})

test("A GET request to /1 should give status code 400 when using makeMockPostServiceFails", () => {
  const postService: IPostService = makeMockPostServiceFails()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.get("/1").send({ id: 1 }).then((res) => {
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({status: "Post not found", reason: "MockPostServiceFails"})
  })
})

test("A PUT request to /updatePost/1 should give status code 200 ", () => {
  const postService: IPostService = makeMockPostService()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.put("/updatePost/1").send({ id: 1, newTitle:"newTitle", newDescription:"newDescription", verifyCreator: 5 }).then((res) => {
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({status: "Post updated"})
  })
})

test("A PUT request to /updatePost/1 should give status code 400 when using makeMockPostServiceFails", () => {
  const postService: IPostService = makeMockPostServiceFails()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.put("/updatePost/1").send({ id: 1, newTitle:"newTitle", newDescription:"newDescription", verifyCreator: 5 }).then((res) => {
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({status: "Could not update post", reason: "MockPostServiceFails"})
  })
})

test("A DELETE request to /deletePost/1 should give status code 400 when using makeMockPostServiceFails", () => {
  const postService: IPostService = makeMockPostServiceFails()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.delete("/deletePost/1").send({ id: 1, verifyCreator: 1 }).then((res) => {
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({status: "Could not delete post", reason: "MockPostServiceFails"})
  })
})

test("A DELETE request to /deletePost/1 should give status code 200", () => {
  const postService: IPostService = makeMockPostService()
  const router: Express.Express = Express();
  router.use(Express.json());
  router.use(makePostRouter(postService));
  let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.delete("/deletePost/1").send({ id: 1, verifyCreator: 1 }).then((res) => {
    expect(res.statusCode).toBe(200)
  })
})

test("A GET request to /search without search query parameter should return an error", () => {
    const postService: MockPostService = makeMockPostServiceFails();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.get("/search").query("").then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({status: "Error searching for posts", reason: "Missing search query"})
    })
})

test("A GET request to /search with a falsy (empty/no value) search query parameter should return an error", () => {
    const postService: MockPostService = makeMockPostServiceFails();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.get("/search").query({"search": ""}).then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({status: "Error searching for posts", reason: "Missing search query"})
    })
})

test("A GET request to /search with search parameter (non falsy value) should return response code 200", () => {
    const postService: MockPostService = makeMockPostService();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.get("/search").query({"search": "test"}).then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    })
})

