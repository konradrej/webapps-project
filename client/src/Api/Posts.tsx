/**
 * Functions for handling api calls related to posts.
 */

import axios, {AxiosResponse} from "axios";
import PostCard, {Props as PostCardProps} from "../Components/PostCard/PostCard";

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

export const createPost = async function (title: string, description: string, imageUrl: string): Promise<string> {
  return await axios.post(process.env.REACT_APP_BASE_API_URL + `/post/`, {
    title: title,
    description: description,
    imageUrl: imageUrl
  }, {withCredentials: true}).then((res: AxiosResponse) => {
    return `${res.data.status}`
  }).catch((error) => {
    throw Error(`${error.response.data.status}, ${error.response.data.reason}`)
  });
}

export const createItems = (posts: PostCardProps[]): JSX.Element[] => {
  return posts
      .map(((value: any, _: number): void => {
        value.createdAt = new Date(value.createdAt);
        value.creatorId = value.creator.id;
        value.creatorUsername  = value.creator.username;
        value.creatorProfileImageUrl = value.creator.profileImageUrl;

        return value;
      }))
      .map((post: any, i: number) => {
        return <PostCard key={i} {...post} />;
      })
}

export const updatePost = async function (postId: number, newTitle: string, newDescription: string): Promise<string> {
  return await axios.put(process.env.REACT_APP_BASE_API_URL + `/post/${postId}`, {
    newTitle: newTitle,
    newDescription: newDescription
  }, {withCredentials: true}).then((res: AxiosResponse) => {
    return `${res.data.status}`
  }).catch((error) => {
    throw Error(`${error.response.data.status}, ${error.response.data.reason}`)
  });
}

export const deletePost = async function (postId: number): Promise<string> {
  return await axios.delete(process.env.REACT_APP_BASE_API_URL + `/post/${postId}`, {withCredentials: true})
      .then((res: AxiosResponse) => {
        return `${res.data.status}`
      }).catch((error) => {
        throw Error(`${error.response.data.status}, ${error.response.data.reason}`)
      });
}
