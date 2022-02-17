import Express from "express";
import SuperTest from "supertest";

import { makeUserRouter } from "../user.router";
import { IUserService, IUpdateObject } from "../../service/user.service";
import { User } from "../../model/user.interface";
import session from "express-session";

test("A POST request to /login should send a response of unauthorized", () => {
  class MockUserService implements IUserService {
    login = async (username : string, password : string) : Promise<User | null> => {
      return null;
    }
    
    register = async (username: string, password: string, email: string) : Promise<User> => {
      throw("Wrong method called");
    }

    update = async (id: number, updateObject: IUpdateObject): Promise<boolean> => {
      throw("Wrong method called");
    }

    findById = async (id: number): Promise<User | null> => {
      throw("Wrong method called");
    }

    findByUsername = async (username: string): Promise<User | null> => {
      throw("Wrong method called");
    }
  
    setPassword = async (id: number, password: string): Promise<boolean> => {
      throw("Wrong method called");
    }
  }

  const userService : MockUserService = new MockUserService();

  const router : Express.Express = Express();

  router.use(Express.json());
  router.use(session({
    secret: "test"
  }));
  router.use(makeUserRouter(userService));

  const request : SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.post("/login").send({username: "TEST", password: "TEST"}).then((res) => {
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({status: "Invalid Credentials"});
  })
})

test("A POST request /login should send a response of OK cause of successful login", () => {
  class MockUserService implements IUserService {
    login = async (username : string, password : string) : Promise<User | null> => {
      return <User>{};
    }
    
    register = async (username: string, password: string, email: string) : Promise<User> => {
      throw("Wrong method called");
    }

    update = async (id: number, updateObject: IUpdateObject): Promise<boolean> => {
      throw("Wrong method called");
    }

    findById = async (id: number): Promise<User | null> => {
      throw("Wrong method called");
    }

    findByUsername = async (username: string): Promise<User | null> => {
      throw("Wrong method called");
    }
  
    setPassword = async (id: number, password: string): Promise<boolean> => {
      throw("Wrong method called");
    }
  }

  const userService : MockUserService = new MockUserService();

  const router : Express.Express = Express();

  router.use(Express.json());
  router.use(session({
    secret: "test"
  }));
  router.use(makeUserRouter(userService));

  const request : SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

  return request.post("/login").send({username: "TEST", password: "TEST", email: "TEST"}).then((res) => {
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({status: "Authorized"});
  })
})

/*

test("A POST request to /sign-up with username, password, email should send a response of created", () => {
  
})*/