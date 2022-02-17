import Express from "express";
import SuperTest from "supertest";

import { makePostRouter, postRouter } from "../post.router";
import { IPostService, } from "../../service/post.service";
import { Post } from "../../model/post.interface";
import { User } from "../../model/user.interface";

// Create the creator of the post
const creator: User =
{
    id: 1,
    username: "creatorName",
    password: "creatorPassword",
    email: "creatorMail",
    profileImageUrl: "creatorProfile",
    description: "creatorDescription",
    posts: [],
    createdAt: new Date(),
};
const updatedCreator: User =
{
    id: 2,
    username: "updatedCreatorName",
    password: "updatedCreatorPassword",
    email: "updatedCreatorMail",
    profileImageUrl: "updatedCreatorProfile",
    description: "updatedCreatorDescription",
    posts: [],
    createdAt: new Date(),
};


test("A PUT request to /createPost should send a response of post successfully created", () => {
    class MockPostService implements IPostService {
        createPost = async (title: string, description: string, imageUrl: string, creator: User): Promise<Post> => {
            return <Post>{};
        }

        getPosts = async (order: string): Promise<Array<Post>> => {
            throw ("Wrong method called");
        }

        updatePost = async (id: number, newTitle: string, newDescription: string, verifyCreator: User): Promise<boolean> => {
            throw ("Wrong method called");
        }

        getPost = async (id: number): Promise<Post> => {
            throw ("Wrong method called");
        }

        findById = async (id: number): Promise<Post | null> => {
            throw ("Wrong method called");
        }
    }

    const postService: MockPostService = new MockPostService();

    const router: Express.Express = Express();

    router.use(Express.json());

    router.use(makePostRouter(postService));

    const request: SuperTest.SuperTest<SuperTest.Test> = SuperTest(router);

    return request.post("/createPost").send({ title: "titleTest", description: "desscriptionTest", imageUrl: "imageTest", creator: creator }).then((res) => {
        expect(res.statusCode).toBe(201);
    })
})


