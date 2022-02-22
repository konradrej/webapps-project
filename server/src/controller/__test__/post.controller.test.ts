import { makePostController, PostController } from '../post.controller';

let postController: PostController | null;

beforeEach(() => {
  postController = makePostController();
})

afterEach(() => {
  postController = null;
})

test('postController should give throw error when giving wrong input', () => {
  expect(postController?.validateCreatePost("", "ImageTitle", 0)).rejects.toThrowError(new Error('Missing title'))
  expect(postController?.validateCreatePost("Title", "", 0)).rejects.toThrowError(new Error('Missing image'))
})

test("validateSearchPosts should return void (which results in undefined) on non falsy search string", () => {
  expect(postController?.validateSearchPosts("Test")).resolves.toBeUndefined();
})

test("validateSearchPosts should throw error on falsy search string", async () => {
  expect(postController?.validateSearchPosts("")).rejects.toThrowError(new Error("Missing search query"));
})