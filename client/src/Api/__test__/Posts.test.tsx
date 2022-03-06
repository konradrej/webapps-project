import axios, { AxiosResponse } from 'axios';
import { deletePost, updatePost } from '../Posts';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('These tests verify if a request has been called)', () => {
  test('Put request on updatePost', async () => {

    const mockedResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockedAxios.put.mockResolvedValueOnce(mockedResponse)
    expect(axios.put).not.toHaveBeenCalled();
    await updatePost(1, 1, "newTitle", "newDescription");
    expect(axios.put).toHaveBeenCalled();
  });

  test('Delete request on deletePost', async () => {

    const mockedResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockedAxios.delete.mockResolvedValueOnce(mockedResponse)
    expect(axios.delete).not.toHaveBeenCalled();
    await deletePost(1, 1);
    expect(axios.delete).toHaveBeenCalled();
  });
});