import { makePostController, PostController } from '../post.controller';

test('postController should give throw error when giving wrong input', () => {
  const postController: PostController = makePostController();

  expect(postController.validateCreatePost("", "ImageTitle", 0)).rejects.toThrowError(new Error('Missing title'))
  expect(postController.validateCreatePost("Title", "", 0)).rejects.toThrowError(new Error('Missing image'))
})