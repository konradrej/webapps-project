/**
 * Search page component, uses api to perform search
 * calls and displays retrieved data.
 */

import { useEffect, useMemo, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";
import styles from "./SearchPage.module.css";
import PopUp from "../../Components/Pop-ups/Pop-up";
import { useLocation } from "react-router-dom";
import { searchPosts } from "../../Api/Posts";
import { searchUnsplash } from "../../Api/Unsplash";

export type Props = {

}

const SearchPage = (_: Props) => {
  const { search } = useLocation();
  const searchQuery = useMemo(() => new URLSearchParams(search).get("search") ?? "", [search]);

  const [searchResult, setSearchResult] = useState<JSX.Element[] | null>(null);
  const [unsplashResult, setUnsplashResult] = useState<JSX.Element[] | null>(null);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);

  useEffect(() => {
    setErrorPopup(false);

    searchPosts(searchQuery).then((items: JSX.Element[]) => {
      setSearchResult(items);
    }).catch((_: any) => {
      setErrorPopup(true);
    });

    searchUnsplash(searchQuery).then((results: JSX.Element[]) => {
      setUnsplashResult(results);
    }).catch((e: any) => {
      setUnsplashResult([]);
      console.log(e);
    });
  }, [searchQuery])

  return (
    <>
      <Container>
        {searchResult ?
          <ItemGrid items={searchResult} />
          :
          <Spinner className={styles.spinner} animation="border" role="status">
            <span className="visually-hidden">Loading posts...</span>
          </Spinner>
        }
        {unsplashResult ?
          <>
            <h3 className={styles.unsplash_title}>Unsplash results for: {searchQuery}</h3>
            <ItemGrid items={unsplashResult} />
          </>
          :
          ((searchResult && searchResult.length === 0) &&
            <Spinner className={styles.spinner} animation="border" role="status">
              <span className="visually-hidden">Loading Unsplash suggestions...</span>
            </Spinner>
          )
        }
      </Container>
      {errorPopup ?
        <PopUp onClose={() => { setErrorPopup(false) }}>
          <span>Unable to get posts.</span>
          <br />
          <span>Please try again later.</span>
        </PopUp> : null
      }
    </>
  );
}

export default SearchPage;