import Express from "express";
import SuperTest from "supertest";

import { makePostRouter, postRouter } from "../post.router";
import { IPostService, } from "../../service/post.service";
import { Post } from "../../model/post.interface";
import { makePostController } from "../../controller/post.controller";

test("A POST request to /createPost should send a response of post successfully created", () => {
    class MockPostService implements IPostService {
        deletePost(id: number, verifyCreator: number): Promise<boolean> {
            throw new Error("Method not implemented.");
        }
        getUsersPosts(UserId: number): Promise<Post[]> {
            throw new Error("Method not implemented.");
        }
        createPost = async (title: string, description: string, imageUrl: string, creator: number): Promise<Post> => {
            return <Post>{};
        }

        getPosts = async (order: string): Promise<Array<Post>> => {
            throw new Error("Wrong method called");
        }

        updatePost = async (id: number, newTitle: string, newDescription: string, verifyCreator: number): Promise<boolean> => {
            throw new Error("Wrong method called");
        }

        getPost = async (id: number): Promise<Post> => {
            throw new Error("Wrong method called");
        }

        findById = async (id: number): Promise<Post | null> => {
            throw new Error("Wrong method called");
        }
    }

    const postService: MockPostService = new MockPostService();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService, makePostController()));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.post("/createPost").send({ title: "titleTest", description: "desscriptionTest", imageUrl: "imageTest", creator: 0 }).then((res) => {
        expect(res.statusCode).toBe(201)
    })
})

test("A POST request to /createPost should send a response of post failed to created", () => {
    class MockPostService implements IPostService {
        deletePost(id: number, verifyCreator: number): Promise<boolean> {
            throw new Error("Method not implemented.");
        }
        getUsersPosts(UserId: number): Promise<Post[]> {
            throw new Error("Method not implemented.");
        }
        createPost = async (title: string, description: string, imageUrl: string, creator: number): Promise<Post> => {
            return <Post>{};
        }

        getPosts = async (order: string): Promise<Array<Post>> => {
            throw new Error("Wrong method called");
        }

        updatePost = async (id: number, newTitle: string, newDescription: string, verifyCreator: number): Promise<boolean> => {
            throw new Error("Wrong method called");
        }

        getPost = async (id: number): Promise<Post> => {
            throw new Error("Wrong method called");
        }

        findById = async (id: number): Promise<Post | null> => {
            throw new Error("Wrong method called");
        }
    }

    const postService: MockPostService = new MockPostService();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService, makePostController()));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.post("/createPost").send({ title: "", description: "desscriptionTest", imageUrl: "imageTest", creator: 0 }).then((res) => {
        expect(res.statusCode).toBe(400);
    })
})

test("A GET request to / should get all posts and sorted by the query", () => {
    class MockPostService implements IPostService {
        deletePost(id: number, verifyCreator: number): Promise<boolean> {
            throw new Error("Method not implemented.");
        }
        getUsersPosts(UserId: number): Promise<Post[]> {
            throw new Error("Method not implemented.");
        }
        createPost = async (title: string, description: string, imageUrl: string, creator: number): Promise<Post> => {
            return <Post>{};
        }

        getPosts = async (order: string): Promise<Array<Post>> => {
            return Array<Post>()
        }

        updatePost = async (id: number, newTitle: string, newDescription: string, verifyCreator: number): Promise<boolean> => {
            throw new Error("Wrong method called");
        }

        getPost = async (id: number): Promise<Post> => {
            throw new Error("Wrong method called");
        }

        findById = async (id: number): Promise<Post | null> => {
            throw new Error("Wrong method called");
        }
    }

    const postService: MockPostService = new MockPostService();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService, makePostController()));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.get("/").query("").then((res) => {
        expect(res.statusCode).toBe(200)
    })
})

test("A GET request to / should get all posts and sorted by the query", () => {
    class MockPostService implements IPostService {
        deletePost(id: number, verifyCreator: number): Promise<boolean> {
            throw new Error("Method not implemented.");
        }
        getUsersPosts(UserId: number): Promise<Post[]> {
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
            throw new Error("Wrong method called");
        }

        findById = async (id: number): Promise<Post | null> => {
            throw new Error("Wrong method called");
        }
    }

    const postService: MockPostService = new MockPostService();
    const router: Express.Express = Express();
    router.use(Express.json());
    router.use(makePostRouter(postService, makePostController()));
    let request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.put("/:id/updatePost").send({ id: 1, title: "Test", description: "desscriptionTest", creator: 1 }).then((res) => {
        expect(res.statusCode).toBe(200)
    })
})




