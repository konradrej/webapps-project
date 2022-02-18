import Express from "express";
import SuperTest from "supertest";

import { makePostRouter, postRouter } from "../post.router";
import { IPostService, } from "../../service/post.service";
import { Post } from "../../model/post.interface";
import { makePostController } from "../../controller/post.controller";

test("A PUT request to /createPost should send a response of post successfully created", () => {
    class MockPostService implements IPostService {
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

    const request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.post("/createPost").send({ title: "titleTest", description: "desscriptionTest", imageUrl: "imageTest", creator: 0 }).then((res) => {
        expect(res.statusCode).toBe(201);
    })
})


