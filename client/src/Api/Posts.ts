import axios, { AxiosResponse } from "axios";
import { Props as GridItemProps } from "../Components/GridItem/GridItem";

export const getPosts = async function (order: string): Promise<GridItemProps[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/", {
    timeout: 1000,
    params: {
      order: order
    }
  }).then((res: AxiosResponse): GridItemProps[] => {
    return formatPosts(res.data);
  })
}

export const searchPosts = async function (search: string): Promise<GridItemProps[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/search", {
    params: {
      search: search
    }
  }).then((res: AxiosResponse): GridItemProps[] => {
    return formatPosts(res.data);
  })
}

const formatPosts = (posts: any): GridItemProps[] => {
  posts.map(((value: any, _: number): void => {
    value.createdAt = new Date(value.createdAt);
  }));

  return posts;
}