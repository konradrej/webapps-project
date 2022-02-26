import axios, { AxiosResponse } from "axios";
import GridItem, { Props as GridItemProps } from "../Components/GridItem/GridItem";

export const getPosts = async function (order: string): Promise<JSX.Element[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/", {
    timeout: 1000,
    params: {
      order: order
    }
  }).then((res: AxiosResponse): JSX.Element[] => {
    const posts: GridItemProps[] = formatPosts(res.data);
    
    return createItems(posts);
  })
}

export const searchPosts = async function (search: string): Promise<JSX.Element[]> {
  return axios.get(process.env.REACT_APP_BASE_API_URL + "/post/search/", {
    params: {
      search: search
    }
  }).then((res: AxiosResponse): JSX.Element[] => {
    const posts: GridItemProps[] = formatPosts(res.data);
    
    return createItems(posts);
  })
}

const createItems = (posts: GridItemProps[]): JSX.Element[] => {
  return posts.map((post: any, i: number) => {
    return <GridItem key={i} {...post} />;
  })
}

const formatPosts = (posts: any): GridItemProps[] => {
  return posts.map(((value: any, _: number): void => {
    value.createdAt = new Date(value.createdAt);

    return value;
  }));
}