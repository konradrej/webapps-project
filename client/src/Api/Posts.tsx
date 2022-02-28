import axios, { AxiosResponse } from "axios";
import { Post } from "../../../server/src/model/post.interface";
import PostCard, { Props as PostCardProps } from "../Components/PostCard/PostCard";

export const getPosts = async function (order: string): Promise<JSX.Element[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/", {
    timeout: 1000,
    params: {
      order: order
    }
  }).then((res: AxiosResponse): JSX.Element[] => {
    const posts: PostCardProps[] = formatPosts(res.data);

    return createItems(posts);
  })
}

export const searchPosts = async function (search: string): Promise<JSX.Element[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/search/", {
    params: {
      search: search
    }
  }).then((res: AxiosResponse): JSX.Element[] => {
    const posts: PostCardProps[] = formatPosts(res.data);

    return createItems(posts);
  })
}

export const createPost = async function (title: string, description: string, imageUrl: string, creator: number): Promise<Post> {
  let ret = await axios.post(process.env.REACT_APP_BASE_API_URL + "/post/createPost", {
    title: title,
    description: description,
    imageUrl: imageUrl,
    creator: creator
  }).then((res) => {
    return res.data.status
  }).catch((err: any) => {
    throw err
  });
  return ret;
}

const createItems = (posts: PostCardProps[]): JSX.Element[] => {
  return posts.map((post: any, i: number) => {
    return <PostCard key={i} {...post} />;
  })
}

const formatPosts = (posts: any): PostCardProps[] => {
  return posts.map(((value: any, _: number): void => {
    value.createdAt = new Date(value.createdAt);

    return value;
  }));
}
