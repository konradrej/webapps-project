import axios, { AxiosResponse } from 'axios';
import { createPost, deletePost, getPosts, searchPosts, updatePost } from '../Posts';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedResponse: AxiosResponse = {
  data: {status: "OK"},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

describe('These tests verify if a request has been called)', () => {

  test('Post request on createPost', async () => {
    mockedAxios.post.mockResolvedValue(mockedResponse);
    expect(axios.post).not.toHaveBeenCalled();
    await expect(createPost("Title", "Description", "ImageUrl")).resolves.toEqual("OK");
    expect(axios.post).toHaveBeenCalled();
  });

  test('Put request on updatePost', async () => {

    mockedAxios.put.mockResolvedValue(mockedResponse);
    expect(axios.put).not.toHaveBeenCalled();
    await expect(updatePost(1, "newTitle", "newDescription")).resolves.toEqual("OK");
    expect(axios.put).toHaveBeenCalled();
  });

  test('Delete request on deletePost', async () => {

    mockedAxios.delete.mockResolvedValue(mockedResponse);
    expect(axios.delete).not.toHaveBeenCalled();
    await expect(deletePost(1)).resolves.toEqual("OK");
    expect(axios.delete).toHaveBeenCalled();
  });
  
});