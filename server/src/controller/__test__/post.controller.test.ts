import { User } from '../../model/user.interface';
import { makePostController, PostController } from '../post.controller';

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

test('postController should give throw error when giving wrong input', () => {
  const postController: PostController = makePostController();

  expect(postController.createPost("", "ImageTitle", creator)).rejects.toThrowError(new Error('Missing title'))
  expect(postController.createPost("Title", "", creator)).rejects.toThrowError(new Error('Missing image'))
})