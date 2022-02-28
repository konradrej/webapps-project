import { PostController } from '../post.controller';

test('postController should give throw error when giving wrong input', () => {
  expect(PostController?.validateCreatePost("", "ImageTitle", 0)).rejects.toThrowError(new Error('Missing title'))
  expect(PostController?.validateCreatePost("Title", "", 0)).rejects.toThrowError(new Error('Missing image'))
})

test("validateSearchPosts should return void (which results in undefined) on non falsy search string", () => {
  expect(PostController?.validateSearchPosts("Test")).resolves.toBeUndefined();
})

test("validateSearchPosts should throw error on falsy search string", async () => {
  expect(PostController?.validateSearchPosts("")).rejects.toThrowError(new Error("Missing search query"));
})