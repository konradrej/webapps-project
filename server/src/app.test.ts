import SuperTest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";

let app: Express.Application,
  mockConnection: Connection,
  server: MongoMemoryServer,
  request: SuperTest.SuperTest<SuperTest.Test>;

async function setupLogin(): Promise<{ userId: number, cookies: [] }> {
  await request.post("/user/sign-up").send({ username: "Test", password: "Test", email: "Test@Test.Test" })
  let loginResponse = await request.post("/user/login").send({ username: "Test", password: "Test" })
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body).toStrictEqual({ status: "Authorized" });
  let cookies = loginResponse.headers["set-cookie"];

  let getSession = await request.get("/user/session")
    .set("Cookie", cookies)
    .send();

  expect(getSession.status).toBe(200)
  expect(getSession.body).toMatchObject({ username: "Test" })

  return {
    userId: getSession.body.id,
    cookies: cookies
  }
}

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  mockConnection = mongoose.createConnection(server.getUri());

  jest.doMock("./db/conn", () => ({
    conn: mockConnection
  }))

  const exprSrv = require("./app");
  app = exprSrv.app;
  request = SuperTest(app);
})

describe("Test Authorization and Authentication", () => {
  test("If we POST sign-up and then login, we should get authorized", async () => {

    await request.post("/user/sign-up")
      .send({ username: "Test", password: "Test", email: "Test@Test.Test" })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual({ status: "User created" });
      })

    return request.post("/user/login")
      .send({ username: "Test", password: "Test" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({ status: "Authorized" });
      })
  })

  test("If we login, we be able to retrieve information about our session", async () => {
    let loginResponse = await request.post("/user/login").send({ username: "Test", password: "Test" })
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toStrictEqual({ status: "Authorized" });

    let getSession = await request.get("/user/session")
      .set("Cookie", loginResponse.headers["set-cookie"])
      .send()

    expect(getSession.status).toBe(200)
    expect(getSession.body).toMatchObject({ username: "Test", email: "Test@Test.Test" })
  })

  test("If we login and then logout, we should have no session.", async () => {
    let loginResponse = await request.post("/user/login").send({ username: "Test", password: "Test" })
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toStrictEqual({ status: "Authorized" });

    await request.post("/user/logout")
      .set("Cookie", loginResponse.headers["set-cookie"])
      .send({})
      .then((res) => {
        expect(res.status).toBe(200);
      })

    return request.get("/user/session")
      .set("Cookie", loginResponse.headers["set-cookie"])
      .send()
      .then((res) => {
        expect(res.status).toBe(403)
      })
  })
})

describe('As a logged in user', () => {
  let loggedInCookie: [];
  let userId: number;

  beforeAll(async () => {
    await mockConnection.db?.dropDatabase(); // Clear everything
    const ret = await setupLogin();
    userId = ret.userId;
    loggedInCookie = ret.cookies;
  })

  test("We should be able to a create a post and retrieve it from our profile", async () => {
    let data = { title: "Testing", description: "Test post", imageUrl: "http://localhost/test.png" };
    let createPost = await request.post("/post/")
      .set("Cookie", loggedInCookie)
      .send(data)

    expect(createPost.status).toBe(201);
    expect(createPost.body).toMatchObject(data)

    let getUserPost = await request.get("/user/" + userId)
      .set("Cookie", loggedInCookie)
      .send()

    expect(getUserPost.status).toBe(200);
    expect(getUserPost.body.posts[0]).toMatchObject({
      title: "Testing",
      description: "Test post",
      imageUrl: "http://localhost/test.png"
    })
  })

  test("We should be able to create a post then update it and then delete it", async () => {
    let createPost = await request.post("/post/")
      .set("Cookie", loggedInCookie)
      .send({ title: "Testing", description: "Test post", imageUrl: "http://localhost/test.png" })

    let updatePost = await request.put("/post/" + createPost.body.id)
      .set("Cookie", loggedInCookie)
      .send({ newTitle: "New Updated", newDescription: "New description" });

    expect(updatePost.status).toBe(200);
    expect(updatePost.body).toEqual({ status: "Post updated" });

    let deletePost = await request.delete("/post/" + createPost.body.id)
      .set("Cookie", loggedInCookie)
      .send();

    expect(deletePost.status).toBe(200);
    expect(deletePost.body).toEqual({ status: "Post deleted" });
  })

  test("We should be able to update our own profile", async () => {
    let newData = {
      description: "newDescription",
      profileImageUrl: "http://localhost/test.png",
      email: "newEmail@localhost"
    };

    let updateProfile = await request.put("/user/update")
      .set("Cookie", loggedInCookie)
      .send(newData);

    expect(updateProfile.status).toBe(200);
    expect(updateProfile.body).toEqual({ status: "User updated" });

    let getNewProfile = await request.get("/user/session")
      .set("Cookie", loggedInCookie)
      .send()

    expect(getNewProfile.status).toBe(200);
    expect(getNewProfile.body).toMatchObject(newData);
  })
});

describe("Test post search and retrieval", () => {
  beforeAll(async () => {
    await mockConnection.db?.dropDatabase(); // Clear everything
    const { cookies } = await setupLogin();
    let names = ["testing1", "testing2", "testing5", "testing4"];
    for (let i = 0; i < 4; i++) {
      let createPost = await request.post("/post/")
        .set("Cookie", cookies)
        .send({
          title: names[i],
          description: "desc_" + i,
          imageUrl: "http://localhost/test_" + i + ".png"
        });
      expect(createPost.status).toBe(201);
    }
  })

  test("Title ascending post retrieval", async () => {
    let titleAsc = await request.get("/post?order=title-ascending").send();
    expect(titleAsc.status).toBe(200);
    expect(titleAsc.body).toMatchObject([
      { title: "testing1" },
      { title: "testing2" },
      { title: "testing4" },
      { title: "testing5" },
    ]);
  })

  test("Title descending post retrieval", async () => {
    let titleDesc = await request.get("/post?order=title-descending").send();
    expect(titleDesc.status).toBe(200);
    expect(titleDesc.body).toMatchObject([
      { title: "testing5" },
      { title: "testing4" },
      { title: "testing2" },
      { title: "testing1" },
    ]);
  })

  test("Recent descending post retrieval", async () => {
    let recentDesc = await request.get("/post?order=recent-descending").send();
    expect(recentDesc.status).toBe(200);
    expect(recentDesc.body).toMatchObject([
      { title: "testing4" },
      { title: "testing5" },
      { title: "testing2" },
      { title: "testing1" },
    ]);
  })

  test("Searching for a post should return the one correct item", async () => {
    let searchForOne = await request.get("/post/search?search=testing4").send()
    expect(searchForOne.status).toBe(200);
    expect(searchForOne.body).toMatchObject([
      { title: "testing4" },
    ]);
  })
})

afterAll(async () => {
  await mockConnection.close();
  await server.stop();
})
