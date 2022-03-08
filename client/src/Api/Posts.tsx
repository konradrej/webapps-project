import axios, { AxiosResponse } from "axios";
import PostCard, { Props as PostCardProps } from "../Components/PostCard/PostCard";

export const getPosts = async function (order: string): Promise<JSX.Element[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/", {
    timeout: 1000,
    params: {
      order: order
    }
  }).then((res: AxiosResponse): JSX.Element[] => createItems(res.data))
}

export const searchPosts = async function (search: string): Promise<JSX.Element[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/search/", {
    params: {
      search: search
    }
  }).then((res: AxiosResponse): JSX.Element[] => createItems(res.data))
}

export const createPost = async function (title: string, description: string, imageUrl: string, creator: number): Promise<string | null> {
  let ret = await axios.post(process.env.REACT_APP_BASE_API_URL + `/post/`, {
    title: title,
    description: description,
    imageUrl: imageUrl,
    creator: creator
  }).then((res: AxiosResponse) => {
    return `${res.data.status}`
  }).catch(function (error) {
    return `${error.response.data.status}, ${error.response.data.reason}`
  })
  return ret;
}

export const createItems = (posts: PostCardProps[]): JSX.Element[] => {
  return posts
      .map(((value: any, _: number): void => {
        value.createdAt = new Date(value.createdAt);
        value.creatorId = value.creator;

        return value;
      }))
      .map((post: any, i: number) => {
        return <PostCard key={i} {...post} />;
      })
}

export const updatePost = async function (postId: number, verifyCreator: number, newTitle: string, newDescription: string): Promise<string | null> {

  let rv = await axios.put(process.env.REACT_APP_BASE_API_URL + `/post/${postId}`, {
    newTitle: newTitle,
    newDescription: newDescription,
    verifyCreator: verifyCreator
  }).then((res: AxiosResponse) => {
    return `${res.data.status}`
  }).catch(function (error) {
    return `${error.response.data.status}, ${error.response.data.reason}`
  })
  return rv;
}

export const deletePost = async function (postId: number, verifyCreator: number): Promise<string | null> {

  let rv = await axios.delete(process.env.REACT_APP_BASE_API_URL + `/post/${postId}`, {
    data: { verifyCreator: verifyCreator }
  }).then((res: AxiosResponse) => {
    return `${res.data.status}`
  }).catch(function (error) {
    return `${error.response.data.status}, ${error.response.data.reason}`
  })
  return rv;
}
