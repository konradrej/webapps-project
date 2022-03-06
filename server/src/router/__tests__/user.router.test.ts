import Express from "express";
import SuperTest from "supertest";

import {makeUserRouter} from "../user.router";
import {IUserService} from "../../service/user.service";
import {User} from "../../model/user.interface";
import session from "express-session";

class MockUserService implements IUserService {
  serviceSucceed = false;

  login = async (): Promise<User | null> => {
    return this.serviceSucceed ? <User>{} : null;
  }

  register = async (): Promise<User> => {
    if (this.serviceSucceed)
      return <User>{};

    throw Error("Failed");
  }

  update = async (): Promise<boolean> => {
    return this.serviceSucceed
  }

  findById = async (): Promise<User | null> => {
    return this.serviceSucceed ? <User>{} : null;
  }

  findByUsername = async (): Promise<User | null> => {
    return this.serviceSucceed ? <User>{} : null;
  }

  setPassword = async (): Promise<boolean> => {
    return this.serviceSucceed
  }

  /** Make the mock action fail **/
  fail = () => {
    this.serviceSucceed = false;
  }

  /** Make the mock action succeed **/
  succeed = () => {
    this.serviceSucceed = true
  }
}

let userService: MockUserService,
    router: Express.Express,
    request: SuperTest.SuperTest<SuperTest.Test>,
    hasSession: boolean,
    /** Set whether session should be mocked or not */
    setSession = function (bool: boolean) {
      hasSession = bool;
    };


beforeEach(() => {
  userService = new MockUserService();
  router = Express();

  router.use(Express.json());
  router.use(session({
    secret: "test"
  }));

  router.use((req, res, next) => {
    req.session.currentUser = hasSession ? <User>{} : null;
    next();
  })

  router.use(makeUserRouter(userService));
  request = SuperTest(router);
});

test("A POST request to /login should send a response of unauthorized", () => {
  userService.fail();
  return request.post("/login").send({username: "TEST", password: "TEST"}).then((res) => {
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({status: "Unauthorized", reason: "Invalid Credentials"});
  })
})

test("A POST request /login should send a response of OK cause of successful login", () => {
  userService.succeed();
  return request.post("/login").send({username: "TEST", password: "TEST", email: "TEST"}).then((res) => {
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({status: "Authorized"});
  })
})

test("All auth guarded routes should be inaccessible to guests.", async () => {
  let unauthorizedProperty = {statusCode: 403};
  await expect(request.get("/session")).resolves.toMatchObject(unauthorizedProperty);
  await expect(request.put("/update/password")).resolves.toMatchObject(unauthorizedProperty);
  await expect(request.put("/update")).resolves.toMatchObject(unauthorizedProperty);
  await expect(request.post("/logout")).resolves.toMatchObject(unauthorizedProperty);
})

test("Sign-up should return 400 if registration fails", async () => {
  userService.fail();
  await expect(request.post("/sign-up")).resolves.toMatchObject({statusCode: 400});
})

test("Sign-up should return 201 if registration succeeds", async () => {
  userService.succeed();
  await expect(request.post("/sign-up").send({
    username: "TEST",
    password: "TEST",
    email: "test@example.com"
  })).resolves.toMatchObject({statusCode: 201});
})

test("Show user should return 200 and the user object if user exists", async () => {
  userService.succeed()
  await expect(request.get("/1")).resolves.toMatchObject({statusCode: 200});
})

test("Show user should return 404 if user does not exists", async () => {
  userService.fail()
  await expect(request.get("/1")).resolves.toMatchObject({statusCode: 404});
})

test("All guest-only routes should return 404", async () => {
  let unauthorizedProperty = {statusCode: 403};

  setSession(true);
  await expect(request.post("/login")).resolves.toMatchObject(unauthorizedProperty);
  await expect(request.post("/sign-up")).resolves.toMatchObject(unauthorizedProperty);
})

test("Update should return 200 if succeeded", async () => {
  userService.succeed();
  setSession(true);
  await expect(request.put("/update").send({
    description: "test",
    email: "test@email.com",
    profileImageUrl: "https://example.com"
  })).resolves.toMatchObject({statusCode: 200});
})

test("Update password route", async () => {
  setSession(true);

  userService.succeed();
  await expect(request.put("/update/password").send({password: "test"})).resolves.toMatchObject({statusCode: 200});

  userService.fail()
  await expect(request.put("/update/password").send({password: "123test"})).resolves.toMatchObject({statusCode: 400});
})


test("Get current user", async () => {
  setSession(true);

  userService.succeed();
  await expect(request.get("/session").send()).resolves.toMatchObject({statusCode: 200});
})

