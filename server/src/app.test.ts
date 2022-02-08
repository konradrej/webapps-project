import { app } from "./app";
import SuperTest from "supertest";

test("If we POST sign-up and then login, we should get authorized", () => {
  const request : SuperTest.SuperTest<SuperTest.Test> = SuperTest(app);

  request.post("/user/sign-up")
    .send({username: "Test", password: "Test", email: "Test@Test.Test"})
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual({status: "User created"});
    })

  return request.post("/user/login")
    .send({username: "Test", password: "Test"})
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({status: "Authorized"});
    })
})