/**
 * Functions for handling unsplash related api call.
 */

import axios, { AxiosResponse } from "axios";
import styles from "./Unsplash.module.css";

type UnsplashItem = {
  id: string,
  thumbnailUrl: string,
  imageUrl: string,
  imageAlt: string,
  pageUrl: string
}

export const searchUnsplash = async function (search: string): Promise<any> {
  return axios.get("https://api.unsplash.com/search/photos/", {
    params: {
      query: search,
      client_id: process.env.REACT_APP_UNSPLASH_CLIENT_KEY,
      per_page: 25
    }
  }).then((res: AxiosResponse): UnsplashItem[] => {
    return res.data.results.map((value: any, _: number) => {
      return {
        id: value.id,
        thumbnailUrl: value.urls.small,
        imageUrl: value.urls.full,
        imageAlt: value.alt_description,
        pageUrl: value.links.html
      }
    });
  }).then((results: UnsplashItem[]): JSX.Element[] => {
    return createItems(results);
  })
}

const createItems = (results: UnsplashItem[]): JSX.Element[] => {
  return results.map((value: any, i: number) => {
    return (
      <a key={i} href={value.pageUrl} className={styles.unsplash_item} target="_blank" rel="noreferrer">
        <img src={value.thumbnailUrl} alt={value.imageAlt} />
      </a>
    )
  });
}